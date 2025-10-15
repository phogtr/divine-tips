package item

type Item struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	CurrentPrice  float64 `json:"current"`
	PreviousPrice float64 `json:"previous"`
}

type ItemRequest struct {
	Name string `json:"name"`
}

type ItemDelta struct {
	Item
	Delta        float64 `json:"delta"`
	DeltaPercent float64 `json:"deltaPercent"`
}
