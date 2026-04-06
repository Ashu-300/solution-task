package controller

import (
	"complaint/src/config"
	"complaint/src/db"
	"complaint/src/dto"
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateComplaint(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "invalid multipart form data", http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "image is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	imageURL, err := config.UploadToCloudinary(file)
	if err != nil {
		http.Error(w, "failed to upload image", http.StatusInternalServerError)
		return
	}

	description := strings.TrimSpace(r.FormValue("description"))
	latitudeStr := strings.TrimSpace(r.FormValue("latitude"))
	longitudeStr := strings.TrimSpace(r.FormValue("longitude"))

	latitude, err := strconv.ParseFloat(latitudeStr, 64)
	if err != nil {
		http.Error(w, "invalid latitude", http.StatusBadRequest)
		return
	}

	longitude, err := strconv.ParseFloat(longitudeStr, 64)
	if err != nil {
		http.Error(w, "invalid longitude", http.StatusBadRequest)
		return
	}

	var req dto.CreateComplaintRequest
	req.Description = description
	req.Latitude = latitude
	req.Longitude = longitude

	if req.Description == "" {
		http.Error(w, "description is required", http.StatusBadRequest)
		return
	}

	complaint := dto.Complaint{
		ID:           "cmp_" + time.Now().Format("20060102150405"),
		ImageURL:     imageURL,
		Latitude:     req.Latitude,
		Longitude:    req.Longitude,
		Description:  req.Description,
		WasteType:    "plastic",
		AISuggestion: "Dispose in blue bin",
		Status:       "pending",
		CleanedBy:    "",
		CreatedAt:    time.Now().Format("2006-01-02"),
	}

	collection := db.GetComplaintCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = collection.InsertOne(ctx, complaint)
	if err != nil {
		http.Error(w, "failed to create complaint", http.StatusInternalServerError)
		return
	}

	res := dto.ComplaintResponse(complaint)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func GetComplaints(w http.ResponseWriter, r *http.Request) {
	collection := db.GetComplaintCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, "failed to fetch complaints", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	items := make([]dto.ComplaintResponse, 0)
	for cursor.Next(ctx) {
		var c dto.Complaint
		if err := cursor.Decode(&c); err != nil {
			http.Error(w, "failed to parse complaint", http.StatusInternalServerError)
			return
		}

		items = append(items, dto.ComplaintResponse{
			ID:           c.ID,
			ImageURL:     c.ImageURL,
			Latitude:     c.Latitude,
			Longitude:    c.Longitude,
			Description:  c.Description,
			WasteType:    c.WasteType,
			AISuggestion: c.AISuggestion,
			Status:       c.Status,
			CleanedBy:    c.CleanedBy,
			CreatedAt:    c.CreatedAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func MarkComplaintCleaned(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "missing complaint id", http.StatusBadRequest)
		return
	}

	var req dto.CleanComplaintRequest
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
		http.Error(w, "failed to update complaint", http.StatusInternalServerError)
		return
	}
	if result.MatchedCount == 0 {
		http.Error(w, "complaint not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dto.MessageResponse{Message: "Complaint marked as cleaned"})
}

func DeleteComplaint(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "missing complaint id", http.StatusBadRequest)
		return
	}

	collection := db.GetComplaintCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"id": id})
	if err != nil {
		http.Error(w, "failed to delete complaint", http.StatusInternalServerError)
		return
	}
	if result.DeletedCount == 0 {
		http.Error(w, "complaint not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dto.MessageResponse{Message: "Complaint removed"})
}
