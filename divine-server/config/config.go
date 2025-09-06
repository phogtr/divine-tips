package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort string
	DbUser     string
	DbPassword string
	DbHost     string
	DbName     string
	DbPort     int
}

var Env = initConfig()

func initConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return Config{
		ServerPort: os.Getenv("PORT"),
		DbUser:     os.Getenv("POSTGRES_USER"),
		DbPassword: os.Getenv("POSTGRES_PASSWORD"),
		DbHost:     os.Getenv("POSTGRES_HOST"),
		DbName:     os.Getenv("POSTGRES_DB"),
		DbPort:     5432,
	}
}
