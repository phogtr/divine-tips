package utils

import "math"

func Round(value float64, place int) float64 {
	factor := math.Pow(10, float64(place))
	return math.Round(value*factor) / factor
}

// value: 12.345678, place: 2
// factor = 10^2 = 100
// round(1234.5678) ==> 1235 / 100 ==> 12.35
