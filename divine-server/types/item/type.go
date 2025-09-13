package types

type Item struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	CurrentPrice  float64 `json:"current_price"`
	PreviousPrice float64 `json:"previous_price"`
}

type ItemRequest struct {
	Name string `json:"name"`
}
