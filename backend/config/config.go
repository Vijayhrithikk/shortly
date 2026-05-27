package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	PORT        string
	DB_HOST     string
	DB_PORT     string
	DB_USER     string
	DB_PASSWORD string
	DB_NAME     string
	DB_SSLMODE  string
	JWT_SECRET  string
	REDIS_ADDR  string
}

func LoadConfig() *Config {
	_ = godotenv.Load()

	//if err != nil {
	//	log.Println("Error loading .env file", err)
	//}
	return &Config{
		PORT:        os.Getenv("PORT"),
		DB_HOST:     os.Getenv("DB_HOST"),
		DB_PORT:     os.Getenv("DB_PORT"),
		DB_USER:     os.Getenv("DB_USER"),
		DB_PASSWORD: os.Getenv("DB_PASSWORD"),
		DB_NAME:     os.Getenv("DB_NAME"),
		DB_SSLMODE:  os.Getenv("DB_SSLMODE"),
		JWT_SECRET:  os.Getenv("JWT_SECRET"),
		REDIS_ADDR:  os.Getenv("REDIS_ADDR"),
	}
}
