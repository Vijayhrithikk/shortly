package models

import "time"

type URL struct {
	ID           int        `json:"id"`
	OriginalURL  string     `json:"original_url"`
	ShortCode    string     `json:"short_code"`
	CreatedAt    time.Time  `json:"created_at"`
	UserID       int        `json:"user_id"`
	Clicks       int        `json:"clicks"`
	LastAccessed *time.Time `json:"last_accessed"`
}

type ShortenRequest struct {
	URL        string `json:"url" binding:"required,url"`
	CustomCode string `json:"custom_code"`
}
