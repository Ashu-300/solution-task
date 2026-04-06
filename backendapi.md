# Clean City Reporter – API Design with Proper DTO Request/Response

This document defines **clean, structured request/response bodies** (like your User DTOs) for all services.

---

# 🔐 1. Auth Service (Already Defined – Final Format)

## Register

```json
POST /api/auth/register
{
  "name": "Rahul",
  "email": "rahul@test.com",
  "password": "123456"
}
```

### Response

```json
{
  "token": "access_token",
  "user": {
    "id": "123",
    "name": "Rahul",
    "email": "rahul@test.com",
    "role": "user"
  }
}
```

---

## Login

```json
POST /api/auth/login
{
  "email": "rahul@test.com",
  "password": "123456"
}
```

---

## Refresh

```json
POST /api/auth/refresh
{
  "refresh_token": "..."
}
```

---

# 📸 2. Complaint Service DTOs

## 🧾 Create Complaint Request

```go
type CreateComplaintRequest struct {
	Description string  `json:"description"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	ImageURL    string  `json:"image_url"` // after upload
}
```

---

## 📦 Complaint Response

```go
type ComplaintResponse struct {
	ID           string  `json:"id"`
	ImageURL     string  `json:"image_url"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
	Description  string  `json:"description"`
	WasteType    string  `json:"waste_type"`
	AISuggestion string  `json:"ai_suggestion"`
	Status       string  `json:"status"`      // pending | cleaned
	CleanedBy    string  `json:"cleaned_by"`  // user | admin
	CreatedAt    string  `json:"created_at"`
}
```

---

## 📤 Create Complaint API

```json
POST /api/complaints
{
  "description": "Garbage near road",
  "latitude": 23.25,
  "longitude": 77.41,
  "image_url": "https://image-url"
}
```

---

## 📥 Response

```json
{
  "id": "cmp_123",
  "image_url": "https://image-url",
  "latitude": 23.25,
  "longitude": 77.41,
  "description": "Garbage near road",
  "waste_type": "plastic",
  "ai_suggestion": "Dispose in blue bin",
  "status": "pending",
  "cleaned_by": "",
  "created_at": "2026-04-06"
}
```

---

## 📄 Get Complaints

```json
GET /api/complaints
```

### Response

```json
[
  {
    "id": "cmp_123",
    "image_url": "...",
    "latitude": 23.25,
    "longitude": 77.41,
    "status": "pending"
  }
]
```

---

## 🧹 Mark as Cleaned

```go
type CleanComplaintRequest struct {
	CleanedBy string `json:"cleaned_by"` // user | admin
}
```

```json
PATCH /api/complaints/:id/clean
{
  "cleaned_by": "user"
}
```

---

## 📦 Response

```json
{
  "message": "Complaint marked as cleaned"
}
```

---

# 🤖 3. AI Service DTOs

## 🔍 Analyze Request

```go
type AnalyzeRequest struct {
	ImageURL string `json:"image_url"`
}
```

---

## 🤖 Analyze Response

```go
type AnalyzeResponse struct {
	WasteType    string `json:"waste_type"`
	Suggestion   string `json:"suggestion"`
	BinType      string `json:"bin_type"`
}
```

---

## Example

```json
POST /api/ai/analyze
{
  "image_url": "https://image-url"
}
```

### Response

```json
{
  "waste_type": "plastic",
  "suggestion": "Dispose in blue bin",
  "bin_type": "blue"
}
```

---

# 🗺️ 4. Map Service DTOs (Bins)

## 📍 Bin DTO

```go
type Bin struct {
	ID        string  `json:"id"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Type      string  `json:"type"` // green | blue | red
}
```

---

## 📥 Response

```json
GET /api/map/bins?lat=23.25&lng=77.41
```

```json
[
  {
    "id": "bin1",
    "latitude": 23.25,
    "longitude": 77.41,
    "type": "blue"
  }
]
```

---

# 🧑‍💼 5. Admin Service DTOs

## 📄 Admin Complaint Response

(Same as ComplaintResponse but full data)

---

## 🧾 Update Status Request

```go
type UpdateStatusRequest struct {
	Status string `json:"status"` // cleaned
}
```

---

## API

```json
PATCH /api/admin/complaints/:id/status
{
  "status": "cleaned"
}
```

---

## Response

```json
{
  "message": "Status updated successfully"
}
```

---

# 🔐 6. Common Response DTOs

## Success Message

```go
type MessageResponse struct {
	Message string `json:"message"`
}
```

---

## Error Response

```go
type ErrorResponse struct {
	Error string `json:"error"`
}
```

---

# 🚀 Final Summary

You now have **consistent DTO design across all services**:

* ✅ Auth → User DTO (already defined)
* ✅ Complaint → reporting + tracking
* ✅ AI → classification
* ✅ Map → bins
* ✅ Admin → status updates

---

# 🧠 Key Benefits

* Same structure across services
* Easy frontend integration
* Clean microservice boundaries
* Fast implementation

---

## ✅ You’re Ready to Build

This DTO structure is:

* Minimal
* Clean
* Production-aligned

---

If you want next:

* Go structs files for each service
* Mongo schema mapping
* API handlers for complaint service

Just say 👍
