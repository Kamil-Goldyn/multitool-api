// =============================================================================
//  taskStatus.js  —  jedno źródło prawdy o statusach zadań
// =============================================================================
//
//  DLACZEGO TEN PLIK ISTNIEJE?
//  Backend rozumie tylko trzy stringi: "TODO", "IN_PROGRESS", "DONE"
//  (zobacz walidację w TaskCreateRequest.java -> @Pattern).
//
//  Gdybyśmy te wartości "rozsypali" po całej aplikacji (raz w formularzu,
//  raz w filtrze, raz w karcie zadania), to każda literówka = błąd, a każda
//  zmiana = poprawianie w 10 miejscach. Dlatego trzymamy je w JEDNYM miejscu.
//  To bardzo częsta i dobra praktyka: "single source of truth".
//
//  Eksportujemy gotową tablicę obiektów, bo dzięki temu w komponentach
//  możemy po niej wygodnie iterować (np. generować przyciski filtrów).
// =============================================================================

// Surowe wartości, których oczekuje backend. `Object.freeze` zamraża obiekt,
// więc nikt przez przypadek go nie nadpisze w trakcie działania aplikacji.
export const STATUS = Object.freeze({
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
})

// Pełny "słownik" statusów: techniczna wartość + ładna etykieta po polsku
// + zestaw klas Tailwind, którymi pokolorujemy etykietę (badge) na karcie.
// Trzymanie stylów tutaj sprawia, że kolory są spójne w całej aplikacji.
export const STATUS_META = {
  [STATUS.TODO]: {
    value: STATUS.TODO,
    label: 'Do zrobienia',
    // Kolor "kropki" i tekstu dla tego statusu (paleta slate/szarości).
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
  [STATUS.IN_PROGRESS]: {
    value: STATUS.IN_PROGRESS,
    label: 'W trakcie',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-800 ring-amber-200',
  },
  [STATUS.DONE]: {
    value: STATUS.DONE,
    label: 'Zakończone',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  },
}

// Kolejność, w jakiej chcemy pokazywać statusy (np. w filtrach).
// `Object.values` zwróciłoby je w kolejności zdefiniowania, ale jawna lista
// jest czytelniejsza i odporna na przyszłe zmiany.
export const STATUS_ORDER = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE]
