package model

type InterviewPrep struct {
	Resume    Resume         `json:"resume"`
	Questions []QuestionPrep `json:"questions"`
}

type QuestionPrep struct {
	Topic              string     `json:"topic" jsonschema_description:"The topic to which the question belongs"`
	Question           string     `json:"question" jsonschema_description:"The question candidate"`
	GuidelinesToAnswer []string   `json:"guidelinesToAnswer" jsonschema_description:"The guidelines to answer the question"`
	FollowUps          []FollowUp `json:"followUps" jsonschema_description:"The followup questions to the main question"`
}

type FollowUp struct {
	Topic              string   `json:"topic" jsonschema_description:"The topic to which this follow up question belongs"`
	Question           string   `json:"question" jsonschema_description:"The question candidate"`
	GuidelinesToAnswer []string `json:"guidelinesToAnswer" jsonschema_description:"The guidelines to answer the question"`
}

type Resume struct {
	Name         string    `json:"name" jsonschema_description:"The name of the candidate"`
	Experience   string    `json:"experience" jsonschema_description:"The work experience of the candidate in years"`
	Technologies []string  `json:"technologies" jsonschema_description:"The technologies that the candidate has worked on"`
	Projects     []Project `json:"projects" jsonschema_description:"The projects done by candidate"`
	Achievements []string  `json:"achievements" jsonschema_description:"Any achievements in software engineering domain"`
}

type Project struct {
	Title        string   `json:"title" jsonschema_description:"The title of the project"`
	Role         string   `json:"role" jsonschema_description:"The role of candidate in the project"`
	Technologies []string `json:"technologies" jsonschema_description:"The technologies used in this project"`
	Company      string   `json:"company" jsonschema_description:"The company for which this project was done"`
}
