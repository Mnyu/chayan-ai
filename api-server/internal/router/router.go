package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mnyu/interviewer-api-server/internal/controller"
)

func New(connectionController *controller.ConnectionController,
	uploadController *controller.UploadController, userController *controller.UserController,
	interviewController *controller.InterviewController) *gin.Engine {
	gin.SetMode(gin.DebugMode)
	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/api/login", userController.Login())
	router.POST("/api/connect", connectionController.Connect())
	router.POST("/api/disconnect", connectionController.Disconnect())
	router.POST("/api/upload", uploadController.SaveFile())
	router.DELETE("/api/delete", uploadController.DeleteFile())
	router.POST("/api/interviews/", interviewController.Register())
	router.GET("/api/interviews/", interviewController.GetAllInterviews())
	router.GET("/api/interviews/:id", interviewController.GetInterview())
	router.GET("/api/interviews/evaluate/:id", interviewController.EvaluateInterview())
	return router
}
