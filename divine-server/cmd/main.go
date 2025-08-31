package main

import (
	"fmt"

	"github.com/phogtr/divine-tips/cmd/api"
)

func main() {
	apiServer := api.New(":3000")

	err := apiServer.Start()
	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
