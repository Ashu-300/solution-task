package utils

import (
	"fmt"
	"time"
	"user/src/config"
	"user/src/dto"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userId string, email string, role string) (string, string, error) {
	accessSecret := config.JWT_ACCESS_SECRET
	accessClaim := dto.AccessClaim{
		ID:    userId,
		Email: email,
		Role:  role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaim)
	signedAccessToken, err := accessToken.SignedString([]byte(accessSecret))
	if err != nil {
		return "", "", err
	}

	refreshSecret := config.JWT_REFRESH_SECRET
	refreshClaim := dto.RefreshClaim{
		ID: userId,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaim)
	signedRefreshToken, err := refreshToken.SignedString([]byte(refreshSecret))
	if err != nil {
		return "", "", err
	}

	return signedAccessToken, signedRefreshToken, nil
}

func ValidateToken(tokenString string) (*dto.AccessClaim, error) {
	secret := config.JWT_ACCESS_SECRET
	if secret == "" {
		return nil, fmt.Errorf("missing JWT_ACCESS_SECRET")
	}

	var claim dto.AccessClaim

	token, err := jwt.ParseWithClaims(
		tokenString,
		&claim,
		func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("invalid signing method")
			}
			return []byte(secret), nil
		},
	)

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return &claim, nil
}
