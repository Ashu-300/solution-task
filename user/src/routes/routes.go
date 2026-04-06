package routes

import (
	"user/src/controller"
	"user/src/middleware"

	"github.com/go-chi/chi/v5"
)

func SetupAuthRoutes() chi.Router {
	r := chi.NewRouter()

	// Public routes
	r.Post("/register", controller.Register)
	r.Post("/login", controller.Login)

	// Protected routes
	r.Group(func(protected chi.Router) {
		protected.Use(middleware.AuthMiddleware)
		// protected.Get("/me", controller.Me)
	})

	return r
}