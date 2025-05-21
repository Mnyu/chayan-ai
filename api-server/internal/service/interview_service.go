package service

import (
	"fmt"
	"image/png"
	"log/slog"
	"os"
	"path/filepath"
	"strings"

	"github.com/gen2brain/go-fitz"
	"github.com/google/uuid"
	"github.com/mnyu/interviewer-api-server/internal/model"
	"github.com/mnyu/interviewer-api-server/internal/repository"
	amqp "github.com/rabbitmq/amqp091-go"
)

type InterviewService struct {
	InterviewRepository repository.InterviewRepository
	ResumeService       *ResumeService
	EvaluationService   *EvaluationService
	ObjectStoreService  *ObjectStoreService
	QService            *QService
	Channel             *amqp.Channel
	QueueName           string
}

func NewInterviewService(interviewRepo repository.InterviewRepository, resumeService *ResumeService,
	evaluationService *EvaluationService, objectStoreService *ObjectStoreService, qService *QService, channel *amqp.Channel, queueName string) *InterviewService {
	return &InterviewService{InterviewRepository: interviewRepo, ResumeService: resumeService,
		EvaluationService: evaluationService, ObjectStoreService: objectStoreService, QService: qService, Channel: channel, QueueName: queueName}
}

// func (i *InterviewService) Register(name string, fileName string, filePath string) (*model.Interview, error) {
// 	resumeSummary, err := i.ResumeService.GetSummary(fileName, filePath)
// 	if err != nil {
// 		return nil, err
// 	}
// 	interview, err := i.InterviewRepository.CreateInterview(name, filePath, resumeSummary)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return interview, nil
// }

func (i *InterviewService) Register(name string, fileName string, filePath string) (*model.Interview, error) {
	interviewId := uuid.NewString()

	imagePaths, err := i.convertToImages(interviewId, filePath, fileName)
	if err != nil {
		return nil, err
	}
	err = i.uploadToObjectStorage(imagePaths)
	if err != nil {
		return nil, err
	}
	resumeSummarMsg := &model.ResumeSummaryMsg{InterviewId: interviewId, ResumePathPrefix: ""}
	err = i.QService.SendMessage(i.Channel, i.QueueName, resumeSummarMsg)
	if err != nil {
		return nil, err
	}
	interview, err := i.InterviewRepository.CreateInterview(interviewId, name, filePath)
	if err != nil {
		return nil, err
	}
	i.deleteImages(imagePaths)
	return interview, nil
}

func (i *InterviewService) GetAllInterviews() ([]*model.Interview, error) {
	return i.InterviewRepository.GetAllInterviews()
}

func (i *InterviewService) GetInterview(id string) (*model.Interview, error) {
	return i.InterviewRepository.GetInterview(id)
}

func (i *InterviewService) EvaluateInterview(id string) (*model.Interview, error) {
	interview, err := i.GetInterview(id)
	if err != nil {
		return nil, err
	}
	evaluation, err := i.EvaluationService.EvaluateInterview(interview)
	if err != nil {
		return nil, err
	}
	err = i.InterviewRepository.UpdateEvaluation(interview.Id, evaluation)
	if err != nil {
		return nil, err
	}
	interview.Evaluation = evaluation
	return interview, nil
}

func (i *InterviewService) uploadToObjectStorage(imagePaths []string) error {
	for _, imagePath := range imagePaths {
		objectName := strings.Replace(imagePath, "uploads/images/", "", 1)
		err := i.ObjectStoreService.PutObject(imagePath, objectName)
		if err != nil {
			return err
		}
	}
	return nil
}

func (i *InterviewService) convertToImages(interviewId string, filePath string, fileName string) ([]string, error) {
	imagePaths := []string{}
	subFolder, _, _ := strings.Cut(fileName, ".")
	outputDir := "uploads/images/" + interviewId + "/" + subFolder

	doc, err := fitz.New(filePath)
	if err != nil {
		return nil, err
	}
	defer doc.Close()

	numPages := doc.NumPage()
	err = os.MkdirAll(outputDir, os.ModePerm)
	if err != nil {
		return nil, err
	}

	for index := range numPages {
		img, err := doc.Image(index)
		if err != nil {
			return nil, err
		}

		// Create the output file
		imageName := fmt.Sprintf("page_%d.png", index+1)
		outputFilePath := filepath.Join(outputDir, imageName)
		outFile, err := os.Create(outputFilePath)
		if err != nil {
			return nil, err
		}
		defer outFile.Close()

		// Encode the image as PNG and save it to the file
		err = png.Encode(outFile, img)
		if err != nil {
			return nil, err
		}

		imagePaths = append(imagePaths, outputFilePath)

		slog.Info(fmt.Sprintf("Page %d saved as %s\n", index+1, outputFilePath))
	}
	return imagePaths, nil
}

func (i *InterviewService) deleteImages(imagePaths []string) {
	for _, imagePath := range imagePaths {
		if _, err := os.Stat(imagePath); os.IsNotExist(err) {
			continue
		}
		if err := os.Remove(imagePath); err != nil {
			slog.Error("Unable to delete image at : " + imagePath)
		}
	}
}
