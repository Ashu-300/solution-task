package dto

type CreateComplaintRequest struct {
	Description string  `json:"description"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
}

type CleanComplaintRequest struct {
	Status string `json:"status"`
}

type Complaint struct {
	ID           string  `json:"id" bson:"id"`
	ImageURL     string  `json:"image_url" bson:"image_url"`
	Latitude     float64 `json:"latitude" bson:"latitude"`
	Longitude    float64 `json:"longitude" bson:"longitude"`
	Description  string  `json:"description" bson:"description"`
	WasteType    string  `json:"waste_type" bson:"waste_type"`
	AISuggestion string  `json:"ai_suggestion" bson:"ai_suggestion"`
	Status       string  `json:"status" bson:"status"`
	CleanedBy    string  `json:"cleaned_by" bson:"cleaned_by"`
	CreatedAt    string  `json:"created_at" bson:"created_at"`
}

type ComplaintResponse struct {
	ID           string  `json:"id"`
	ImageURL     string  `json:"image_url"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
	Description  string  `json:"description"`
	WasteType    string  `json:"waste_type"`
	AISuggestion string  `json:"ai_suggestion"`
	Status       string  `json:"status"`
	CleanedBy    string  `json:"cleaned_by"`
	CreatedAt    string  `json:"created_at"`
}

type ComplaintListItem struct {
	ID        string  `json:"id"`
	ImageURL  string  `json:"image_url"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Status    string  `json:"status"`
}

type MessageResponse struct {
	Message string `json:"message"`
}
