package handlers

import (
	"net/http"

	"github.com/Vijayhrithikk/shortly/internal/models"
	"github.com/Vijayhrithikk/shortly/internal/services"

	"github.com/gin-gonic/gin"
)

func CreateShortURL(c *gin.Context) {
	var req models.ShortenRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	url, err := services.CreateShortURL(req.URL)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create short URL",
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
		c.JSON(http.StatusNotFound, gin.H{
			"error": "short URL not found",
		})
		return
	}

	c.Redirect(http.StatusMovedPermanently, url.OriginalURL)
}
