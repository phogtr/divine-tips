package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func DecodeJson(w http.ResponseWriter, r *http.Request, data any) error {
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	err := dec.Decode(data)
	if err != nil {
		return fmt.Errorf("failed to decode json: %w", err)
	}

	return nil
}

func EncodeJson(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		return fmt.Errorf("failed to encode json: %w", err)
	}

	return nil
}

func WriteJson(w http.ResponseWriter, status int, data any) error {
	out, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to marshal json: %w", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err = w.Write(out)
	if err != nil {
		return fmt.Errorf("failed to write json: %w", err)
	}

	return nil
}

func ResponseErrorJson(w http.ResponseWriter, status int, message string) {
	EncodeJson(w, status, ErrorResponse{
		Error: message,
	})
}
