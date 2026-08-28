package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort   string
	DbUser       string
	DbPassword   string
	DbHost       string
	DbName       string
	DbSSL        string
	DbPort       int
	AllowOrigins []string
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
		ServerPort:   os.Getenv("PORT"),
		DbUser:       os.Getenv("POSTGRES_USER"),
		DbPassword:   os.Getenv("POSTGRES_PASSWORD"),
		DbHost:       os.Getenv("POSTGRES_HOST"),
		DbName:       os.Getenv("POSTGRES_DB"),
		DbSSL:        os.Getenv("POSTGRES_SSL"),
		DbPort:       port,
		AllowOrigins: splitOrigin(os.Getenv("CLIENT_ORIGIN")),
	}
}

func splitOrigin(str string) []string {
	if str == "" {
		return []string{}
	}

	parts := strings.Split(str, ",")
	for i, part := range parts {
		parts[i] = strings.TrimSpace(part)
	}
	return parts
}
