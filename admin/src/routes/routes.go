package routes

import (
	"admin/src/controller"

	"github.com/go-chi/chi/v5"
)

func SetupAdminRoutes() chi.Router {
	r := chi.NewRouter()

	r.Get("/complaints", controller.GetComplaints)
	r.Patch("/complaints/{id}/status", controller.UpdateComplaintStatus)

	return r
}
