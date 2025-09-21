package event

import (
	"database/sql"
	"encoding/json"
)

type EventStore struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *EventStore {
	return &EventStore{
		db: db,
	}
}

func (s *EventStore) GetAll() ([]*Event, error) {
	query := `
		SELECT event_day, data FROM events
		ORDER BY event_day DESC
	`

	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []*Event
	for rows.Next() {
		var (
			event    Event
			jsonData []byte
		)
		if err := rows.Scan(&event.Day, &jsonData); err != nil {
			return nil, err
		}

		if err := json.Unmarshal(jsonData, &event.Data); err != nil {
			return nil, err
		}

		events = append(events, &event)
	}

	return events, nil
}

func (s *EventStore) Create(payload Event) error {
	query := `
		INSERT INTO events (event_day, data)
		VALUES ($1, $2::jsonb)
	`

	jsonData, err := json.Marshal(payload.Data)
	if err != nil {
		return err
	}

	_, err = s.db.Exec(query, payload.Day, jsonData)
	if err != nil {
		return err
	}
	return nil
}
