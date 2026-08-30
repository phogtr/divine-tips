package ws

import "sync"

type Hub struct {
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan []byte
	mu         sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte, 256),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				close(client.messages)
				delete(h.clients, client)
			}
			h.mu.Unlock()

		case message := <-h.broadcast:
			h.mu.Lock()
			for client := range h.clients {
				select {
				case client.messages <- message:

				default:
					// client's messages channel is full
					close(client.messages)
					delete(h.clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}

func (h *Hub) RegisterClient(client *Client) {
	h.register <- client
}

func (h *Hub) UnregisterClient(client *Client) {
	h.unregister <- client
}

func (h *Hub) Broadcast(message []byte) {
	h.broadcast <- message
}
