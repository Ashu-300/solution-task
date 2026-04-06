package controller

import (
	"admin/src/config"
	"admin/src/db"
	"admin/src/dto"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
)

func GetComplaints(w http.ResponseWriter, r *http.Request) {
	if err := authorizeAdmin(r); err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	collection := db.GetComplaintCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "failed to fetch complaints", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	items := make([]dto.AdminComplaintResponse, 0)
	for cursor.Next(ctx) {
		var c dto.Complaint
		if err := cursor.Decode(&c); err != nil {
			http.Error(w, "failed to parse complaint", http.StatusInternalServerError)
			return
		}

		items = append(items, dto.AdminComplaintResponse(c))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func UpdateComplaintStatus(w http.ResponseWriter, r *http.Request) {
	if err := authorizeAdmin(r); err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "missing complaint id", http.StatusBadRequest)
		return
	}

	var req dto.UpdateStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	if req.Status != "cleaned" {
		http.Error(w, "status must be cleaned", http.StatusBadRequest)
		return
	}

	collection := db.GetComplaintCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.UpdateOne(
		ctx,
		bson.M{"id": id},
		bson.M{"$set": bson.M{"status": "cleaned", "cleaned_by": "admin"}},
	)
	if err != nil {
		http.Error(w, "failed to update status", http.StatusInternalServerError)
		return
	}
	if result.MatchedCount == 0 {
		http.Error(w, "complaint not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dto.MessageResponse{Message: "Status updated successfully"})
}

func authorizeAdmin(r *http.Request) error {
	authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
	if authHeader == "" {
		return fmt.Errorf("admin authorization required")
	}

	tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
	if tokenString == "" || tokenString == authHeader {
		return fmt.Errorf("invalid authorization header")
	}

	if config.JWT_ACCESS_SECRET == "" {
		return fmt.Errorf("jwt secret is not configured")
	}

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(config.JWT_ACCESS_SECRET), nil
	})
	if err != nil || !token.Valid {
		return fmt.Errorf("invalid token")
	}

	role, ok := claims["role"].(string)
	if !ok || role != "admin" {
		return fmt.Errorf("forbidden: admin role required")
	}

	return nil
}
