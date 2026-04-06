package main

import (
	"admin/src/config"
	"admin/src/db"
	"admin/src/routes"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	config.LoadConfig()
	db.ConnectDB()

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	router.Mount("/api/admin", routes.SetupAdminRoutes())

	port := config.PORT
	if port == "" {
		port = "8003"
	}

	log.Printf("Admin service running on http://localhost:%s\n", port)

	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal("Server failed:", err)
	}
}
