package api

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/phogtr/divine-tips/config"
)

type ApiServer struct {
	router http.Handler
	db     *sql.DB
}

func New(db *sql.DB) *ApiServer {
	apiServer := &ApiServer{
		db: db,
	}

	apiServer.registerRoutes()

	return apiServer
}

func (a *ApiServer) Start() error {
	port := config.Env.ServerPort

	apiServer := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: a.router,
	}

	log.Println("Listen on port", port)

	err := apiServer.ListenAndServe()
	if err != nil {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}
