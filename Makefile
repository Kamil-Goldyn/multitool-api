# Zmienne środowiskowe dla naszego Makefila
DB_CONTAINER_NAME=multitool-postgres

.PHONY: db db-stop app run

# 1. Uruchamia bazę (jeśli kontener istnieje to go startuje, jeśli nie - tworzy nowy)
db:
	@echo "🐘 Uruchamiam baze PostgreSQL..."
	@docker start $(DB_CONTAINER_NAME) || docker run --name $(DB_CONTAINER_NAME) \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=multitooldb \
		-p 5432:5432 \
		-d postgres:16-alpine

# 2. Zatrzymuje bazę
db-stop:
	@echo "🛑 Zatrzymuje baze PostgreSQL..."
	@docker stop $(DB_CONTAINER_NAME)

# 3. Uruchamia aplikację Spring Boot przy użyciu wbudowanego Maven Wrappera
app:
	@echo "🚀 Uruchamiam aplikacje Spring Boot..."
	./mvnw spring-boot:run

# 4. Magiczna komenda: najpierw odpala bazę, a potem aplikację
run: db app
