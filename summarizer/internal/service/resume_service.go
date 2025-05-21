package service

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"

	"github.com/mnyu/interviewer-summarizer/internal/model"
	"github.com/mnyu/interviewer-summarizer/internal/utils"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

// const SYSTEM_PROMPT = `You are an AI interviewer assistant for software engineering roles. You specialize in extracting well structured summary from the resume of the candidate which can help you plan your interview structure and questions by summarizing the resume into sections
// 	- Candidate Details - this should have only the name of the candidate
// 	- Technologies - this should have all the technologies mentioned by the candidate.
// 	- Projects or Work Experience - this should have all the projects mentioned by the candidate. Only extract the name of the project, role of the candidate in this project and technologies used in this project.
// 	- Achievements - Only extract achivemenets which are related to software engineering domain.
// 	The summary should strictly be in json format without any string formatting.
// `

const RESUME_SYSTEM_PROMPT = `You are an AI interviewer assistant for software engineering roles. You specialize in 2 things :
1. Extracting summary from candidate resume
2. Preparing a list of questions to be asked in the interview

Role to interview for = Senior Software Engineer

Follow the below rules strictly :
1. Extract summary from candidate resume into sections:
		- Candidate Details - this should only have the name of the candidate and industry work experience
		- Technologies - this should have a list of top 5 technologies mentioned by the candidate that are suitable for this 	role and these should be arranged in priority order with top priority first in the list.
		- Projects or Work Experience - this should have a list of 3 projects mentioned by the candidate which are apt for this role. Only extract the name of the project, role of the candidate in this project and technologies used in this project. 
		- Achievements - Only extract achivemenets which are related to software engineering domain.

2. Preparing a list of questions to be asked in the interview
		- Come up with questions, guidelines to answer each question for a 30 minute interview which has the following structure
		- The interview should last for approx 30 minutes and these 30 minutes should be divided as below in the same order:
			- Section - Introduction - 1 minute
			- Section - Core Computer Science Concepts - 5 minutes
			- Section - Programming Languages, Frameworks and Technologies mentioned in the resume - 10 minutes
			- Section - Project 1 mentioned in the resume - 5 minutes
			- Section - Project 2 mentioned in the resume - 5 minutes
			- Section - Behavioural questions - 4 minutes
		- Add followup questions as well to test candidate's conceptual clarity, technical expertise, or practical experience in depth instead of breadth. 
		- The Topic derivation for the question : 
      Introduction - for Section Introduction
      Core Computer Science Concepts - for Section Core Computer Science Concepts
      Actual Programming Language name or Actual Framework name or Actual Technology name - for each individual language, framework or technology that comes under the Section - Programming Languages, Frameworks and Technologies mentioned in the resume
      Actual Project Name - for Section Project 1 mentioned in the resume
      Actual Project Name - for Section Project 2 mentioned in the resume
      Behavioral - for Section Behavioural questions

3. Do not call out the section name in any question.
4. Ask only one clear, specific question at a time. Avoid compound or ambiguous questions. Use follow-up questions to explore the depth in knowledge/experience/expertise
5. Ask in-depth, specific how and why questions about the architecture, implementation of technology, trade-offs instead of general overview. Every question should have a follow up question to help you better rate the candidate.

NOTE : The summary and questions should strictly be in json format without any string formatting.
`

type ResumeService struct {
	Client             openai.Client //TODO : Think if Client should be here or not
	Model              string
	ResumeSchema       interface{}
	ObjectStoreService *ObjectStoreService
	InterviewService   *InterviewService
}

func NewResumeService(apiKey string, modelName string, objectStoreService *ObjectStoreService,
	interviewService *InterviewService) *ResumeService {
	client := openai.NewClient(option.WithAPIKey(apiKey))
	// Generate the JSON schema at initialization time
	// resumeResponseSchema := generateSchema[model.Resume]()
	resumeResponseSchema := utils.GenerateSchema[model.InterviewPrep]()
	return &ResumeService{Client: client, Model: modelName, ResumeSchema: resumeResponseSchema,
		ObjectStoreService: objectStoreService, InterviewService: interviewService}
}

func (r *ResumeService) GenerateSummary(message *model.ResumeSummaryMsg) error {
	slog.Info("Interview id : " + message.InterviewId)
	interview, err := r.InterviewService.GetInterview(message.InterviewId)
	if err != nil {
		return err
	}
	if interview.Status != "REGISTERED" {
		return errors.New("the status of interview should be REGISTERED")
	}
	slog.Info("Getting images from object store")
	base64Images, err := r.ObjectStoreService.GetBase64Images(message.InterviewId)
	if err != nil {
		return err
	}
	slog.Info("Generating summary")
	interviewPrep, err := r.GetSummary(*base64Images)
	if err != nil {
		return err
	}

	interview.ResumeSummary = &interviewPrep.Resume
	interview.Questions = &interviewPrep.Questions
	err = r.InterviewService.UpdateInterview(interview)
	if err != nil {
		return err
	}
	slog.Info("Interview updated in DB")
	return nil
}

func (r *ResumeService) GetSummary(base64Images []string) (*model.InterviewPrep, error) {
	imageMsgs := []openai.ChatCompletionContentPartUnionParam{}
	for _, base64Image := range base64Images {
		imageMsg := openai.ChatCompletionContentPartUnionParam{
			OfImageURL: &openai.ChatCompletionContentPartImageParam{
				ImageURL: openai.ChatCompletionContentPartImageImageURLParam{
					URL: "data:image/png;base64," + base64Image,
				},
			},
		}
		imageMsgs = append(imageMsgs, imageMsg)
	}

	msgs := []openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(RESUME_SYSTEM_PROMPT),
		openai.UserMessage(imageMsgs),
	}

	schemaParam := openai.ResponseFormatJSONSchemaJSONSchemaParam{
		Name:        "resume",
		Description: openai.String("Resume of the candidate"),
		Schema:      r.ResumeSchema,
		Strict:      openai.Bool(true),
	}

	params := openai.ChatCompletionNewParams{
		Model:    r.Model,
		Messages: msgs,
		ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{
			OfJSONSchema: &openai.ResponseFormatJSONSchemaParam{
				JSONSchema: schemaParam,
			},
		},
	}
	chatCompletion, err := r.Client.Chat.Completions.New(context.TODO(), params)
	if err != nil {
		return nil, err
	}

	summary := chatCompletion.Choices[0].Message.Content
	// slog.Info("INTERVIEW PREP : " + summary)
	var interviewPrep model.InterviewPrep
	err = json.Unmarshal([]byte(summary), &interviewPrep)
	if err != nil {
		return nil, err
	}
	return &interviewPrep, nil
}
