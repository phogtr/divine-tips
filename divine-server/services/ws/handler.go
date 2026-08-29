package ws

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/phogtr/divine-tips/config"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     checkOrigin,
}

type WsHandler struct {
	hub *Hub
}

func NewHandler(hub *Hub) *WsHandler {
	return &WsHandler{
		hub: hub,
	}
}

func (h *WsHandler) Connect(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := NewClient(h.hub, conn)
	h.hub.RegisterClient(client)

	go client.readMessages()
	go client.writeMessages()

}

func checkOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")

	for _, allowed := range config.Env.AllowOrigins {
		if origin == allowed {
			return true
		}
	}
	return false
}
