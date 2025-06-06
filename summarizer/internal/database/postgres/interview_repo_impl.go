package postgres

import (
	"database/sql"
	"encoding/json"

	"github.com/mnyu/interviewer-summarizer/internal/model"
)

type InterviewRepositoryPostgres struct {
	Db *sql.DB
}

func NewInterviewRepository(db *sql.DB) *InterviewRepositoryPostgres {
	return &InterviewRepositoryPostgres{Db: db}
}

func (repo *InterviewRepositoryPostgres) GetInterview(id string) (*model.Interview, error) {
	query := `SELECT INTERVIEW_ID, USERNAME, CREATED_AT, STATUS, RESUME_PATH, RESUME_SUMMARY, TRANSCRIPT FROM INTERVIEW WHERE INTERVIEW_ID=$1`

	stmt, err := repo.Db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer func() { CloseStatement(stmt) }()

	var resumeSummaryBytes []byte
	var transcriptBytes []byte
	var interview model.Interview
	err = stmt.QueryRow(id).Scan(&interview.Id, &interview.UserName, &interview.CreatedAt, &interview.Status, &interview.ResumePath, &resumeSummaryBytes, &transcriptBytes)
	if err != nil {
		return nil, err
	}
	if len(resumeSummaryBytes) > 0 {
		if err := json.Unmarshal(resumeSummaryBytes, &interview.ResumeSummary); err != nil {
			return nil, err
		}
	}
	if len(transcriptBytes) > 0 {
		if err := json.Unmarshal(transcriptBytes, &interview.Transcript); err != nil {
			return nil, err
		}
	}
	return &interview, nil
}

func (repo *InterviewRepositoryPostgres) UpdateInterview(interview *model.Interview) error {
	query := `UPDATE INTERVIEW SET RESUME_SUMMARY = $1, QUESTIONS = $2, STATUS='SCHEDULED' WHERE INTERVIEW_ID = $3`
	summaryBytes, err := json.Marshal(interview.ResumeSummary)
	if err != nil {
		return err
	}
	questionsBytes, err := json.Marshal(interview.Questions)
	if err != nil {
		return err
	}
	_, err = repo.Db.Exec(query, summaryBytes, questionsBytes, interview.Id)
	if err != nil {
		return err
	}
	return nil
}
