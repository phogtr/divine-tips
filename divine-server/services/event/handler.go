package event

import (
	"log"
	"net/http"

	"github.com/phogtr/divine-tips/utils"
)

type EventHandler struct {
	store *EventStore
}

func NewHandler(store *EventStore) *EventHandler {
	return &EventHandler{
		store: store,
	}
}

func (h *EventHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	events, err := h.store.GetAll()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to get events")
		return
	}

	utils.EncodeJson(w, http.StatusOK, events)
}
