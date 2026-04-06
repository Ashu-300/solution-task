package routes

import (
	"complaint/src/controller"

	"github.com/go-chi/chi/v5"
)

func SetupComplaintRoutes() chi.Router {
	r := chi.NewRouter()

	r.Post("/", controller.CreateComplaint)
	r.Get("/", controller.GetComplaints)
	r.Patch("/{id}/clean", controller.MarkComplaintCleaned)
	r.Delete("/{id}", controller.DeleteComplaint)

	return r
}
