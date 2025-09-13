package item

import (
	"database/sql"

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

func (s *ItemStore) GetAll() ([]*types.Item, error) {
	query := `
		SELECT id, name, curr_price, prev_price FROM items
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []*types.Item
	for rows.Next() {
		var item types.Item
		err := rows.Scan(&item.ID, &item.Name, &item.CurrentPrice, &item.PreviousPrice)

		if err != nil {
			return nil, err
		}
		items = append(items, &item)
	}

	return items, nil
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
