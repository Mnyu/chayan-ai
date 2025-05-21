package repository

import "github.com/mnyu/interviewer-summarizer/internal/model"

type InterviewRepository interface {
	GetInterview(id string) (*model.Interview, error)

	UpdateInterview(interview *model.Interview) error
}
