package item

import (
	"database/sql"
	"fmt"
)

type ItemStore struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *ItemStore {
	return &ItemStore{
		db: db,
	}
}

func (s *ItemStore) GetAll() {
	fmt.Println("store get all items")
}

func (s *ItemStore) Create() {
	fmt.Println("store create item")
}
