package handlers

import (
	"net/http"

	"github.com/Vijayhrithikk/shortly/internal/logger"
	"github.com/Vijayhrithikk/shortly/internal/models"
	"github.com/Vijayhrithikk/shortly/internal/services"
	"go.uber.org/zap"

	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateShortURL(c *gin.Context) {
	var req models.ShortenRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		ip := c.ClientIP()
		user := c.GetString("user_id")
		logger.Log.Error("Invalid url entered", zap.String("By ip", ip), zap.String("user", user))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	userID := int(c.GetFloat64("user_id"))

	url, err := services.CreateShortURL(req.URL, req.CustomCode, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"original_url": url.OriginalURL,
		"short_code":   url.ShortCode,
	})
}

func RedirectURL(c *gin.Context) {
	code := c.Param("code")

	url, err := services.GetOriginalURL(code)

	if err != nil {
		c.JSON(404, gin.H{
			"error": "page not found",
		})
		return
	}

	c.Redirect(http.StatusMovedPermanently, url.OriginalURL)
}

func GetMyURLs(c *gin.Context) {
	userID := int(c.GetFloat64("user_id"))

	urls, err := services.GetUserURLs(userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch URLs",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"urls": urls,
	})
}

func DeleteURL(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.Atoi(idParam)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid URL id",
		})
		return
	}

	userID := int(c.GetFloat64("user_id"))

	err = services.DeleteUserURL(id, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "URL deleted successfully",
	})
}
