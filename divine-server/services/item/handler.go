package item

import (
	"database/sql"
	"fmt"
	"net/http"
)

type Item struct {
	db *sql.DB
}

func New(db *sql.DB) *Item {
	return &Item{
		db: db,
	}
}

func (i *Item) Create(w http.ResponseWriter, r *http.Request) {
	fmt.Println("create item")
}

func (i *Item) Update(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update item")
}
