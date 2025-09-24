package day

import (
	"log"
	"net/http"

	"github.com/phogtr/divine-tips/services/event"
	"github.com/phogtr/divine-tips/services/item"
	"github.com/phogtr/divine-tips/utils"
)

type DayHandler struct {
	store      *DayStore
	itemStore  *item.ItemStore
	eventStore *event.EventStore
}

// max amount of events store in db
const maxEventStore = 3

func NewHandler(store *DayStore, itemStore *item.ItemStore, eventStore *event.EventStore) *DayHandler {
	return &DayHandler{
		store:      store,
		itemStore:  itemStore,
		eventStore: eventStore,
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
	var request DayRequest

	err := utils.DecodeJson(w, r, &request)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusBadRequest, "invalid json request")
		return
	}

	newDay, err := h.store.Update(request.NewDay)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to update day")
		return
	}

	utils.EncodeJson(w, http.StatusOK, *newDay)
}

func (h *DayHandler) Advance(w http.ResponseWriter, r *http.Request) {
	newDay, err := h.store.Advance()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "something went wrong")
		return
	}

	items, err := h.itemStore.GetAll()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "something went wrong")
		return
	}

	events, err := h.eventStore.GetAll()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "something went wrong")
		return
	}

	eventItemMap := event.NameTypeMap(events[0])
	updatedItem := item.Update(items, eventItemMap)

	if err = h.itemStore.Update(updatedItem); err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "something went wrong")
		return
	}

	eventItems := event.Create(updatedItem)
	newEvent := &event.Event{
		Day:  *newDay,
		Data: eventItems,
	}

	if len(events) >= maxEventStore {
		if err = h.eventStore.Update(newEvent); err != nil {
			log.Println(err)
			utils.ResponseErrorJson(w, http.StatusInternalServerError, "something went wrong")
			return
		}
	} else {
		if err = h.eventStore.Create(newEvent); err != nil {
			log.Println(err)
			utils.ResponseErrorJson(w, http.StatusInternalServerError, "something went wrong")
			return
		}
	}

	utils.EncodeJson(w, http.StatusOK, eventItems)
}
