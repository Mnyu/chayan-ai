package service

import (
	"context"
	"encoding/base64"
	"io"
	"log/slog"

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

func (o *ObjectStoreService) GetBase64Images(prefix string) (*[]string, error) {
	base64Images := []string{}
	options := minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: true,
	}
	objectCh := o.Client.ListObjects(context.Background(), o.Bucket, options)
	for object := range objectCh {
		if object.Err != nil {
			slog.Error(object.Err.Error())
			return nil, object.Err
		}
		base64Img, err := o.GetObject(object.Key)
		if err != nil {
			return nil, err
		}
		base64Images = append(base64Images, base64Img)

	}
	return &base64Images, nil
}

func (o *ObjectStoreService) GetObject(objectKey string) (string, error) {
	// Read object content
	options := minio.GetObjectOptions{}
	obj, err := o.Client.GetObject(context.Background(), o.Bucket, objectKey, options)
	if err != nil {
		return "", err
	}
	defer obj.Close()

	// Read all the object's content
	objectBytes, err := io.ReadAll(obj)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(objectBytes), nil
}
