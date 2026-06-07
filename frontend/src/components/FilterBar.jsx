// =============================================================================
//  FilterBar.jsx  —  pasek z wyszukiwarką i filtrami statusu
// =============================================================================
//
//  Pozwala zawęzić listę zadań: po tekście (tytuł/opis) i po statusie.
//  To komponent KONTROLOWANY przez rodzica: nie trzyma własnego stanu filtrów,
//  tylko dostaje aktualne wartości i funkcje do ich zmiany. Dzięki temu
//  App jest "jedynym źródłem prawdy" o tym, co aktualnie jest filtrowane.
//
//  PROPS:
//    - query, onQueryChange:   tekst wyszukiwania i funkcja go zmieniająca
//    - filter, onFilterChange: aktywny status ('ALL' lub konkretny) i jego zmiana
// =============================================================================

import { STATUS_ORDER, STATUS_META } from '../constants/taskStatus'

// Lista zakładek filtra: najpierw "Wszystkie", potem statusy ze słownika.
const TABS = [
  { value: 'ALL', label: 'Wszystkie' },
  ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_META[s].label })),
]

function FilterBar({ query, onQueryChange, filter, onFilterChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* WYSZUKIWARKA */}
      <div className="relative w-full sm:max-w-xs">
        {/* Ikonka lupy ułożona absolutnie wewnątrz pola. */}
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Szukaj zadania…"
          className="glass w-full rounded-xl border border-white/60 py-2.5 pl-9 pr-4 text-sm
                     text-slate-700 shadow-sm transition placeholder:text-slate-400
                     focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
      </div>

      {/* ZAKŁADKI STATUSU */}
      <div className="glass inline-flex gap-1 rounded-xl border border-white/60 p-1 shadow-sm">
        {TABS.map((tab) => {
          const active = filter === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow'
                  : 'text-slate-500 hover:bg-white/70 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FilterBar
