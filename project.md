# Clean City Reporter – 2-Hour Prototype (Updated MVP Document)

## 🎯 Objective

Build a **basic working prototype** that allows:

* Citizens to report garbage with photo + location
* Get AI-based suggestion for waste type and disposal
* Option for users to self-clean and dispose waste
* Municipal admin to view complaints, navigate, and mark them as resolved
* Users to view **nearby garbage bins on map**

---

# 👥 1. User Roles

## 1. Citizen (Public User)

* Reports garbage issues
* Gets AI guidance on waste type
* Can choose to clean and dispose waste
* Views nearby garbage bins

## 2. Municipal Admin

* Views all complaints
* Navigates to garbage location
* Updates complaint status (cleaned)

---

# 📱 2. Citizen App Features (MVP)

## 📸 2.1 Report Garbage (Core Feature)

User can:

* Upload a photo of garbage
* Auto-capture location (GPS)
* Add optional description

### Output:

* Complaint is created and stored

---

## 🤖 2.2 AI Waste Description (LLM Feature)

After photo upload:

* AI analyzes image and returns:

  * Type of waste (plastic / organic / mixed / hazardous)
  * Suggested disposal method
  * Recommended bin type (e.g., green / blue)

### Example Output:

“This appears to be plastic waste. You can dispose it in a blue recycling bin.”

---

## ♻️ 2.3 Self-Clean Option (Unique Feature)

User gets a button:
👉 **“I will clean this”**

If selected:

* App guides user:

  * Where to dispose waste
* After cleaning:

  * User marks as cleaned
  * (Optional: upload after photo)

---

## 🗺️ 2.4 Nearby Garbage Bins (User Map Feature)

* Show **nearby dustbins on map**
* Helps user:

  * Dispose waste properly

### Features:

* Auto-fetch nearby bins using location
* Show bin types (if data available)

---

## 📊 2.5 Complaint Status Tracking

User can see:

* Submitted
* Cleaned

---

# 🧑‍💼 3. Admin (Municipal) Features

## 🗺️ 3.1 Admin Map Dashboard (Primary Map Feature)

* View all complaints as markers

### Marker Colors:

* 🔴 Red → Pending
* 🟢 Green → Cleaned

---

## 📍 3.2 Navigation to Garbage Location

* Click complaint → “Navigate” button
* Opens Google Maps directions

---

## 📋 3.3 Complaint Details

* View:

  * Uploaded photo
  * Location
  * Description
  * AI waste classification

---

## ✅ 3.4 Update Status

Admin can:

* Mark complaint as:

  * Cleaned

---

# 🔄 4. System Flow

## Step 1: User

* Uploads photo + location

## Step 2: AI

* Classifies waste
* Suggests disposal method

## Step 3: User Decision

* Option A: Leave for municipal
* Option B: Self-clean and dispose

## Step 4: System

* Stores complaint

## Step 5: Admin

* Views complaint on map
* Navigates to location

## Step 6: Resolution

* Admin OR user marks as cleaned

---

# 🗂️ 5. Data Model (Updated)

```id="model2"
Complaint {
  id
  image_url
  latitude
  longitude
  description
  waste_type
  ai_suggestion
  status (pending / cleaned)
  cleaned_by (user / admin)
  created_at
}
```

---

# 🔌 6. Required APIs

## User Side

* POST /report → Create complaint
* GET /bins → Fetch nearby garbage bins
* GET /complaints → Fetch status

## Admin Side

* GET /complaints → View all
* PATCH /complaint/:id → Update status

## AI Service

* POST /analyze-image → Returns:

  * Waste type
  * Disposal suggestion

---

# 🛠️ 7. Tech Stack (Fastest for Prototype)

## Frontend

* React Native / Flutter

## Backend

* Firebase / Node.js

## Database

* Firebase Firestore

## Maps

* Google Maps API

## AI

* Simple vision API + LLM (can mock response if needed)

---

# ⏱️ 8. 2-Hour Build Plan

## ⏰ Hour 1:

* Implement:

  * Photo upload
  * Location capture
  * Save complaint
  * AI mock response

## ⏰ Hour 2:

* Admin map view
* Navigation button
* “Mark as cleaned”
* Nearby bins display (basic markers)

---

# 🚀 9. Minimum Working Features (Must Have)

✅ Upload photo
✅ Capture location
✅ AI waste suggestion
✅ Nearby garbage bins map
✅ Admin navigation + status update

---

# 💡 10. Simplifications for Prototype

* Use static/mock data for garbage bins
* Mock AI response if needed
* No login/authentication required
* Single app with “User/Admin toggle”

---

# 🧠 Final Concept

This system promotes:

* **Citizen participation (self-cleaning)**
* **Efficient municipal response**
* **Smart waste disposal using AI guidance**

---

## ✅ Outcome

You will have a working prototype that:

* Reports garbage
* Suggests disposal using AI
* Enables self-cleaning
* Helps admin navigate and resolve issues
* Guides users to nearby bins

---
