package day

import (
	"log"
	"net/http"

	"github.com/phogtr/divine-tips/services/event"
	"github.com/phogtr/divine-tips/services/item"
	types "github.com/phogtr/divine-tips/types/day"
	"github.com/phogtr/divine-tips/utils"
)

type DayHandler struct {
	store     *DayStore
	itemStore *item.ItemStore
}

func NewHandler(store *DayStore, itemStore *item.ItemStore) *DayHandler {
	return &DayHandler{
		store:     store,
		itemStore: itemStore,
	}
}

func (h *DayHandler) Get(w http.ResponseWriter, r *http.Request) {
	day, err := h.store.Get()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to get day")
		return
	}

	utils.EncodeJson(w, http.StatusOK, day)
}

func (h *DayHandler) Update(w http.ResponseWriter, r *http.Request) {
	var request types.DayRequest

	err := utils.DecodeJson(w, r, &request)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusBadRequest, "invalid json request")
		return
	}

	err = h.store.Update(request.NewDay)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to update day")
		return
	}

	utils.EncodeJson(w, http.StatusOK, "day updated")
}

func (h *DayHandler) Advance(w http.ResponseWriter, r *http.Request) {
	err := h.store.Advance()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to advance day")
		return
	}

	items, err := h.itemStore.GetAll()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to get items")
		return
	}

	updatedItem := item.Update(items)

	err = h.itemStore.Update(updatedItem)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to update items")
		return
	}

	eventItems := event.PickItem(updatedItem)

	utils.EncodeJson(w, http.StatusOK, eventItems)
}
