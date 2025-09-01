package main

import (
	"log"

	"github.com/phogtr/divine-tips/cmd/api"
)

func main() {
	apiServer := api.New()

	err := apiServer.Start()
	if err != nil {
		log.Fatal("failed to start app:", err)
	}
}
