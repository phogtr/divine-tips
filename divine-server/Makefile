include .env

build:
	@if [ -f "$(BINARY)" ]; then \
		rm $(BINARY); \
		echo "delete $(BINARY)"; \
	fi
	go build -o $(BINARY) cmd/*.go

run: build
	./$(BINARY)

stop: 
	@echo "pkill..."
	@-pkill -SIGTERM -f "./$(BINARY)"
	@echo "stopped"

