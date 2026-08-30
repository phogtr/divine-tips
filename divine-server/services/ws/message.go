package ws

import (
	"encoding/json"
	"log"
)

const DayAdvancedType = "day_advanced"

type Message struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

func NewMessage(messageType string, payload any) []byte {
	data, err := json.Marshal(payload)
	if err != nil {
		log.Println(err)
		return nil
	}

	msg, err := json.Marshal(Message{Type: messageType, Data: data})
	if err != nil {
		log.Println(err)
		return nil
	}

	return msg
}
