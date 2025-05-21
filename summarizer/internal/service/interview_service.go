package service

import (
	"github.com/mnyu/interviewer-summarizer/internal/model"
	"github.com/mnyu/interviewer-summarizer/internal/repository"
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

func (i *InterviewService) UpdateInterview(interview *model.Interview) error {
	return i.InterviewRepository.UpdateInterview(interview)
}
