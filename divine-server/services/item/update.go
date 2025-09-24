package item

import (
	"math/rand"
)

const (
	maxChange = 0.2  // 20%
	minChange = 0.01 // 1%
)

func Update(items []*Item, nameMap map[string]int) []*Item {
	itemsCopied := make([]*Item, len(items))
	copy(itemsCopied, items)

	for i := range itemsCopied {
		item := itemsCopied[i]
		oldPrice := item.CurrentPrice
		item.PreviousPrice = oldPrice

		// price change percentage
		change := rand.Float64()*(maxChange-minChange) + minChange

		// 0: decrease, 1: increase, 2: no change
		// if item in map, no need to rand, use value in map to modify change
		ctype, ok := nameMap[item.Name]
		if ok {
			switch ctype {
			case 0:
				change = change * -1

			case 2:
				change = 0
			}
		} else {
			changeType := rand.Intn(3)
			if changeType == 2 {
				change = 0
			}
			if changeType == 0 {
				change = change * -1
			}
		}

		item.CurrentPrice = oldPrice * (1 + change)
	}
	return itemsCopied
}
