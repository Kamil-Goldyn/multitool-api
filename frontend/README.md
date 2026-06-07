# Frontend — Menedżer Zadań

Interfejs (React + Vite + Tailwind CSS v4) do API zarządzania zadaniami
(Spring Boot). Pełne CRUD: tworzenie, lista, edycja, zmiana statusu i usuwanie.

Ten projekt jest celowo **bogato skomentowany po polsku** — ma być punktem
wyjścia do nauki frontendu i do dalszych modyfikacji.

---

## 🚀 Jak uruchomić

```bash
# 1. Zainstaluj zależności (tylko raz)
npm install

# 2. Uruchom serwer deweloperski (z podglądem na żywo / HMR)
npm run dev
```

Aplikacja działa pod `http://localhost:5173`. Żądania do `/api/...` są
automatycznie przekierowywane na backend `http://localhost:8080`
(zobacz `vite.config.js` → `server.proxy`), więc **backend musi być uruchomiony**.

Inne polecenia:

```bash
npm run build     # produkcyjna wersja do katalogu dist/
npm run lint      # sprawdzenie kodu ESLintem
npm run preview   # podgląd zbudowanej wersji produkcyjnej
```

---

## 🗂️ Struktura projektu (od czego zacząć czytać)

Sugerowana kolejność czytania kodu — od najprostszego do najbardziej złożonego:

```
src/
├── constants/
│   └── taskStatus.js      # (1) Statusy zadań w jednym miejscu (etykiety, kolory)
├── api/
│   └── tasksApi.js        # (2) Cała komunikacja z backendem (fetch) w jednym module
├── components/
│   ├── StatusBadge.jsx    # (3) Najprostszy komponent — kolorowa plakietka statusu
│   ├── Toast.jsx          # (4) Powiadomienie "dymek"
│   ├── Header.jsx         # (5) Nagłówek + kafelki statystyk
│   ├── FilterBar.jsx      # (6) Wyszukiwarka + filtry statusu
│   ├── TaskForm.jsx       # (7) Formularz tworzenia I edycji (komponenty kontrolowane)
│   ├── TaskCard.jsx       # (8) Pojedyncza karta zadania + akcje
│   ├── Modal.jsx          # (9) Okno modalne (używane do edycji)
│   └── TaskList.jsx       # (10) Lista: stany ładowania / błędu / pusto + siatka kart
├── App.jsx                # (11) NAJWAŻNIEJSZY: stan + logika, "dyryguje" całością
├── main.jsx               # punkt wejścia — montuje <App /> w stronie
└── index.css              # motyw (kolory, czcionka), tło "aurora", animacje
```

---

## 🧠 Najważniejsze koncepty Reacta użyte w projekcie

Każdy z nich jest dokładnie opisany w komentarzach w odpowiednim pliku:

| Koncept | Gdzie zobaczyć | O co chodzi |
|---|---|---|
| **Komponenty + props** | `StatusBadge.jsx` | Małe klocki UI sterowane danymi z zewnątrz |
| **Stan (`useState`)** | `App.jsx`, `TaskForm.jsx` | Dane, które mogą się zmieniać i odrysowują widok |
| **Efekty (`useEffect`)** | `App.jsx` (pobieranie), `Modal.jsx` (Escape) | Reakcja na zdarzenia spoza Reacta + sprzątanie |
| **Komponenty kontrolowane** | `TaskForm.jsx` | Wartość pola = stan Reacta (jedno źródło prawdy) |
| **Lifting state up** | `App.jsx` ↔ karty/formularz | Stan trzymamy w rodzicu, dzieci zgłaszają zdarzenia |
| **Dane wyliczane (`useMemo`)** | `App.jsx` | Statystyki i filtrowanie liczone z listy, nie duplikowane |
| **Renderowanie list (`key`)** | `TaskList.jsx`, `TaskForm.jsx` | `map` + unikalny `key` dla każdego elementu |
| **Renderowanie warunkowe** | `Toast.jsx`, `TaskList.jsx` | `if`, `&&`, `? :` decydują, co pokazać |
| **`children`** | `Modal.jsx` | Komponent „opakowujący” dowolną treść |

---

## 🎨 Wygląd

- **Tailwind CSS v4** — stylujemy klasami bezpośrednio w JSX (`className="..."`).
- Motyw (paleta „brand”, czcionka Inter, animacje) jest w `index.css` w bloku `@theme`.
- Tło „aurora” (rozmyte gradienty) i efekt „szkła” (`.glass`) też są w `index.css`.

---

## 💡 Pomysły na dalszą naukę (rozszerzenia)

Świetne ćwiczenia, by pójść dalej:

1. **Ładne potwierdzenie usuwania** — dziś używamy `window.confirm`; masz już
   gotowy komponent `Modal`, więc zamień je na własne okno potwierdzenia.
2. **Sortowanie** — dodaj możliwość sortowania zadań po dacie lub tytule.
3. **Optimistic update** — zaktualizuj listę lokalnie od razu po akcji,
   zamiast czekać na ponowne pobranie z serwera (`loadTasks`).
4. **Licznik znaków** w polu opisu w `TaskForm`.
5. **Tryb ciemny** — dodaj wariant kolorów dla `prefers-color-scheme: dark`.
