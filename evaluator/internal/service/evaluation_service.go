package service

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"

	"github.com/mnyu/interviewer-evaluator/internal/model"
	"github.com/mnyu/interviewer-evaluator/utils"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

const EVALUATION_SYSTEM_PROMPT = `You are an AI assistant specialized in evaluating the performance of a candidate in an interview based on the given role, given resume of the candidate and the given transcript of the whole interview by the user.

The transcript is in the form of json array where each json object represents a message from either the interviewer or the canididate. The josn objects contains fields - role, content and created_at. 
If the role in json object is assistant, that means it is the interviewer who spoke that content. 
If the role in json object is user, that means it is the candidate who spoke that content. 

With the knowledge of resume and transcript, you need a evaluate the answers and give up a rating between 1 to 5 with 5 being excellent and 1 being bad. Along with that you also need to provide the guidelines to improve the answers to the candidate.

Note that a question can also be a followup to the previous question. So, when evaluating and rating a question, find whether the question is a followup or not, if yes, rate the the question accordingly.

After each question is evaluated, based on your ratings, you must also evaluate and give 4 more ratings between 1 to 5 with 5 being excellent and 1 being bad on the below overall aspects:
1. Technologies
2. Projects
3. Communication 

Finally, you must give :
1. An overall rating for the interview which should be the average of Technologies, Projects and Communication ratings rounded upto 1 decimal.  
2. Final recommendation as either "HIRE" or "NOT HIRE". Overall rating of 3 or above means "HIRE". 
3. Overall feedback of the candidate in 4-5 sentences aligned with final recommendation highlighing strengths and weaknesses.

Rules to be followed strictly : 
1. Do not trim any question or any answer, return full question and answer in the output.
2. Return all the requested output in the form of JSON.
3. If no answers are present in transcript for Technologies, Projects give the rating as 0.
4. If no answers are present in trnscript for a question, give the rating as 0.
5. If candidate has not given a single answer, give Communication rating as 0.
`

type EvaluationService struct {
	InterviewService *InterviewService
	Client           openai.Client //TODO : Think if Client should be here or not
	Model            string
	EvaluationSchema interface{}
}

func NewEvaluationService(interviewService *InterviewService, apiKey string, modelName string) *EvaluationService {
	client := openai.NewClient(option.WithAPIKey(apiKey))
	// Generate the JSON schema at initialization time
	evaluationSchema := utils.GenerateSchema[model.Evaluation]()
	return &EvaluationService{InterviewService: interviewService, Client: client, Model: modelName, EvaluationSchema: evaluationSchema}
}

func (e *EvaluationService) EvaluateInterview(message *model.EvaluateInterviewMsg) error {
	interviewId := message.InterviewId
	interview, err := e.InterviewService.GetInterview(interviewId)
	if err != nil {
		return err
	}
	if interview.Status != "PENDING_EVALUATION" {
		return errors.New("status not equal to PENDING_EVALUATION for interview : " + interview.Id)
	}
	if interview.ResumeSummary == nil || interview.Transcript == nil {
		return errors.New("both resume summary and transcript are required to evaluate interview : " + interview.Id)
	}
	role := "Role = Senior Software Engineer"
	resumeBytes, err := json.Marshal(interview.ResumeSummary)
	if err != nil {
		return err
	}
	transcriptBytes, err := json.Marshal(interview.Transcript)
	if err != nil {
		return err
	}
	userMessage := role + string(resumeBytes) + string(transcriptBytes)

	schemaParam := openai.ResponseFormatJSONSchemaJSONSchemaParam{
		Name:        "evaluation",
		Description: openai.String("Evaluation of the interview"),
		Schema:      e.EvaluationSchema,
		Strict:      openai.Bool(true),
	}
	slog.Info("Evaluating interview...")
	params := openai.ChatCompletionNewParams{
		Model: e.Model,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(EVALUATION_SYSTEM_PROMPT),
			openai.UserMessage(userMessage),
		},
		ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{
			OfJSONSchema: &openai.ResponseFormatJSONSchemaParam{
				JSONSchema: schemaParam,
			},
		},
	}
	chatCompletion, err := e.Client.Chat.Completions.New(context.TODO(), params)
	if err != nil {
		return err
	}

	evaluationString := chatCompletion.Choices[0].Message.Content
	slog.Info("Evaluation complete by AI. Converion to object pending.")
	var evaluation model.Evaluation
	err = json.Unmarshal([]byte(evaluationString), &evaluation)
	if err != nil {
		return err
	}
	err = e.InterviewService.UpdateEvaluation(interview.Id, &evaluation)
	if err != nil {
		return err
	}
	slog.Info("Evaluation updated in DB.")
	return nil
}
