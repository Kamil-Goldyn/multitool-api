// =============================================================================
//  StatusBadge.jsx  —  mała, kolorowa "plakietka" pokazująca status zadania
// =============================================================================
//
//  To przykład komponentu PREZENTACYJNEGO: nie ma własnego stanu, nie pobiera
//  danych — tylko dostaje `status` przez props i ładnie go wyświetla.
//  Takie małe, wyspecjalizowane komponenty to fundament Reacta: budujemy
//  z nich większe widoki jak z klocków.
//
//  PROPS (czyli dane wejściowe komponentu):
//    - status: jeden ze stringów "TODO" | "IN_PROGRESS" | "DONE"
// =============================================================================

import { STATUS_META } from '../constants/taskStatus'

function StatusBadge({ status }) {
  // Wyciągamy opis statusu (etykietę + kolory) z naszego słownika.
  // Gdyby backend zwrócił coś nieznanego, używamy `?? ...` jako bezpiecznika.
  const meta = STATUS_META[status] ?? {
    label: status,
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
                  text-xs font-semibold ring-1 ring-inset ${meta.badge}`}
    >
      {/* Mała kropka w kolorze statusu — subtelny, ale czytelny detal. */}
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

export default StatusBadge
