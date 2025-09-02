package event

import (
	"fmt"
	"net/http"
)

type Event struct{}

func (e *Event) Create(w http.ResponseWriter, r *http.Request) {
	fmt.Println("create event")
}

func (e *Event) Update(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update event")
}
