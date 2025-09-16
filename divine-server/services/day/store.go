package day

import (
	"database/sql"

	types "github.com/phogtr/divine-tips/types/day"
)

type DayStore struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *DayStore {
	return &DayStore{
		db: db,
	}
}

func (s *DayStore) Get() (*types.Day, error) {
	query := `
		SELECT day FROM system_days LIMIT 1
	`
	var day types.Day

	row := s.db.QueryRow(query)
	err := row.Scan(&day.SystemDay)
	if err != nil {
		return nil, err
	}

	return &day, nil
}

func (s *DayStore) Update(newDay int) error {
	query := `
		UPDATE system_days SET day = $1
	`

	_, err := s.db.Exec(query, newDay)
	if err != nil {
		return err
	}

	return nil
}

func (s *DayStore) Advance() error {
	day, err := s.Get()
	if err != nil {
		return nil
	}

	err = s.Update(day.SystemDay + 1)
	if err != nil {
		return err
	}
	return nil
}
