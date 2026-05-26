package repositories

import (
	"errors"

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
		SELECT id, original_url, short_code, created_at, user_id, clicks, last_accessed
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
		&url.Clicks,
		&url.LastAccessed,
	)

	if err != nil {
		return nil, err
	}

	return &url, nil
}

func GetURLByOriginal(userID int, original string) (*models.URL, error) {
	query := `
		SELECT id, original_url, short_code, created_at, user_id, clicks, last_accessed
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
		&url.Clicks,
		&url.LastAccessed,
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
		SELECT id, original_url, short_code, user_id, created_at, clicks, last_accessed
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
			&url.Clicks,
			&url.LastAccessed,
		)

		if err != nil {
			return nil, err
		}

		urls = append(urls, url)
	}
	return urls, nil
}

func DeleteURL(id int, userID int) error {
	query := `
		DELETE FROM urls
		WHERE id = $1 AND user_id = $2
	`

	result, err := database.DB.Exec(query, id, userID)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()

	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("URL not found")
	}

	return nil
}

func IncrementClicks(code string) error {
	query := `UPDATE urls
			  SET clicks =  clicks+1,
			      last_accessed = NOW()
				  WHERE short_code = $1`
	_, err := database.DB.Exec(query, code)

	return err
}
