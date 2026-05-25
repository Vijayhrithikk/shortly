package services

import (
	"errors"
	"time"

	"github.com/Vijayhrithikk/shortly/config"
	"github.com/Vijayhrithikk/shortly/internal/models"
	"github.com/Vijayhrithikk/shortly/internal/repositories"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(email string, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	user := models.User{
		Email:    email,
		Password: string(hashedPassword),
	}

	return repositories.CreateUser(user)
}

func Login(email string, password string, cfg *config.Config) (string, error) {
	user, err := repositories.GetUserByEmail(email)

	if err != nil {
		return "", errors.New("Invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if err != nil {
		return "", errors.New("Invalid email or password")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(cfg.JWT_SECRET))

	return tokenString, nil
}
