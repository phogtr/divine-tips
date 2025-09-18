package types

type Item struct {
	ID            int
	Name          string
	CurrentPrice  float64
	PreviousPrice float64
}

type ItemResponse struct {
	Name          string  `json:"name"`
	CurrentPrice  float64 `json:"current_price"`
	PreviousPrice float64 `json:"previous_price"`
}

type ItemRequest struct {
	Name string `json:"name"`
}
