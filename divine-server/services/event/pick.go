package event

import (
	"math/rand"

	eventType "github.com/phogtr/divine-tips/types/event"
	itemType "github.com/phogtr/divine-tips/types/item"
)

const eventItemCount = 5 // up to this amount

func PickItem(items []*itemType.Item) []*eventType.EventItem {
	count := rand.Intn(eventItemCount) + 1
	itemMap := make(map[int][]string)
	indexMap := make(map[int]bool)

	for len(indexMap) < count {
		index := rand.Intn(len(items))
		if indexMap[index] {
			// item already picked
			continue
		}
		indexMap[index] = true

		item := items[index]

		if item.CurrentPrice < item.PreviousPrice {
			itemMap[0] = append(itemMap[0], item.Name)
		} else if item.CurrentPrice > item.PreviousPrice {
			itemMap[1] = append(itemMap[1], item.Name)
		} else {
			itemMap[2] = append(itemMap[2], item.Name)
		}
	}

	var eventItem []*eventType.EventItem
	for k, v := range itemMap {
		var ei eventType.EventItem
		ei.Type = k
		ei.Name = v
		eventItem = append(eventItem, &ei)
	}
	return eventItem
}
