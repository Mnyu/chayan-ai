package controller

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type UploadController struct {
}

func NewUploadController() *UploadController {
	return &UploadController{}
}

func (this *UploadController) SaveFile() gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
			return
		}
		if filepath.Ext(file.Filename) != ".pdf" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Only PDF files are allowed"})
			return
		}

		maxFileSize := int64(300 * 1024) // Maximum file size allowed (e.g., 300KB)
		if file.Size > maxFileSize {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Size of resume cannot be greater than 300KB"})
			return
		}

		savePath := filepath.Join("uploads", file.Filename)
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":  "File uploaded successfully",
			"fileName": file.Filename,
			"filePath": savePath,
		})
	}
}

func (this *UploadController) DeleteFile() gin.HandlerFunc {
	return func(c *gin.Context) {
		fileName := c.Query("fileName")
		if filepath.Ext(fileName) != ".pdf" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Only PDF files can be deleted"})
			return
		}
		filePath := filepath.Join("uploads", filepath.Base(fileName))
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
			return
		}
		if err := os.Remove(filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "File deleted successfully"})
	}
}
