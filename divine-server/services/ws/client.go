package ws

import (
	"github.com/gorilla/websocket"
)

const (
	messagesBufferSize = 256
)

type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	messages chan []byte
}

func NewClient(hub *Hub, conn *websocket.Conn) *Client {
	return &Client{
		hub:      hub,
		conn:     conn,
		messages: make(chan []byte, messagesBufferSize),
	}
}

func (c *Client) readMessages() {
	defer func() {
		c.hub.UnregisterClient(c)
		c.conn.Close()
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			return
		}

		// todo: remove, only for testing
		c.messages <- message
	}
}

func (c *Client) writeMessages() {
	defer func() {
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.messages:
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		}
	}
}
