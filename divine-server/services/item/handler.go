package item

import (
	"fmt"
	"log"
	"net/http"

	types "github.com/phogtr/divine-tips/types/item"
	"github.com/phogtr/divine-tips/utils"
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
	h.store.GetAll()

	utils.EncodeJson(w, http.StatusOK, map[string]string{
		"msg": "all items",
	})
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

	utils.EncodeJson(w, http.StatusOK, map[string]string{
		"message": "item created",
	})
}

func (h *ItemHandler) Update(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update item")
}
