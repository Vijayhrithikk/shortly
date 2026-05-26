package repositories

import (
	"github.com/Vijayhrithikk/shortly/internal/database"
)

func PushAnalyticsJob(code string) error {
	return database.RedisClient.RPush(
		database.Ctx,
		"analytics_queue",
		code,
	).Err()
}

func PopAnalyticsJob() ([]string, error) {
	return database.RedisClient.BLPop(
		database.Ctx,
		0,
		"analytics_queue",
	).Result()
}

func DeadQueue(code string) error {
	return database.RedisClient.RPush(
		database.Ctx,
		"dead_queue",
		code,
	).Err()
}
