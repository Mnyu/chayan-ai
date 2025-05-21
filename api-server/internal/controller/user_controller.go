package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mnyu/interviewer-api-server/internal/model"
	"github.com/mnyu/interviewer-api-server/internal/service"
)

type UserController struct {
	UserService *service.UserService
}

func NewUserController(userService *service.UserService) *UserController {
	return &UserController{UserService: userService}
}

func (this *UserController) Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req model.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}
		loginResponse, err := this.UserService.Login(req.Username, req.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
		}
		c.JSON(http.StatusOK, loginResponse)
	}
}
