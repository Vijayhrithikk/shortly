package main

import (
	"github.com/Vijayhrithikk/shortly/config"
	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/Vijayhrithikk/shortly/internal/logger"
	"github.com/Vijayhrithikk/shortly/internal/metrics"
	"github.com/Vijayhrithikk/shortly/internal/middleware"
	"github.com/Vijayhrithikk/shortly/internal/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {

	cfg := config.LoadConfig()
	logger.Init()

	defer logger.Log.Sync()

	database.ConnectDB(cfg)
	database.ConnectRedis()
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
		},
	}))
	router.Use(middleware.RateLimit())
	router.Use(middleware.LoggerMiddleware())
	metrics.Init()

	router.Use(
		middleware.PrometheusMiddleware(),
	)
	router.GET(
		"/metrics",
		gin.WrapH(promhttp.Handler()),
	)
	routes.SetupRoutes(router, cfg)
	router.Run(":8080")
}
