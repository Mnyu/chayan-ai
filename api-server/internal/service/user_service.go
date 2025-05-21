package service

import (
	"errors"
	"os"

	"github.com/mnyu/interviewer-api-server/internal/model"
)

type UserService struct{}

func NewUserService() *UserService {
	return &UserService{}
}

func (u *UserService) Login(username string, password string) (*model.LoginResponse, error) {
	API_SERVER_ADMIN_USERNAME := os.Getenv("API_SERVER_ADMIN_USERNAME")
	API_SERVER_ADMIN_PASSWORD := os.Getenv("API_SERVER_ADMIN_PASSWORD")
	API_SERVER_USER_PASSWORD := os.Getenv("API_SERVER_USER_PASSWORD")

	if username == API_SERVER_ADMIN_USERNAME && password == API_SERVER_ADMIN_PASSWORD {
		return &model.LoginResponse{Username: username, Role: "admin"}, nil
	}
	if password == API_SERVER_USER_PASSWORD {
		return &model.LoginResponse{Username: username, Role: "user"}, nil
	}
	return nil, errors.New("user not available")
}
