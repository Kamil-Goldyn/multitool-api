// =============================================================================
//  Toast.jsx  —  "dymek" z powiadomieniem (sukces / błąd)
// =============================================================================
//
//  Toast to popularny wzorzec UI: krótki komunikat, który pojawia się
//  na chwilę (np. "Zadanie dodane!") i sam znika. To dużo przyjemniejsze
//  niż brzydkie `alert()`.
//
//  PROPS:
//    - toast:   obiekt { message, type } albo null (gdy nic nie pokazujemy)
//    - onClose: funkcja wywoływana, gdy użytkownik kliknie "x"
//
//  Samo "znikanie po czasie" obsługujemy w App.jsx (useEffect z timerem),
//  bo to logika stanu — tutaj zajmujemy się tylko wyglądem.
// =============================================================================

function Toast({ toast, onClose }) {
  // Gdy nie ma czego pokazać, komponent nic nie renderuje.
  // Zwrócenie `null` to w Reacie standardowy sposób na "narysuj nic".
  if (!toast) return null

  const isError = toast.type === 'error'

  return (
    <div
      // `fixed` przykleja toast do okna (nie przewija się z treścią).
      // Wysoki z-index trzyma go nad wszystkim innym.
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-pop"
      role="status" // dla czytników ekranu: to komunikat o stanie
    >
      <div
        className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium
                    text-white shadow-2xl shadow-black/20 ${
                      isError ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
      >
        {/* Ikonka zależna od typu: ✓ dla sukcesu, ! dla błędu. */}
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/25 text-base">
          {isError ? '!' : '✓'}
        </span>

        <span>{toast.message}</span>

        <button
          onClick={onClose}
          className="ml-2 rounded-full px-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
          aria-label="Zamknij powiadomienie"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast
