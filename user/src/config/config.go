package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	PORT               string
	MONGO_URI          string
	JWT_SECRET         string
	JWT_ACCESS_SECRET  string
	JWT_REFRESH_SECRET string
)

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	PORT = os.Getenv("PORT")
	MONGO_URI = os.Getenv("MONGO_URI")
	JWT_SECRET = os.Getenv("JWT_SECRET")
	JWT_ACCESS_SECRET = os.Getenv("JWT_ACCESS_SECRET")
	JWT_REFRESH_SECRET = os.Getenv("JWT_REFRESH_SECRET")
}
