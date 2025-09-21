package event

import (
	"fmt"
	"net/http"
)

type EventHandler struct{}

func (h *EventHandler) Create(w http.ResponseWriter, r *http.Request) {
	fmt.Println("create event")
}

func (h *EventHandler) Update(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update event")
}
