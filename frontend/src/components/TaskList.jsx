// =============================================================================
//  TaskList.jsx  —  lista zadań z obsługą stanów: ładowanie / błąd / pusto
// =============================================================================
//
//  Dobry interfejs przewiduje, że dane mogą się jeszcze ładować, mogą się nie
//  wczytać (błąd), albo może ich po prostu nie być (pusto). Ten komponent
//  pokazuje odpowiedni widok dla każdego z tych przypadków, a dopiero gdy
//  wszystko gra — renderuje siatkę kart.
//
//  PROPS:
//    - tasks:    tablica zadań DO WYŚWIETLENIA (już przefiltrowana w App)
//    - loading:  czy trwa pierwsze pobieranie
//    - error:    komunikat błędu lub null
//    - isFiltered: czy aktywny jest jakiś filtr/szukanie (zmienia tekst "pusto")
//    - onEdit / onDelete / onChangeStatus: akcje przekazywane do każdej karty
// =============================================================================

import TaskCard from './TaskCard'

// Mały "szkielet" (placeholder) karty pokazywany podczas ładowania.
// To popularny wzorzec: zamiast pustego ekranu pokazujemy migający zarys
// tego, co zaraz się pojawi. `animate-pulse` to gotowa animacja Tailwinda.
function SkeletonCard() {
  return (
    <div className="glass animate-pulse rounded-2xl border border-white/60 p-5 shadow-md">
      <div className="mb-3 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mb-2 h-3 w-full rounded bg-slate-100" />
      <div className="mb-4 h-3 w-4/5 rounded bg-slate-100" />
      <div className="h-3 w-1/3 rounded bg-slate-100" />
    </div>
  )
}

// Wspólny "pojemnik" na komunikaty pełnoekranowe (błąd / pusto).
function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="glass col-span-full flex flex-col items-center justify-center gap-2
                    rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center
                    animate-fade-in">
      <span className="text-4xl">{icon}</span>
      <p className="text-base font-semibold text-slate-700">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-slate-400">{subtitle}</p>}
    </div>
  )
}

function TaskList({ tasks, loading, error, isFiltered, onEdit, onDelete, onChangeStatus }) {
  // Wspólna siatka: 1 kolumna na telefonie, 2 na tablecie, 3 na desktopie.
  const gridClasses = 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'

  // 1) ŁADOWANIE — pokaż kilka szkieletów.
  if (loading) {
    return (
      <div className={gridClasses}>
        {/* Array.from tworzy tablicę "od zera" — tu 6 atrap kart. */}
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  // 2) BŁĄD — coś poszło nie tak przy pobieraniu z serwera.
  if (error) {
    return (
      <div className={gridClasses}>
        <EmptyState
          icon="⚠️"
          title="Nie udało się wczytać zadań"
          subtitle={error}
        />
      </div>
    )
  }

  // 3) PUSTO — brak zadań (rozróżniamy: brak w ogóle vs. brak po filtrze).
  if (tasks.length === 0) {
    return (
      <div className={gridClasses}>
        <EmptyState
          icon={isFiltered ? '🔍' : '🗂️'}
          title={isFiltered ? 'Brak pasujących zadań' : 'Nie masz jeszcze żadnych zadań'}
          subtitle={
            isFiltered
              ? 'Spróbuj zmienić filtr albo wyczyścić wyszukiwanie.'
              : 'Dodaj pierwsze zadanie w formularzu obok — pojawi się tutaj.'
          }
        />
      </div>
    )
  }

  // 4) SUKCES — renderujemy karty. Każda dostaje swoje zadanie i akcje.
  return (
    <div className={gridClasses}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  )
}

export default TaskList
