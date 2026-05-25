package repositories

import (
	"github.com/Vijayhrithikk/shortly/internal/database"
	"github.com/Vijayhrithikk/shortly/internal/models"
)

func CreateUser(user models.User) error {
	query := `
		INSERT INTO users (email, password)
		VALUES ($1, $2)
	`

	_, err := database.DB.Exec(
		query,
		user.Email,
		user.Password,
	)

	return err
}

func GetUserByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, email, password, created_at
		FROM users
		WHERE email = $1
	`

	var user models.User

	err := database.DB.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
