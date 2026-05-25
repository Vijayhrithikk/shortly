package routes

import (
	"github.com/Vijayhrithikk/shortly/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	router.GET("/health", handlers.HealthCheck)
	router.POST("/shorten", handlers.CreateShortURL)
	router.GET("/:code", handlers.RedirectURL)
}
