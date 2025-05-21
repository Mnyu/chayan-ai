package model

type ConnectionRequest struct {
	Username      string `json:"username"`
	ResumeSummary Resume `json:"resumeSummary"`
	InterviewId   string `json:"interviewId"`
}
