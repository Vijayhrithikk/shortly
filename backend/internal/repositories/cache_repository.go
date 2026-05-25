package repositories

import (
	"time"

	"github.com/Vijayhrithikk/shortly/internal/database"
)

func SetCache(code string, originalURL string) error {
	return database.RedisClient.Set(
		database.Ctx,
		code,
		originalURL,
		time.Hour,
	).Err()
}

func GetCache(code string) (string, error) {
	return database.RedisClient.Get(
		database.Ctx,
		code,
	).Result()
}
