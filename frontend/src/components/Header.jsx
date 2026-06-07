// =============================================================================
//  Header.jsx  —  nagłówek strony z tytułem i "kafelkami" statystyk
// =============================================================================
//
//  Czysto prezentacyjny komponent. Dostaje policzone wcześniej statystyki
//  i pokazuje je w ładnych kafelkach. Liczenie odbywa się w App — tutaj
//  tylko wyświetlamy gotowe wartości.
//
//  PROPS:
//    - stats: { total, TODO, IN_PROGRESS, DONE }
// =============================================================================

import { STATUS, STATUS_META } from '../constants/taskStatus'

// Mały, wewnętrzny komponent pomocniczy na pojedynczy kafelek statystyki.
// Definiowanie takich "prywatnych" komponentów w tym samym pliku jest OK,
// gdy używamy ich tylko tutaj.
function StatCard({ label, value, dotClass }) {
  return (
    <div className="glass rounded-2xl border border-white/60 px-4 py-3 shadow-md shadow-brand-900/5">
      <div className="flex items-center gap-2">
        {dotClass && <span className={`h-2 w-2 rounded-full ${dotClass}`} />}
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
      </div>
      {/* `tabular-nums` sprawia, że cyfry mają równą szerokość — liczby nie
          "skaczą", gdy się zmieniają. */}
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-800">
        {value}
      </p>
    </div>
  )
}

function Header({ stats }) {
  return (
    <header className="animate-fade-in">
      {/* Górny "znaczek" nad tytułem. */}
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200
                      bg-white/60 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
        Multitool API · Frontend
      </div>

      {/* Tytuł z gradientowym tekstem — efekt uzyskany przez przezroczysty
          tekst nałożony na gradientowe tło (bg-clip-text). */}
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        <span className="bg-gradient-to-r from-brand-700 via-brand-500 to-pink-500 bg-clip-text text-transparent">
          Menedżer Zadań
        </span>
      </h1>
      <p className="mt-2 max-w-xl text-sm text-slate-500">
        Twórz, edytuj i śledź swoje zadania. Wszystko zapisuje się na żywo
        w bazie danych przez REST API.
      </p>

      {/* Siatka kafelków statystyk. Na małych ekranach 2 kolumny, na większych 4. */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Wszystkie" value={stats.total} dotClass="bg-brand-500" />
        <StatCard
          label={STATUS_META[STATUS.TODO].label}
          value={stats[STATUS.TODO]}
          dotClass={STATUS_META[STATUS.TODO].dot}
        />
        <StatCard
          label={STATUS_META[STATUS.IN_PROGRESS].label}
          value={stats[STATUS.IN_PROGRESS]}
          dotClass={STATUS_META[STATUS.IN_PROGRESS].dot}
        />
        <StatCard
          label={STATUS_META[STATUS.DONE].label}
          value={stats[STATUS.DONE]}
          dotClass={STATUS_META[STATUS.DONE].dot}
        />
      </div>
    </header>
  )
}

export default Header
