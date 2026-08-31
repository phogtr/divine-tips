package day

import (
	"log"
	"net/http"

	"github.com/phogtr/divine-tips/services/event"
	"github.com/phogtr/divine-tips/services/item"
	"github.com/phogtr/divine-tips/services/ws"
	"github.com/phogtr/divine-tips/utils"
)

type DayHandler struct {
	store      *DayStore
	itemStore  *item.ItemStore
	eventStore *event.EventStore
	hub        *ws.Hub
}

// max amount of events store in db
const maxEventStore = 3

func NewHandler(store *DayStore, itemStore *item.ItemStore, eventStore *event.EventStore, hub *ws.Hub) *DayHandler {
	return &DayHandler{
		store:      store,
		itemStore:  itemStore,
		eventStore: eventStore,
		hub:        hub,
	}
}

type dayAdvancedPayload struct {
	Items []*item.ItemDelta `json:"items"`
	Event *event.Event      `json:"event"`
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

	var updatedNewEvent *event.Event

	if len(events) >= maxEventStore {
		updatedNewEvent, err = h.eventStore.Update(newEvent)
		if err != nil {
			log.Println(err)
			utils.ResponseErrorJson(w, http.StatusInternalServerError, "something went wrong")
			return
		}
	} else {
		updatedNewEvent, err = h.eventStore.Create(newEvent)
		if err != nil {
			log.Println(err)
			utils.ResponseErrorJson(w, http.StatusInternalServerError, "something went wrong")
			return
		}
	}

	msg := ws.NewMessage(ws.DayAdvancedType, dayAdvancedPayload{
		Items: item.Delta(updatedItem),
		Event: updatedNewEvent,
	})
	if msg != nil {
		h.hub.Broadcast(msg)
	}

	utils.EncodeJson(w, http.StatusOK, eventItems)
}
