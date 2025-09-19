package item

import (
	"math/rand"

	types "github.com/phogtr/divine-tips/types/item"
)

const (
	maxChange = 0.2  // 20%
	minChange = 0.01 // 1%
)

func Update(items []*types.Item) []*types.Item {
	itemsCopied := make([]*types.Item, len(items))
	copy(itemsCopied, items)

	for i := range itemsCopied {
		item := itemsCopied[i]
		oldPrice := item.CurrentPrice
		item.PreviousPrice = oldPrice

		// 0: decrease, 1: increase, 2: no change
		changeType := rand.Intn(3)
		if changeType == 2 {
			continue
		}

		// price change percentage
		change := rand.Float64()*(maxChange-minChange) + minChange

		if changeType == 0 {
			change = change * -1
		}

		item.CurrentPrice = oldPrice * (1 + change)
	}
	return itemsCopied
}
