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
		SELECT id, event_day, data FROM events
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
		if err := rows.Scan(&event.ID, &event.Day, &jsonData); err != nil {
			return nil, err
		}

		if err := json.Unmarshal(jsonData, &event.Data); err != nil {
			return nil, err
		}

		events = append(events, &event)
	}

	return events, nil
}

func (s *EventStore) Get() (*Event, error) {
	query := `
		SELECT id, event_day, data FROM events
		ORDER BY event_day ASC
		LIMIT 1
	`
	var (
		event    Event
		jsonData []byte
	)

	row := s.db.QueryRow(query)
	if err := row.Scan(&event.ID, &event.Day, &jsonData); err != nil {
		return nil, err
	}

	if err := json.Unmarshal(jsonData, &event.Data); err != nil {
		return nil, err
	}

	return &event, nil
}

func (s *EventStore) Create(payload *Event) error {
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

func (s *EventStore) Update(payload *Event) error {
	event, err := s.Get()
	if err != nil {
		return err
	}

	query := `
		UPDATE events
		SET event_day = $1, data = $2::jsonb
		WHERE id = $3
	`

	jsonData, err := json.Marshal(payload.Data)
	if err != nil {
		return err
	}

	_, err = s.db.Exec(query, payload.Day, jsonData, event.ID)
	if err != nil {
		return err
	}
	return nil
}
