package main

import (
	"github.com/Vijayhrithikk/shortly/config"
	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/Vijayhrithikk/shortly/internal/routes"
	"github.com/gin-gonic/gin"
)

func main() {

	cfg := config.LoadConfig()

	database.ConnectDB(cfg)

	router := gin.Default()
	routes.SetupRoutes(router)
	router.Run(":8080")
}
