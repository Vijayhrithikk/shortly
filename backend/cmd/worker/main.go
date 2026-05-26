package main

import (
	"github.com/Vijayhrithikk/shortly/config"
	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/Vijayhrithikk/shortly/internal/workers"
)

func main() {
	cfg := config.LoadConfig()

	database.ConnectDB(cfg)
	database.ConnectRedis()

	workers.StartAnalyticsWorker()
}
