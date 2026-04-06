package dto

type Bin struct {
	ID        string  `json:"id" bson:"id"`
	Latitude  float64 `json:"latitude" bson:"latitude"`
	Longitude float64 `json:"longitude" bson:"longitude"`
	Type      string  `json:"type" bson:"type"`
}

type CreateBinRequest struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Type      string  `json:"type"`
}

type MessageResponse struct {
	Message string `json:"message"`
}
