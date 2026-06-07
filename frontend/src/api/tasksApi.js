// =============================================================================
//  tasksApi.js  —  warstwa komunikacji z backendem (REST API)
// =============================================================================
//
//  DLACZEGO ODDZIELNY PLIK NA "FETCHE"?
//  Komponenty Reacta powinny zajmować się GŁÓWNIE wyglądem i interakcją.
//  Logikę "jak rozmawiać z serwerem" wyciągamy do osobnego modułu, bo:
//    1. Komponenty stają się krótsze i czytelniejsze.
//    2. Jeśli zmieni się adres API albo sposób obsługi błędów — poprawiamy
//       to w JEDNYM miejscu, a nie w każdym komponencie.
//    3. Łatwiej to przetestować w izolacji.
//
//  Wszystkie endpointy odpowiadają metodom z TaskController.java:
//    GET    /api/tasks        -> lista zadań
//    POST   /api/tasks        -> utwórz zadanie
//    PUT    /api/tasks/{id}   -> zaktualizuj zadanie
//    DELETE /api/tasks/{id}   -> usuń zadanie
//
//  Adres zaczyna się od "/api", a Vite (zobacz vite.config.js -> proxy)
//  przekieruje takie żądania na backend http://localhost:8080.
// =============================================================================

const BASE_URL = '/api/tasks'

// -----------------------------------------------------------------------------
//  Pomocnik: wspólna obsługa odpowiedzi z serwera.
// -----------------------------------------------------------------------------
//  `fetch` ma jeden haczyk: NIE rzuca wyjątku dla odpowiedzi 4xx/5xx.
//  Sukcesem (`response.ok === true`) jest tylko status 200–299. Dlatego
//  sami sprawdzamy `response.ok` i — gdy backend zwrócił błąd — wyciągamy
//  z niego sensowny komunikat (nasz backend zwraca ProblemDetail, zobacz
//  GlobalExceptionHandler.java) i rzucamy własny błąd.
//
//  Dzięki temu w komponentach możemy po prostu pisać try/catch i mieć pewność,
//  że w `catch` wyląduje czytelna wiadomość dla użytkownika.
async function handleResponse(response) {
  // 204 No Content (np. po DELETE) nie ma ciała odpowiedzi — zwracamy null.
  if (response.status === 204) return null

  // Próbujemy odczytać ciało jako JSON. Owijamy w try, bo pusta/niepoprawna
  // odpowiedź wysypałaby `response.json()`.
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    // Backend (ProblemDetail) zwraca pola `detail` i czasem mapę `errors`.
    // Budujemy z nich jak najbardziej pomocny komunikat.
    const fieldErrors = data?.errors
      ? Object.values(data.errors).join(' • ')
      : null
    const message =
      fieldErrors || data?.detail || data?.title || `Błąd serwera (${response.status})`
    throw new Error(message)
  }

  return data
}

// -----------------------------------------------------------------------------
//  Konkretne metody API. Każda zwraca Promise (bo jest `async`),
//  dlatego w komponentach używamy ich z `await`.
// -----------------------------------------------------------------------------

// Pobierz wszystkie zadania.
export async function getTasks() {
  const response = await fetch(BASE_URL)
  return handleResponse(response)
}

// Utwórz nowe zadanie. `task` to obiekt { title, description, status }.
export async function createTask(task) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // mówimy serwerowi, że wysyłamy JSON
    body: JSON.stringify(task), // obiekt JS -> tekst JSON
  })
  return handleResponse(response)
}

// Zaktualizuj istniejące zadanie o danym `id`.
export async function updateTask(id, task) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  return handleResponse(response)
}

// Usuń zadanie o danym `id`. Backend zwraca 204, więc dostaniemy null.
export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}
