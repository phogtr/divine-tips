package event

import (
	"math/rand/v2"

	"github.com/phogtr/divine-tips/services/item"
)

const eventItemCount = 5 // up to this amount

var increaseDesc = [3]string{
	"Likely to grow",
	"Climbing",
	"May rise",
}

var decreaseDesc = [3]string{
	"Likely to drop",
	"Falling",
	"May dip",
}

var noChangeDesc = [3]string{
	"Likely to stay constant",
	"Holding steady",
	"May remain stable",
}

func Create(items []*item.Item) []*EventItem {
	count := rand.IntN(eventItemCount) + 1
	itemMap := make(map[int][]string)
	indexMap := make(map[int]bool)

	for len(indexMap) < count {
		index := rand.IntN(len(items))
		if indexMap[index] {
			// item already picked
			continue
		}
		indexMap[index] = true

		item := items[index]
		changeType := rand.IntN(3)
		itemMap[changeType] = append(itemMap[changeType], item.Name)
	}

	var eventItem []*EventItem
	for k, v := range itemMap {
		var ei EventItem
		ei.Type = k
		ei.Name = v

		switch ei.Type {
		case 0:
			idx := rand.IntN(3)
			ei.TypeDescription = decreaseDesc[idx]
		case 1:
			idx := rand.IntN(3)
			ei.TypeDescription = increaseDesc[idx]
		case 2:
			idx := rand.IntN(3)
			ei.TypeDescription = noChangeDesc[idx]
		}

		eventItem = append(eventItem, &ei)
	}
	return eventItem
}

func NameTypeMap(event *Event) map[string]int {
	out := make(map[string]int)

	for i := range event.Data {
		eventItem := event.Data[i]
		names := eventItem.Name

		for _, name := range names {
			out[name] = eventItem.Type
		}
	}

	return out
}
