package repository

import "github.com/mnyu/interviewer-api-server/internal/model"

type InterviewRepository interface {
	// CreateInterview(username string, resumePath string, resumeSummary *model.Resume) (*model.Interview, error)

	CreateInterview(id string, username string, resumePath string) (*model.Interview, error)

	GetAllInterviews() ([]*model.Interview, error)

	GetInterview(id string) (*model.Interview, error)

	UpdateEvaluation(id string, evaluation *model.Evaluation) error
}
