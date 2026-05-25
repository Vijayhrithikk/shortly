package services

import (
	"errors"
	"math/rand"
	"strings"
	"time"

	"github.com/Vijayhrithikk/shortly/internal/models"
	"github.com/Vijayhrithikk/shortly/internal/repositories"
)

func CreateShortURL(originalURL string, customCode string, userID int) (*models.URL, error) {
	normalizedURL := normalizeURL(originalURL)

	existingURL, err := repositories.GetURLByOriginal(userID, normalizedURL)

	if err == nil {
		return existingURL, nil
	}

	shortCode := customCode

	if shortCode == "" {
		shortCode = generateShortCode()
	}

	if repositories.ShortCodeExists(shortCode) {
		return nil, errors.New("short code already exists")
	}

	url := models.URL{
		OriginalURL: normalizedURL,
		ShortCode:   shortCode,
		UserID:      userID,
	}

	err = repositories.SaveURL(url)

	if err != nil {
		return nil, err
	}

	return &url, nil
}

func GetOriginalURL(code string) (*models.URL, error) {
	return repositories.GetURLByCode(code)
}

func normalizeURL(url string) string {
	if !strings.HasPrefix(url, "http://") &&
		!strings.HasPrefix(url, "https://") {
		return "https://" + url
	}

	return url
}

func generateShortCode() string {
	rand.Seed(time.Now().UnixNano())

	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	code := make([]byte, 6)

	for i := range code {
		code[i] = charset[rand.Intn(len(charset))]
	}

	return string(code)
}

func GetUserURLs(userID int) ([]models.URL, error) {
	return repositories.GetURLsByUserID(userID)
}
