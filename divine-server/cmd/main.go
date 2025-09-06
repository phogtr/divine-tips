package main

import (
	"log"

	"github.com/phogtr/divine-tips/cmd/api"
	"github.com/phogtr/divine-tips/db"
)

func main() {
	db, err := db.NewPostgresDB()
	if err != nil {
		log.Fatal("failed to connect to database:", err)
	}
	defer db.Close()
	log.Printf("connected to database")

	apiServer := api.New()

	err = apiServer.Start()
	if err != nil {
		log.Fatal("failed to start app:", err)
	}
}
