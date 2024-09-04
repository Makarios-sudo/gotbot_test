package service

import (
	"app/app/domain"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type AuthService interface {
	GenerateToken(user *domain.User) (string, error)
	ValidateToken(tokenString string) (*jwt.Token, error)
}

type authService struct {
	secretKey string
}

func NewAuthService(secretKey string) AuthService {
	return &authService{secretKey: secretKey}
}

func (s *authService) GenerateToken(user *domain.User) (string, error) {
	claims := jwt.MapClaims{
		"id":    user.ID.Hex(),
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.secretKey))
}

func (s *authService) ValidateToken(tokenString string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.secretKey), nil
	})
}
