package service

import (
	"github.com/mnyu/interviewer-evaluator/internal/model"
	"github.com/mnyu/interviewer-evaluator/internal/repository"
)

type InterviewService struct {
	InterviewRepository repository.InterviewRepository
}

func NewInterviewService(interviewRepo repository.InterviewRepository) *InterviewService {
	return &InterviewService{InterviewRepository: interviewRepo}
}

func (i *InterviewService) GetInterview(id string) (*model.Interview, error) {
	return i.InterviewRepository.GetInterview(id)
}

func (i *InterviewService) UpdateEvaluation(id string, evaluation *model.Evaluation) error {
	return i.InterviewRepository.UpdateEvaluation(id, evaluation)
}
