package handlers

import (
	"net/http"

	"github.com/Vijayhrithikk/shortly/config"
	"github.com/Vijayhrithikk/shortly/internal/models"
	"github.com/Vijayhrithikk/shortly/internal/services"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	Config *config.Config
}

func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		Config: cfg,
	}
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var req models.SignupRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}
	exists := services.FindUserByEmail(req.Email)

	if exists == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user already exists",
		})
		return
	}

	err := services.SignUp(req.Email, req.Password)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to signup",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "user created successfully",
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	token, err := services.Login(req.Email, req.Password, h.Config)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}
