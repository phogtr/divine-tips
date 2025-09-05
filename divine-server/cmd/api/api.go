package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/phogtr/divine-tips/config"
)

type ApiServer struct {
	router http.Handler
}

func New() *ApiServer {
	return &ApiServer{
		router: registerRoutes(),
	}
}

func (s *ApiServer) Start() error {
	port := config.Env.ServerPort

	apiServer := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: s.router,
	}

	log.Println("Listen on port", port)

	err := apiServer.ListenAndServe()
	if err != nil {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}
