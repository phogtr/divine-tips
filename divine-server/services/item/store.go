package item

import (
	"database/sql"
	"fmt"

	types "github.com/phogtr/divine-tips/types/item"
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

func (s *ItemStore) Create(payload types.Item) error {
	query := `
		INSERT INTO items (name, curr_price, prev_price)
		VALUES ($1, $2, $3) returning id
	`

	_, err := s.db.Exec(query, payload.Name, payload.CurrentPrice, payload.PreviousPrice)
	if err != nil {
		return err
	}
	return nil
}
