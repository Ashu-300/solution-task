package dto

import "github.com/golang-jwt/jwt/v5"

type AccessClaim struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

type RefreshClaim struct {
	ID string `json:"id"`   // user ID

	jwt.RegisteredClaims
}