package controller

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnyu/interviewer-api-server/internal/model"
	"github.com/mnyu/interviewer-api-server/internal/service"
)

type ConnectionController struct {
	ConnectionService *service.ConnectionService
}

func NewConnectionController(connectionService *service.ConnectionService) *ConnectionController {
	return &ConnectionController{ConnectionService: connectionService}
}

func (this *ConnectionController) Connect() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req model.ConnectionRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}
		token, err := this.ConnectionService.Connect(req.InterviewId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, "error")
		}
		c.JSON(http.StatusOK, &model.ConnectionResponse{Token: token})
	}
}

func (this *ConnectionController) Disconnect() gin.HandlerFunc {
	return func(c *gin.Context) {
		var disconnectReq model.DisconnectRequest
		if err := c.ShouldBindJSON(&disconnectReq); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}
		err := this.ConnectionService.Disconnect(disconnectReq.RoomName, disconnectReq.UserId)
		if err != nil {
			slog.Error(err.Error())
			c.JSON(http.StatusInternalServerError, &model.DisconnectResponse{Error: "Unable to disconnect. Please check logs"})
			return
		}
		c.JSON(http.StatusOK, &model.DisconnectResponse{Error: ""})
	}
}
