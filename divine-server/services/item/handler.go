package item

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	types "github.com/phogtr/divine-tips/types/item"
	"github.com/phogtr/divine-tips/utils"
)

const (
	eventItemCount = 5    // up to this amount
	maxChange      = 0.2  // 20%
	minChange      = 0.01 // 1%
)

type ItemHandler struct {
	store *ItemStore
}

func NewHandler(store *ItemStore) *ItemHandler {
	return &ItemHandler{
		store: store,
	}
}

func (h *ItemHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	items, err := h.store.GetAll()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to get items")
		return
	}

	utils.EncodeJson(w, http.StatusOK, items)
}

func (h *ItemHandler) Create(w http.ResponseWriter, r *http.Request) {
	var request types.ItemRequest

	err := utils.DecodeJson(w, r, &request)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusBadRequest, "invalid json request")
		return
	}

	payload := types.Item{
		Name:          request.Name,
		CurrentPrice:  100,
		PreviousPrice: 0,
	}

	err = h.store.Create(payload)
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to create item")
		return
	}

	utils.EncodeJson(w, http.StatusOK, request.Name)
}

func (h *ItemHandler) Update(w http.ResponseWriter, r *http.Request) {
	items, err := h.store.GetAll()
	if err != nil {
		log.Println(err)
		utils.ResponseErrorJson(w, http.StatusInternalServerError, "failed to get items")
		return
	}

	rand.New(rand.NewSource(time.Now().UnixNano()))

	itemsCopied := make([]*types.ItemResponse, len(items))
	copy(itemsCopied, items)

	for i := range itemsCopied {
		item := itemsCopied[i]
		oldPrice := item.CurrentPrice
		item.PreviousPrice = oldPrice

		// 0: decrease, 1: increase, 2: no change
		changeType := rand.Intn(3)
		if changeType == 2 {
			fmt.Printf("%s: no change\n", itemsCopied[i].Name)
			continue
		}

		// price change percentage
		change := rand.Float64()*(maxChange-minChange) + minChange

		if changeType == 0 {
			change = change * -1
		}

		item.CurrentPrice = oldPrice * (1 + change)
		fmt.Printf("%s: %f%% | $%.2f -> $%.2f\n", item.Name, change, oldPrice, item.CurrentPrice)
	}
	fmt.Println("###########################################################################")

	count := rand.Intn(eventItemCount) + 1
	var eventItem []*types.EventItem
	indexMap := make(map[int]bool)
	fmt.Println("count:", count)

	for len(indexMap) < count {
		index := rand.Intn(len(itemsCopied))
		if indexMap[index] {
			// item already picked
			fmt.Println("already picked", index)
			continue
		}
		indexMap[index] = true

		item := itemsCopied[index]
		var ei types.EventItem
		ei.Name = item.Name

		if item.CurrentPrice < item.PreviousPrice {
			ei.Type = 0
		} else if item.CurrentPrice > item.PreviousPrice {
			ei.Type = 1
		} else {
			ei.Type = 2
		}

		eventItem = append(eventItem, &ei)
		fmt.Printf("%s | %d\n", ei.Name, ei.Type)
	}
}
