package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/phogtr/divine-tips/services/day"
	"github.com/phogtr/divine-tips/services/event"
	"github.com/phogtr/divine-tips/services/item"
)

func registerRoutes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(middleware.Logger)

	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Ok"))
	})

	router.Mount("/v1", v1Router())

	return router
}

func v1Router() http.Handler {
	r := chi.NewRouter()

	r.Route("/day", registerDayRoutes)
	r.Route("/event", registerEventRoutes)
	r.Route("/item", registerItemRoutes)

	return r
}

func registerDayRoutes(r chi.Router) {
	dayHandler := &day.Day{}

	r.Put("/update", dayHandler.Update)
	r.Post("/advance", dayHandler.AdvanceDay)
}

func registerEventRoutes(r chi.Router) {
	eventHandler := &event.Event{}

	r.Post("/create", eventHandler.Create)
	r.Put("/update", eventHandler.Update)
}

func registerItemRoutes(r chi.Router) {
	itemHandler := &item.Item{}

	r.Post("/create", itemHandler.Create)
	r.Put("/update", itemHandler.Update)
}
