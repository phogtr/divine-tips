package item

import (
	"fmt"
	"net/http"
)

type Item struct{}

func (i *Item) Create(w http.ResponseWriter, r *http.Request) {
	fmt.Println("create item")
}

func (i *Item) Update(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update item")
}
