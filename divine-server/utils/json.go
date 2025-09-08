package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func DecodeJson(w http.ResponseWriter, r *http.Request, data any) error {
	if r.Body == nil {
		w.WriteHeader(http.StatusBadRequest)
		return fmt.Errorf("request body is empty")
	}

	if err := json.NewDecoder(r.Body).Decode(data); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return fmt.Errorf("failed to decode json: %w", err)
	}

	return nil
}

func EncodeJson(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return fmt.Errorf("failed to encode json: %w", err)
	}

	return nil
}

func WriteJson(w http.ResponseWriter, status int, data any) error {
	out, err := json.Marshal(data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return fmt.Errorf("failed to marshal json: %w", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err = w.Write(out)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return fmt.Errorf("failed to write json: %w", err)
	}

	return nil
}

func ResponseErrorJson(w http.ResponseWriter, status int, message string) {
	EncodeJson(w, status, map[string]string{"error": message})
}
