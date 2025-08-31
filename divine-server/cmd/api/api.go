package api

import (
	"fmt"
	"log"
	"net/http"
)

type ApiServer struct {
	addr   string
	router http.Handler
}

func New(addr string) *ApiServer {
	return &ApiServer{
		addr:   addr,
		router: registerRoutes(),
	}
}

func (s *ApiServer) Start() error {
	apiServer := &http.Server{
		Addr:    s.addr,
		Handler: s.router,
	}

	log.Println("Listen on port", s.addr)

	err := apiServer.ListenAndServe()
	if err != nil {
		return fmt.Errorf("failed to start server: %w", err)
	}

	return nil
}
