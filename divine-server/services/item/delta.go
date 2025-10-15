package item

import (
	"math"

	"github.com/phogtr/divine-tips/utils"
)

func Delta(items []*Item) []*ItemDelta {
	var out []*ItemDelta

	itemCopied := make([]*Item, len(items))
	copy(itemCopied, items)

	for _, item := range itemCopied {
		delta := math.Abs(utils.Round((item.CurrentPrice - item.PreviousPrice), 2))
		deltaPercent := math.Abs(utils.Round(((delta / item.PreviousPrice) * 100), 2))

		var newItem ItemDelta
		newItem.ID = item.ID
		newItem.Name = item.Name
		newItem.CurrentPrice = item.CurrentPrice
		newItem.PreviousPrice = item.PreviousPrice
		newItem.Delta = delta
		newItem.DeltaPercent = deltaPercent

		out = append(out, &newItem)
	}

	return out
}
