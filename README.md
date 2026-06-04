# Multi-Tool API

Aplikacja typu Full-Stack. Backend zbudowany w **Java / Spring Boot** w oparciu o architekturę wielowarstwową, współpracujący z nowoczesną aplikacją kliencką (SPA) w **React**. Projekt składa się z niezależnych modułów, z których każdy prezentuje praktyczne wykorzystanie innych narzędzi i wzorców projektowych.

## Tech Stack

**Backend:**
* **Język:** Java (LTS / 25)
* **Framework:** Spring Boot 4.x
* **Baza Danych:** PostgreSQL (Docker)
* **Migracje:** Flyway
* **Dokumentacja API:** Swagger / OpenAPI
* **Zarządzanie pakietami:** Maven

**Frontend:**
* **Biblioteka główna:** React
* **Narzędzie budowania:** Vite
* **Środowisko:** Node.js / npm

---

## Uruchomienie projektu (Szybki Start)

Do pełnego uruchomienia aplikacji wymagane jest otworzenie dwóch niezależnych sesji terminala. Wymagane środowiska: **Docker** oraz **Node.js**.

### 1. Uruchomienie Backendu
Backend obsługiwany jest za pomocą pliku `Makefile`. Otwórz terminal w głównym katalogu projektu:

| Komenda | Opis |
| :--- | :--- |
| `make run` | Uruchamia kontener z bazą PostgreSQL, a następnie startuje aplikację Spring Boot. |
| `make db` | Uruchamia lub tworzy kontener z bazą PostgreSQL. |
| `make db-stop` | Zatrzymuje kontener z bazą. |
| `make app` | Uruchamia aplikację Spring Boot (wymaga uruchomionej bazy). |

### 2. Uruchomienie Frontendu
W nowej karcie terminala przejdź do podkatalogu frontendu i uruchom serwer deweloperski:

    cd frontend
    npm install  # Tylko przy pierwszym uruchomieniu
    npm run dev

Frontend będzie dostępny pod adresem: **http://localhost:5173**. 
> Serwer Vite posiada skonfigurowane proxy, które automatycznie przekierowuje zapytania z `/api` na port backendu (8080), co rozwiązuje problemy z CORS w środowisku deweloperskim.

---

## Dokumentacja API

Po uruchomieniu backendu, interaktywna dokumentacja Swagger jest dostępna pod adresem:
**[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)**

---

## Konfiguracja Bazy Danych

Baza tworzona jest automatycznie w kontenerze Docker. Parametry dostępu dla klientów SQL (np. DBeaver, DataGrip):

* **Dialekt:** PostgreSQL
* **Host:** `localhost`
* **Port:** `5432`
* **Database:** `multitooldb`
* **Username:** `postgres`
* **Password:** `postgres`

> Struktura tabel zarządzana jest przez **Flyway** (katalog: `src/main/resources/db/migration/`).

---

## Zaimplementowane Moduły

### 1. Task Manager
CRUD do zarządzania zadaniami. Wykorzystuje separację warstw (Controller -> Service -> Repository), mapowanie encji na DTO (Builder) oraz walidację danych wejściowych `jakarta.validation`. Formularz dodawania zintegrowany po stronie frontendu w React.

* `POST /api/tasks` - Tworzenie nowego zadania.
