package workers

import (
	"fmt"

	"github.com/Vijayhrithikk/shortly/internal/repositories"
)

func StartAnalyticsWorker() {
	fmt.Println("Analytics worker started")

	for {
		job, err := repositories.PopAnalyticsJob()

		if err != nil {
			fmt.Println("Worker error:", err)
			continue
		}

		code := job[1]
		maxRetries := 3
		success := false
		for i := 0; i < maxRetries; i++ {
			err = repositories.IncrementClicks(code)
			if err == nil {
				success = true
				break
			}
			fmt.Println("Failed attemp", i+1)

		}
		if !success {
			fmt.Println("Moving job to Dead Queue")
			_ = repositories.DeadQueue(code)
			continue
		}

		if err != nil {
			fmt.Println("Failed to increment clicks:", err)
			continue
		}

		fmt.Println("Processed Analytics for:", code)
	}
}
