package postgres

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/mnyu/interviewer-api-server/internal/model"
)

type InterviewRepositoryPostgres struct {
	Db *sql.DB
}

func NewInterviewRepository(db *sql.DB) *InterviewRepositoryPostgres {
	return &InterviewRepositoryPostgres{Db: db}
}

func (repo *InterviewRepositoryPostgres) CreateInterview(id string, username string, resumePath string) (*model.Interview, error) {
	query := `INSERT INTO INTERVIEW(INTERVIEW_ID, USER_ID, USERNAME, CREATED_AT, STATUS, RESUME_PATH) VALUES($1, $2, $3, $4, $5, $6)`
	interview := &model.Interview{
		Id:         id,
		UserId:     "4feb4f6b-0711-407c-98a5-f8a9a0c42d08",
		UserName:   username,
		CreatedAt:  time.Now(),
		Status:     "REGISTERED",
		ResumePath: resumePath,
	}
	_, err := repo.Db.Exec(query, interview.Id, interview.UserId, interview.UserName, interview.CreatedAt,
		interview.Status, interview.ResumePath)
	if err != nil {
		return nil, err
	}
	return interview, nil
}

func (repo *InterviewRepositoryPostgres) GetAllInterviews() ([]*model.Interview, error) {
	query := `SELECT INTERVIEW_ID, USERNAME, DATE_TRUNC('second', CREATED_AT::timestamp), STATUS, RESUME_PATH FROM INTERVIEW ORDER BY CREATED_AT DESC`

	stmt, err := repo.Db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer func() { CloseStatement(stmt) }()

	rows, err := stmt.Query()
	if err != nil {
		return nil, err
	}
	defer func() { CloseRows(rows) }()

	interviews := []*model.Interview{}
	for rows.Next() {
		interview := &model.Interview{}
		err := rows.Scan(&interview.Id, &interview.UserName, &interview.CreatedAt, &interview.Status, &interview.ResumePath)
		if err != nil {
			return nil, err
		}
		interviews = append(interviews, interview)
	}
	return interviews, nil
}

func (repo *InterviewRepositoryPostgres) GetInterview(id string) (*model.Interview, error) {
	query := `SELECT INTERVIEW_ID, USERNAME, DATE_TRUNC('second', CREATED_AT::timestamp), STATUS, RESUME_PATH, RESUME_SUMMARY, TRANSCRIPT, EVALUATION FROM INTERVIEW WHERE INTERVIEW_ID=$1`

	stmt, err := repo.Db.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer func() { CloseStatement(stmt) }()

	var resumeSummaryBytes []byte
	var transcriptBytes []byte
	var evaluationBytes []byte
	var interview model.Interview
	err = stmt.QueryRow(id).Scan(&interview.Id, &interview.UserName, &interview.CreatedAt, &interview.Status, &interview.ResumePath, &resumeSummaryBytes, &transcriptBytes, &evaluationBytes)
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
	if len(evaluationBytes) > 0 {
		if err := json.Unmarshal(evaluationBytes, &interview.Evaluation); err != nil {
			return nil, err
		}
	}
	return &interview, nil
}

func (repo *InterviewRepositoryPostgres) UpdateEvaluation(id string, evaluation *model.Evaluation) error {
	query := `UPDATE INTERVIEW SET EVALUATION = $1 WHERE INTERVIEW_ID = $2`
	evaluationBytes, err := json.Marshal(evaluation)
	if err != nil {
		return err
	}
	_, err = repo.Db.Exec(query, evaluationBytes, id)
	if err != nil {
		return err
	}
	return nil
}
