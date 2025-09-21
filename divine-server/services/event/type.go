package event

type EventItem struct {
	Name            []string `json:"name"`
	Type            int      `json:"type"`
	TypeDescription string   `json:"desc"`
}

