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

func (s *DayStore) GetDay() (*types.Day, error) {
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
