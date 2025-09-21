package day

type Day struct {
	SystemDay int `json:"system_day"`
}

type DayRequest struct {
	NewDay int `json:"new_day"`
}
