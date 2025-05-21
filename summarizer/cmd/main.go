package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"os"

	"github.com/mnyu/interviewer-summarizer/internal/database/postgres"
	"github.com/mnyu/interviewer-summarizer/internal/model"
	"github.com/mnyu/interviewer-summarizer/internal/service"
	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	slog.Info("main started")

	POSTGRES_HOST := os.Getenv("POSTGRES_HOST")
	POSTGRES_PORT := os.Getenv("POSTGRES_PORT")
	POSTGRES_DB := os.Getenv("POSTGRES_DB")
	POSTGRES_USER := os.Getenv("POSTGRES_USER")
	POSTGRES_PASSWORD := os.Getenv("POSTGRES_PASSWORD")
	OPENAI_API_KEY := os.Getenv("OPENAI_API_KEY")
	OPENAI_RESUME_SUMMARY_MODEL := os.Getenv("OPENAI_RESUME_SUMMARY_MODEL")
	RABBITMQ_HOST := os.Getenv("RABBITMQ_HOST")
	RABBITMQ_PORT := os.Getenv("RABBITMQ_PORT")
	RABBITMQ_USER := os.Getenv("RABBITMQ_USER")
	RABBITMQ_PASSWORD := os.Getenv("RABBITMQ_PASSWORD")
	RABBITMQ_RESUME_SUMMARY_QUEUE := os.Getenv("RABBITMQ_RESUME_SUMMARY_QUEUE")
	MINIO_ENDPOINT := os.Getenv("MINIO_ENDPOINT")
	MINIO_ROOT_USER := os.Getenv("MINIO_ROOT_USER")
	MINIO_ROOT_PASSWORD := os.Getenv("MINIO_ROOT_PASSWORD")
	MINIO_RESUME_BUCKET := os.Getenv("MINIO_RESUME_BUCKET")

	// Database setup
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
	db, err := postgres.NewDBHandle(connStr)
	if err != nil {
		slog.Error("Cannot connect to database : " + err.Error())
		return
	}
	slog.Info("Database connection successful")
	defer func() { postgres.CloseDBHandle(db) }()

	interviewRepo := postgres.NewInterviewRepository(db)

	interviewService := service.NewInterviewService(interviewRepo)

	objectStorageService, err := service.NewObjectStorageService(MINIO_ENDPOINT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_RESUME_BUCKET)
	if err != nil {
		slog.Error(err.Error())
		return
	}
	resumeService := service.NewResumeService(OPENAI_API_KEY, OPENAI_RESUME_SUMMARY_MODEL, objectStorageService, interviewService)

	// RabbitMQ Setup
	rabbitMQUrl := fmt.Sprintf("amqp://%s:%s@%s:%s/", RABBITMQ_USER, RABBITMQ_PASSWORD, RABBITMQ_HOST, RABBITMQ_PORT)
	conn, err := amqp.Dial(rabbitMQUrl)
	if err != nil {
		slog.Error("Cannot create connection with rabbitmq url : " + rabbitMQUrl + " due to : " + err.Error())
		return
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		slog.Error("Cannot get channel from rabbitmq connection : " + err.Error())
		return
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(RABBITMQ_RESUME_SUMMARY_QUEUE, true, false, false, false, nil)

	if err != nil {
		slog.Error("Cannot declare queue " + RABBITMQ_RESUME_SUMMARY_QUEUE + " : " + err.Error())
		return
	}

	msgs, err := ch.Consume(q.Name, "", true, false, false, false, nil)

	if err != nil {
		slog.Error("Cannot consume msgs : " + err.Error())
		return
	}

	var forever chan struct{}

	go func() {
		for d := range msgs {
			slog.Info(fmt.Sprintf("Received a message: %s", d.Body))
			var message model.ResumeSummaryMsg
			slog.Info(string(d.Body))
			err := json.Unmarshal(d.Body, &message)
			if err != nil {
				slog.Error("Cannot unmarshal msg : " + err.Error())
			}
			err = resumeService.GenerateSummary(&message)
			if err != nil {
				slog.Error("Error in generating resume summary : " + err.Error())
			}
		}
	}()

	slog.Info(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
