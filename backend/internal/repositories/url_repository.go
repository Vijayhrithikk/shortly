package repositories

import (
	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/Vijayhrithikk/shortly/internal/models"
)

func SaveURL(url models.URL) error {
	query := `
		INSERT INTO urls (original_url, short_code)
		VALUES ($1, $2)
	`

	_, err := database.DB.Exec(
		query,
		url.OriginalURL,
		url.ShortCode,
	)

	return err
}

func GetURLByCode(code string) (*models.URL, error) {
	query := `
		SELECT id, original_url, short_code, created_at
		FROM urls
		WHERE short_code = $1
	`

	var url models.URL

	err := database.DB.QueryRow(query, code).Scan(
		&url.ID,
		&url.OriginalURL,
		&url.ShortCode,
		&url.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &url, nil
}
