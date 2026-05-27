package middleware

import (
	"github.com/Vijayhrithikk/shortly/internal/metrics"

	"github.com/gin-gonic/gin"
)

func PrometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		metrics.RequestCounter.WithLabelValues(
			c.FullPath(),
			c.Request.Method,
		).Inc()
	}
}
