package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/phogtr/divine-tips/services/day"
	"github.com/phogtr/divine-tips/services/event"
	"github.com/phogtr/divine-tips/services/item"
)

func (a *ApiServer) registerRoutes() {
	router := chi.NewRouter()

	router.Use(middleware.Logger)

	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Ok"))
	})

	router.Mount("/v1", a.v1Router())

	a.router = router
}

func (a *ApiServer) v1Router() http.Handler {
	r := chi.NewRouter()

	r.Route("/day", a.dayRoutes)
	r.Route("/event", a.eventRoutes)
	r.Route("/item", a.itemRoutes)

	return r
}

func (a *ApiServer) dayRoutes(r chi.Router) {
	dayStore := day.NewStore(a.db)
	itemStore := item.NewStore(a.db)
	eventStore := event.NewStore(a.db)
	dayHandler := day.NewHandler(dayStore, itemStore, eventStore)

	r.Get("/", dayHandler.Get)
	r.Put("/update", dayHandler.Update)
	r.Post("/advance", dayHandler.Advance)
}

func (a *ApiServer) eventRoutes(r chi.Router) {
	eventStore := event.NewStore(a.db)
	eventHandler := event.NewHandler(eventStore)

	r.Get("/", eventHandler.GetAll)
}

func (a *ApiServer) itemRoutes(r chi.Router) {
	itemStore := item.NewStore(a.db)
	itemHandler := item.NewHandler(itemStore)

	r.Get("/", itemHandler.GetAll)
	r.Post("/create", itemHandler.Create)
}
