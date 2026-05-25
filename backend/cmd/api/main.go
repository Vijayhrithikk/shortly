package main

import (
	"fmt"

	"github.com/Vijayhrithikk/shortly/config"
	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/Vijayhrithikk/shortly/internal/routes"
	"github.com/gin-gonic/gin"
)

func main() {

	cfg := config.LoadConfig()
	fmt.Println(cfg.JWT_SECRET)
	database.ConnectDB(cfg)

	router := gin.Default()
	routes.SetupRoutes(router, cfg)
	router.Run(":8080")
}
