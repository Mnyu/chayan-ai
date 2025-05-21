package main

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/mnyu/interviewer-api-server/internal/controller"
	"github.com/mnyu/interviewer-api-server/internal/database/postgres"
	"github.com/mnyu/interviewer-api-server/internal/router"
	"github.com/mnyu/interviewer-api-server/internal/service"
)

func main() {
	slog.Info("main started")

	POSTGRES_HOST := os.Getenv("POSTGRES_HOST")
	POSTGRES_PORT := os.Getenv("POSTGRES_PORT")
	POSTGRES_DB := os.Getenv("POSTGRES_DB")
	POSTGRES_USER := os.Getenv("POSTGRES_USER")
	POSTGRES_PASSWORD := os.Getenv("POSTGRES_PASSWORD")
	LIVEKIT_URL := os.Getenv("LIVEKIT_URL")
	LIVEKIT_API_KEY := os.Getenv("LIVEKIT_API_KEY")
	LIVEKIT_API_SECRET := os.Getenv("LIVEKIT_API_SECRET")
	OPENAI_API_KEY := os.Getenv("OPENAI_API_KEY")
	OPENAI_RESUME_SUMMARY_MODEL := os.Getenv("OPENAI_RESUME_SUMMARY_MODEL")
	OPENAI_EVALUATE_INTERVIEW_MODEL := os.Getenv("OPENAI_EVALUATE_INTERVIEW_MODEL")
	RABBITMQ_HOST := os.Getenv("RABBITMQ_HOST")
	RABBITMQ_PORT := os.Getenv("RABBITMQ_PORT")
	RABBITMQ_USER := os.Getenv("RABBITMQ_USER")
	RABBITMQ_PASSWORD := os.Getenv("RABBITMQ_PASSWORD")
	RABBITMQ_RESUME_SUMMARY_QUEUE := os.Getenv("RABBITMQ_RESUME_SUMMARY_QUEUE")
	MINIO_ENDPOINT := os.Getenv("MINIO_ENDPOINT")
	MINIO_ROOT_USER := os.Getenv("MINIO_ROOT_USER")
	MINIO_ROOT_PASSWORD := os.Getenv("MINIO_ROOT_PASSWORD")
	MINIO_RESUME_BUCKET := os.Getenv("MINIO_RESUME_BUCKET")
	API_SERVER_HTTP_ADDR := os.Getenv("API_SERVER_HTTP_ADDR")

	// Database Setup
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB)
	db, err := postgres.NewDBHandle(connStr)
	if err != nil {
		slog.Error("Cannot connect to database : " + err.Error())
		return
	}
	slog.Info("Database connection successful")
	defer func() { postgres.CloseDBHandle(db) }()

	// RabbitMQ Setup
	qService := service.NewQService()
	conn, ch, err := qService.SetupQueue(RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD, RABBITMQ_RESUME_SUMMARY_QUEUE)
	if err != nil {
		slog.Error(err.Error())
		return
	}
	slog.Info("RabbitMQ setup complete")
	defer ch.Close()
	defer conn.Close()

	// Initialize Reposttories, Services and Controllers
	interviewRepo := postgres.NewInterviewRepository(db)

	userService := service.NewUserService()
	roomService := service.NewRoomService(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
	resumeService := service.NewResumeService(OPENAI_API_KEY, OPENAI_RESUME_SUMMARY_MODEL)
	evaluationService := service.NewEvaluationService(OPENAI_API_KEY, OPENAI_EVALUATE_INTERVIEW_MODEL)
	objectStorageService, err := service.NewObjectStorageService(MINIO_ENDPOINT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_RESUME_BUCKET)
	if err != nil {
		slog.Error(err.Error())
		return
	}

	interviewService := service.NewInterviewService(interviewRepo, resumeService, evaluationService, objectStorageService, qService, ch, RABBITMQ_RESUME_SUMMARY_QUEUE)
	connectionService := service.NewConnectionService(roomService, interviewService)

	userController := controller.NewUserController(userService)
	connectionController := controller.NewConnectionController(connectionService)
	uploadController := controller.NewUploadController()
	interviewController := controller.NewInterviewController(interviewService)

	// REST API Server Setup
	apiRouter := router.New(connectionController, uploadController, userController, interviewController)
	address := API_SERVER_HTTP_ADDR
	server := &http.Server{
		Addr:    address,
		Handler: apiRouter,
	}
	slog.Info("Started server at : " + address)
	if err := server.ListenAndServe(); err != nil {
		if errors.Is(err, http.ErrServerClosed) {
			slog.Info("Server closed under request")
		} else {
			slog.Error("Server closed unexpectedly : " + err.Error())
		}
	}
}
