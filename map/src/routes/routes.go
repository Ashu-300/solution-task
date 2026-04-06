package routes

import (
	"map/src/controller"

	"github.com/go-chi/chi/v5"
)

func SetupMapRoutes() chi.Router {
	r := chi.NewRouter()

	r.Get("/bins", controller.GetBins)
	r.Post("/bins", controller.CreateBin)

	return r
}
