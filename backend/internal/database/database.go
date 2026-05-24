package database

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/Vijayhrithikk/shortly/config"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB(cfg *config.Config) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DB_HOST,
		cfg.DB_PORT,
		cfg.DB_USER,
		cfg.DB_PASSWORD,
		cfg.DB_NAME,
		cfg.DB_SSLMODE)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect Database", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal("database unreachable:", err)
	}

	fmt.Println("Connected to PostgreSQL")

	DB = db
}
