package event

import (
	"math/rand"

	"github.com/phogtr/divine-tips/services/item"
)

const eventItemCount = 5 // up to this amount

var increaseDesc = [3]string{
	"likely to grow",
	"climbing",
	"may rise",
}

var decreaseDesc = [3]string{
	"likely to drop",
	"falling",
	"may dip",
}

var noChangeDesc = [3]string{
	"likely to stay constant",
	"holding steady",
	"may remain stable",
}

func Create(items []*item.Item) []*EventItem {
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
		ctype := rand.Intn(3)
		itemMap[ctype] = append(itemMap[ctype], item.Name)
	}

	var eventItem []*EventItem
	for k, v := range itemMap {
		var ei EventItem
		ei.Type = k
		ei.Name = v

		switch ei.Type {
		case 0:
			idx := rand.Intn(3)
			ei.TypeDescription = decreaseDesc[idx]
		case 1:
			idx := rand.Intn(3)
			ei.TypeDescription = increaseDesc[idx]
		case 2:
			idx := rand.Intn(3)
			ei.TypeDescription = noChangeDesc[idx]
		}

		eventItem = append(eventItem, &ei)
	}
	return eventItem
}
