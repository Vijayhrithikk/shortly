package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
)

var RequestCounter = prometheus.NewCounterVec(
	prometheus.CounterOpts{
		Name: "http_requests_total",
		Help: "Total HTTP requests",
	},
	[]string{"path", "method"},
)

func Init() {
	prometheus.MustRegister(RequestCounter)
}
