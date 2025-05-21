package service

import (
	"context"
	"log/slog"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type ObjectStoreService struct {
	Client *minio.Client
	Bucket string
}

func NewObjectStorageService(endpoint string, accessKey string, secretKey string, bucket string) (*ObjectStoreService, error) {
	options := &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: false,
	}
	client, err := minio.New(endpoint, options)
	if err != nil {
		return nil, err
	}
	err = createBucketIfNotExists(client, bucket)
	if err != nil {
		return nil, err
	}
	return &ObjectStoreService{Client: client, Bucket: bucket}, nil
}

func createBucketIfNotExists(client *minio.Client, bucketName string) error {
	exists, err := client.BucketExists(context.Background(), bucketName)
	if err != nil {
		return err
	}
	if exists {
		slog.Info("Bucket already exists")
		return nil
	}
	err = client.MakeBucket(context.Background(), bucketName, minio.MakeBucketOptions{})
	if err != nil {
		return err
	}
	slog.Info("Successfully created bucket : " + bucketName)
	return nil
}

func (o *ObjectStoreService) PutObject(filePath string, objectName string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()
	fileStat, err := file.Stat()
	if err != nil {
		return err
	}
	options := minio.PutObjectOptions{ContentType: "image/png"}
	_, err = o.Client.PutObject(context.Background(), o.Bucket, objectName, file, fileStat.Size(), options)
	if err != nil {
		return err
	}
	slog.Info("successfully uploaded file : " + objectName)
	return nil
}
