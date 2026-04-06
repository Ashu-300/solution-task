package main

import (
	"log"
	"net/http"
	"user/src/config"
	"user/src/db"
	"user/src/routes"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	// Load application configuration
	config.LoadConfig()

	// Initialize database
	db.ConnectDB()

	// Create router
	router := chi.NewRouter()

	// CORS Middleware
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"}, // ⚠️ change in production
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Routes
	router.Mount("/api/auth", routes.SetupAuthRoutes())

	// Get port
	port := config.PORT
	if port == "" {
		port = "8001"
	}

	log.Printf("🚀 Auth service running on http://localhost:%s\n", port)

	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal("❌ Server failed:", err)
	}
}
