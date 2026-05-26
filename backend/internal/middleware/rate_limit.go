package middleware

import (
	"net/http"
	"time"

	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/gin-gonic/gin"
)

func RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		key := "rate_limit:" + ip

		count, err := database.RedisClient.Incr(
			database.Ctx,
			key,
		).Result()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "rate limiter failed",
			})
			c.Abort()
			return
		}

		if count == 1 {
			database.RedisClient.Expire(
				database.Ctx,
				key,
				time.Minute,
			)
		}
		if count > 10 {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "rate limitexceeded",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
