package model

type RegisterRequest struct {
	Name     string `json:"name"`
	FileName string `json:"fileName"`
	FilePath string `json:"filePath"`
}
