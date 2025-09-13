package types

type Item struct {
	ID            int
	Name          string
	CurrentPrice  float64
	PreviousPrice float64
}

type ItemRequest struct {
	Name string `json:"name"`
}
