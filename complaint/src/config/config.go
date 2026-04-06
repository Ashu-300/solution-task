package config

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/joho/godotenv"
)

var (
	PORT                  string
	MONGO_URI             string
	JWT_ACCESS_SECRET     string
	CLOUDINARY_CLOUD_NAME string
	CLOUDINARY_API_KEY    string
	CLOUDINARY_API_SECRET string
)

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	PORT = os.Getenv("PORT")
	MONGO_URI = os.Getenv("MONGO_URI")
	JWT_ACCESS_SECRET = os.Getenv("JWT_ACCESS_SECRET")
	if JWT_ACCESS_SECRET == "" {
		JWT_ACCESS_SECRET = os.Getenv("JWT_SECRET")
	}
	CLOUDINARY_CLOUD_NAME = os.Getenv("CLOUDINARY_CLOUD_NAME")
	CLOUDINARY_API_KEY = os.Getenv("CLOUDINARY_API_KEY")
	CLOUDINARY_API_SECRET = os.Getenv("CLOUDINARY_API_SECRET")
}

func UploadToCloudinary(file multipart.File) (string, error) {
	if CLOUDINARY_CLOUD_NAME == "" || CLOUDINARY_API_KEY == "" || CLOUDINARY_API_SECRET == "" {
		return "", fmt.Errorf("cloudinary configuration is missing")
	}

	cld, err := cloudinary.NewFromParams(CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
	if err != nil {
		return "", err
	}

	uploadResult, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{})
	if err != nil {
		return "", err
	}

	if uploadResult.SecureURL == "" {
		return "", fmt.Errorf("cloudinary did not return secure_url")
	}

	return uploadResult.SecureURL, nil
}
