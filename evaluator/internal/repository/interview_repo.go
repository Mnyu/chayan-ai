package repository

import "github.com/mnyu/interviewer-evaluator/internal/model"

type InterviewRepository interface {
	GetInterview(id string) (*model.Interview, error)

	UpdateEvaluation(id string, evaluation *model.Evaluation) error
}
