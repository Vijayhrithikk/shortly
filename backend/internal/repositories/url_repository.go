package repositories

import (
	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/Vijayhrithikk/shortly/internal/models"
)

func SaveURL(url models.URL) error {
	query := `
		INSERT INTO urls (original_url, short_code, user_id)
		VALUES ($1, $2, $3)
	`

	_, err := database.DB.Exec(
		query,
		url.OriginalURL,
		url.ShortCode,
		url.UserID,
	)

	return err
}

func GetURLByCode(code string) (*models.URL, error) {
	query := `
		SELECT id, original_url, short_code, created_at, user_id
		FROM urls
		WHERE short_code = $1
	`

	var url models.URL

	err := database.DB.QueryRow(query, code).Scan(
		&url.ID,
		&url.OriginalURL,
		&url.ShortCode,
		&url.CreatedAt,
		&url.UserID,
	)

	if err != nil {
		return nil, err
	}

	return &url, nil
}

func GetURLByOriginal(userID int, original string) (*models.URL, error) {
	query := `
		SELECT id, original_url, short_code, created_at, user_id
		FROM urls
		WHERE user_id = $1 and original_url = $2
	`

	var url models.URL

	err := database.DB.QueryRow(query, userID, original).Scan(
		&url.ID,
		&url.OriginalURL,
		&url.ShortCode,
		&url.CreatedAt,
		&url.UserID,
	)

	if err != nil {
		return nil, err
	}

	return &url, nil
}

func ShortCodeExists(code string) bool {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM urls WHERE short_code = $1
		)
	`

	var exists bool

	err := database.DB.QueryRow(query, code).Scan(&exists)

	if err != nil {
		return false
	}

	return exists
}

func GetURLsByUserID(userID int) ([]models.URL, error) {
	query := `
		SELECT id, original_url, short_code, user_id, created_at
		FROM urls
		WHERE user_id = $1
		ORDER BY created_at DESC
	`

	rows, err := database.DB.Query(query, userID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var urls []models.URL

	for rows.Next() {
		var url models.URL

		err := rows.Scan(
			&url.ID,
			&url.OriginalURL,
			&url.ShortCode,
			&url.UserID,
			&url.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		urls = append(urls, url)
	}
	return urls, nil
}
