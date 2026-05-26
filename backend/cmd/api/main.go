package main

import (
	"github.com/Vijayhrithikk/shortly/config"
	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/Vijayhrithikk/shortly/internal/middleware"
	"github.com/Vijayhrithikk/shortly/internal/routes"
	"github.com/gin-gonic/gin"
)

func main() {

	cfg := config.LoadConfig()
	database.ConnectDB(cfg)
	database.ConnectRedis()
	router := gin.Default()
	router.Use(middleware.RateLimit())
	routes.SetupRoutes(router, cfg)
	router.Run(":8080")
}
