package day

import (
	"fmt"
	"net/http"
)

type Day struct{}

func (d *Day) Update(w http.ResponseWriter, r *http.Request) {
	fmt.Println("update day")
}

func (d *Day) AdvanceDay(w http.ResponseWriter, r *http.Request) {
	fmt.Println(("advance day"))
}
