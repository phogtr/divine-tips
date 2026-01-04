package item

import (
	"math/rand/v2"

	"github.com/phogtr/divine-tips/utils"
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
		changeType, ok := nameMap[item.Name]
		if ok {
			switch changeType {
			case 0:
				change = change * -1

			case 2:
				change = 0
			}
		} else {
			newChangeType := rand.IntN(3)
			if newChangeType == 2 {
				change = 0
			}
			if newChangeType == 0 {
				change = change * -1
			}
		}

		newPrice := oldPrice * (1 + change)
		item.CurrentPrice = utils.Round(newPrice, 2)
	}
	return itemsCopied
}
