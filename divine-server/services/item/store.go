package item

import (
	"database/sql"
	"fmt"
	"strings"

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

func (s *ItemStore) Update(items []*types.Item) error {
	var queryValues []string
	var args []any
	argsPos := 1

	for _, row := range items {
		queryValues = append(
			queryValues,
			fmt.Sprintf("($%d::integer, $%d, $%d::numeric, $%d::numeric)", argsPos, argsPos+1, argsPos+2, argsPos+3),
		)
		args = append(args, row.ID, row.Name, row.CurrentPrice, row.PreviousPrice)
		argsPos += 4
	}

	query := fmt.Sprintf(
		`
		UPDATE items as i
		SET name = v.name,
				curr_price = v.curr_price,
				prev_price = v.prev_price		
		FROM (VALUES %s) AS v(id, name, curr_price, prev_price)
		WHERE i.id = v.id
	`, strings.Join(queryValues, ", "),
	)

	_, err := s.db.Exec(query, args...)
	if err != nil {
		return err
	}
	return nil
}
