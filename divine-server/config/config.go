package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort  string
	DbUser      string
	DbPassword  string
	DbHost      string
	DbName      string
	DbSSL       string
	DbPort      int
	AllowOrigin string
}

var Env = initConfig()

func initConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port, err := strconv.Atoi(os.Getenv("POSTGRES_PORT"))
	if err != nil {
		log.Fatal("wrong port")
	}

	return Config{
		ServerPort:  os.Getenv("PORT"),
		DbUser:      os.Getenv("POSTGRES_USER"),
		DbPassword:  os.Getenv("POSTGRES_PASSWORD"),
		DbHost:      os.Getenv("POSTGRES_HOST"),
		DbName:      os.Getenv("POSTGRES_DB"),
		DbSSL:       os.Getenv("POSTGRES_SSL"),
		DbPort:      port,
		AllowOrigin: os.Getenv("CLIENT_ORIGIN"),
	}
}
