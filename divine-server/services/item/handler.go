package item

import (
	"fmt"
	"net/http"

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
	h.store.Create()

	utils.WriteJson(w, http.StatusOK, map[string]string{
		"msg": "create item",
	})
}

func (h *ItemHandler) Update(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update item")
}
