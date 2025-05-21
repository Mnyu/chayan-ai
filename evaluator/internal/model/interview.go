package model

import "time"

type Interview struct {
	Id            string               `json:"id"`
	UserId        string               `json:"userId"`
	UserName      string               `json:"userName"`
	CreatedAt     time.Time            `json:"createdAt"`
	Status        string               `json:"status"`
	ResumePath    string               `json:"resumePath"`
	ResumeSummary *Resume              `json:"resumeSummary"`
	Transcript    *[]TranscriptMessage `json:"transcript"`
	Evaluation    *Evaluation          `json:"evaluation"`
}

type TranscriptMessage struct {
	Role      string  `json:"role"`
	Content   string  `json:"content"`
	CreatedAt float64 `json:"created_at"`
}

type Evaluation struct {
	Recommendation      string            `json:"recommendation"`
	OverallRating       float32           `json:"overallRating"`
	OverallFeedback     string            `json:"overallFeedback"`
	TechnologiesRating  float32           `json:"technologiesRating"`
	ProjectsRating      float32           `json:"projectsRating"`
	CommunicationRating float32           `json:"communicationRating"`
	EvaluationItems     *[]EvaluationItem `json:"evaluationItems"`
}

type EvaluationItem struct {
	Question   string   `json:"question"`
	Answer     string   `json:"answer"`
	Rating     float32  `json:"rating"`
	Guidelines []string `json:"guidelines"`
}
