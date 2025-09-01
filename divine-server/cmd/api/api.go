package api

import (
	"fmt"
	"log"
	"net/http"

	"github.com/phogtr/divine-tips/config"
)

type ApiServer struct {
	addr   string
	router http.Handler
}

func New() *ApiServer {
	return &ApiServer{
		addr:   fmt.Sprintf(":%s", config.Env.ServerPort),
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
