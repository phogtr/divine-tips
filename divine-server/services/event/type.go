package event

type Event struct {
	Day  int          `json:"day"`
	Data []*EventItem `json:"data"`
}

type EventItem struct {
	Name            []string `json:"name"`
	Type            int      `json:"type"`
	TypeDescription string   `json:"desc"`
}

