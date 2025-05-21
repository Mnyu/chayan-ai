package controller

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnyu/interviewer-api-server/internal/model"
	"github.com/mnyu/interviewer-api-server/internal/service"
)

type InterviewController struct {
	InterviewService *service.InterviewService
}

func NewInterviewController(interviewService *service.InterviewService) *InterviewController {
	return &InterviewController{InterviewService: interviewService}
}

func (this *InterviewController) Register() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req model.RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}
		interview, err := this.InterviewService.Register(req.Name, req.FileName, req.FilePath)
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, `{"error" : "unable to register"}`)
		}
		c.JSON(http.StatusOK, interview)
	}
}

func (this *InterviewController) GetAllInterviews() gin.HandlerFunc {
	return func(c *gin.Context) {
		interviews, err := this.InterviewService.GetAllInterviews()
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, `{"error" : "unable to get all interviews"}`)
		}
		c.JSON(http.StatusOK, interviews)
	}
}

func (this *InterviewController) GetInterview() gin.HandlerFunc {
	return func(c *gin.Context) {
		interviewId := c.Param("id")
		interview, err := this.InterviewService.GetInterview(interviewId)
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, `{"error" : "unable to get interview"}`)
		}
		c.JSON(http.StatusOK, interview)
	}
}

func (this *InterviewController) EvaluateInterview() gin.HandlerFunc {
	return func(c *gin.Context) {
		interviewId := c.Param("id")
		interview, err := this.InterviewService.EvaluateInterview(interviewId)
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, `{"error" : "unable to evaluate interview"}`)
		}
		c.JSON(http.StatusOK, interview)
	}
}
