package day

import (
	"fmt"
	"log"
	"net/http"

	"github.com/phogtr/divine-tips/utils"
)

type DayHandler struct {
	store *DayStore
}

func NewHandler(store *DayStore) *DayHandler {
	return &DayHandler{
		store: store,
	}
}

func (h *DayHandler) Get(w http.ResponseWriter, r *http.Request) {
	day, err := h.store.GetDay()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to get day")
		return
	}

	utils.EncodeJson(w, http.StatusOK, day)
}

func (h *DayHandler) Update(w http.ResponseWriter, r *http.Request) {

	fmt.Println("update day")
}

func (h *DayHandler) AdvanceDay(w http.ResponseWriter, r *http.Request) {
	fmt.Println(("advance day"))
}
