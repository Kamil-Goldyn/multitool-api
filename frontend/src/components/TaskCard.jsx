// =============================================================================
//  TaskCard.jsx  —  pojedyncza karta zadania na liście
// =============================================================================
//
//  Pokazuje jedno zadanie i daje akcje: szybką zmianę statusu, edycję i
//  usunięcie. Sama nie rozmawia z serwerem — gdy użytkownik coś kliknie,
//  woła funkcję otrzymaną od rodzica (App). To wzorzec "lifting state up":
//  dane i logika żyją wyżej, a karta tylko zgłasza "użytkownik chce X".
//
//  PROPS:
//    - task:           { id, title, description, status, createdAt }
//    - onEdit(task):       użytkownik kliknął "Edytuj"
//    - onDelete(task):     użytkownik kliknął "Usuń"
//    - onChangeStatus(task, nextStatus): zmiana statusu z menu na karcie
// =============================================================================

import StatusBadge from './StatusBadge'
import { STATUS_ORDER, STATUS_META } from '../constants/taskStatus'

// Pomocnik: zamienia datę z backendu (ISO, np. "2026-06-07T10:15:30")
// na czytelny dla człowieka tekst po polsku. `Intl` to wbudowany w przeglądarkę
// mechanizm formatowania dat/liczb pod konkretny język.
function formatDate(isoString) {
  if (!isoString) return '—'
  try {
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoString))
  } catch {
    return isoString // gdyby data była dziwna, pokaż ją "jak jest"
  }
}

function TaskCard({ task, onEdit, onDelete, onChangeStatus }) {
  return (
    <article
      className="glass group flex flex-col gap-4 rounded-2xl border border-white/60 p-5
                 shadow-lg shadow-brand-900/5 transition duration-300
                 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10 animate-rise"
    >
      {/* GÓRNY WIERSZ: tytuł + plakietka statusu */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold leading-snug text-slate-800">
          {task.title}
        </h3>
        <StatusBadge status={task.status} />
      </div>

      {/* OPIS. `break-words` zapobiega "rozpychaniu" karty przez długie słowa. */}
      <p className="-mt-1 text-sm leading-relaxed text-slate-500 break-words">
        {task.description}
      </p>

      {/* SZYBKA ZMIANA STATUSU: małe przyciski "przerzucające" zadanie.
          Pokazujemy tylko statusy INNE niż obecny — bo po co przełączać
          na ten sam? */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_ORDER.filter((s) => s !== task.status).map((nextStatus) => (
          <button
            key={nextStatus}
            onClick={() => onChangeStatus(task, nextStatus)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200
                       bg-white/60 px-2 py-1 text-xs font-medium text-slate-500
                       transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[nextStatus].dot}`} />
            → {STATUS_META[nextStatus].label}
          </button>
        ))}
      </div>

      {/* DOLNY WIERSZ: data utworzenia + akcje (edytuj / usuń).
          Akcje pojawiają się wyraźniej po najechaniu na kartę (group-hover). */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">
          {formatDate(task.createdAt)}
        </span>

        <div className="flex items-center gap-1 opacity-70 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500
                       transition hover:bg-brand-50 hover:text-brand-700"
          >
            ✎ Edytuj
          </button>
          <button
            onClick={() => onDelete(task)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500
                       transition hover:bg-rose-50 hover:text-rose-600"
          >
            🗑 Usuń
          </button>
        </div>
      </div>
    </article>
  )
}

export default TaskCard
