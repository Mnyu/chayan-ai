package model

type JobMetadata struct {
	InterviewId   string          `json:"interviewId"`
	ResumeSummary *Resume         `json:"resume"`
	Questions     *[]QuestionPrep `json:"questions"`
}
