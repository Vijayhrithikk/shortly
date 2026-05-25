package routes

import (
	"github.com/Vijayhrithikk/shortly/config"
	"github.com/Vijayhrithikk/shortly/internal/handlers"
	"github.com/Vijayhrithikk/shortly/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, cfg *config.Config) {
	router.GET("/health", handlers.HealthCheck)
	authRouter := handlers.NewAuthHandler(cfg)

	authRoutes := router.Group("/auth")
	{

		authRoutes.POST("/signup", authRouter.Signup)
		authRoutes.POST("/login", authRouter.Login)
	}
	router.POST("/shorten", middleware.AuthMiddlware(cfg), handlers.CreateShortURL)
	router.GET("/:code", handlers.RedirectURL)

}
