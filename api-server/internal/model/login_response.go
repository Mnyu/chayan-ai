package model

type LoginResponse struct {
	Username string `json:"username"`
	Role     string `json:"role"`
}
