package day

import (
	"fmt"
	"log"
	"net/http"

	types "github.com/phogtr/divine-tips/types/day"
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

func (h *DayHandler) GetDay(w http.ResponseWriter, r *http.Request) {
	day, err := h.store.GetDay()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to get day")
		return
	}

	utils.EncodeJson(w, http.StatusOK, day)
}

func (h *DayHandler) UpdateDay(w http.ResponseWriter, r *http.Request) {
	var request types.DayRequest

	err := utils.DecodeJson(w, r, &request)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusBadRequest, "invalid json request")
		return
	}

	err = h.store.UpdateDay(request.NewDay)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to update day")
		return
	}

	utils.EncodeJson(w, http.StatusOK, "day updated")
}

func (h *DayHandler) AdvanceDay(w http.ResponseWriter, r *http.Request) {
	fmt.Println(("advance day"))
}
