package controller

import (
	"context"
	"encoding/json"
	"map/src/db"
	"map/src/dto"
	"net/http"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func CreateBin(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateBinRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	typeValue := strings.ToLower(strings.TrimSpace(req.Type))
	if typeValue != "green" && typeValue != "blue" && typeValue != "red" {
		http.Error(w, "type must be green, blue, or red", http.StatusBadRequest)
		return
	}

	item := dto.Bin{
		ID:        "bin_" + time.Now().Format("20060102150405"),
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Type:      typeValue,
	}

	collection := db.GetBinCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, item)
	if err != nil {
		http.Error(w, "failed to create bin", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func GetBins(w http.ResponseWriter, r *http.Request) {
	latStr := r.URL.Query().Get("lat")
	lngStr := r.URL.Query().Get("lng")

	if latStr != "" {
		if _, err := strconv.ParseFloat(latStr, 64); err != nil {
			http.Error(w, "invalid lat query", http.StatusBadRequest)
			return
		}
	}

	if lngStr != "" {
		if _, err := strconv.ParseFloat(lngStr, 64); err != nil {
			http.Error(w, "invalid lng query", http.StatusBadRequest)
			return
		}
	}

	collection := db.GetBinCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "failed to fetch bins", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	items := make([]dto.Bin, 0)
	for cursor.Next(ctx) {
		var item dto.Bin
		if err := cursor.Decode(&item); err != nil {
			http.Error(w, "failed to parse bin", http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}
