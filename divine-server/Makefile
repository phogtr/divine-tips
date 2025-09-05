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

crt_dk_db:
	docker run -p 5432:5432 -d \
		--name $(POSTGRES_DOCKER) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		-v $(POSTGRES_VOLUME):/var/lib/postgresql/data \
		postgres:17

str_dk_db:
	@if docker container inspect $(POSTGRES_DOCKER) >/dev/null 2>&1; then \
		docker start $(POSTGRES_DOCKER); \
	else \
		echo "$(POSTGRES_DOCKER) not exist"; \
	fi

stp_dk_db:
	@run=$$(docker container inspect -f '{{.State.Running}}' $(POSTGRES_DOCKER) 2>/dev/null || echo "false"); \
	if [ "$$run" = "true" ]; then \
		docker stop $(POSTGRES_DOCKER); \
	else \
		echo "$(POSTGRES_DOCKER) is not running"; \
	fi

del_dk_db: stp_dk_db
	@if docker container inspect $(POSTGRES_DOCKER) >/dev/null 2>&1; then \
		docker rm -f $(POSTGRES_DOCKER); \
		echo "remove $(POSTGRES_DOCKER)"; \
	else \
		echo "$(POSTGRES_DOCKER) not exist"; \
	fi

del_dk_db_v:
	@if docker volume inspect $(POSTGRES_VOLUME) >/dev/null 2>&1; then \
		docker volume rm $(POSTGRES_VOLUME) || echo "$(POSTGRES_VOLUME) in used"; \
	else \
		echo "$(POSTGRES_VOLUME) not exist"; \
	fi

crt_mgr:
	@read -p "migration file name: " name; \
	docker run -it --rm --network host -v $$(pwd)/db:/db migrate/migrate:4 create -ext sql -dir db/migrations $$name

up_mgr:
	docker run -it --rm --network host -v $$(pwd)/db:/db migrate/migrate:4 -path=/db/migrations -database \
	postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST)/$(POSTGRES_DB)?sslmode=disable up

down_mgr:
	docker run -it --rm --network host -v $$(pwd)/db:/db migrate/migrate:4 -path=/db/migrations -database \
	postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST)/$(POSTGRES_DB)?sslmode=disable down	
