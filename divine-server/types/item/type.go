package types

type Item struct {
	ID            int
	Name          string
	CurrentPrice  float32
	PreviousPrice float32
}

type ItemRequest struct {
	Name string `json:"name"`
}
