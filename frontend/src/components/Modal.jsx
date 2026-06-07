// =============================================================================
//  Modal.jsx  —  okno modalne (nakładka na środku ekranu)
// =============================================================================
//
//  Modal to "okienko", które wyświetla się NAD resztą strony, przyciemniając
//  tło. Używamy go do edycji zadania.
//
//  PROPS:
//    - open:     boolean — czy modal jest otwarty
//    - title:    nagłówek okna
//    - onClose:  funkcja zamykająca modal
//    - children: zawartość okna (to, co wstawimy między <Modal>...</Modal>)
//
//  KONCEPT: `children` to specjalny props w Reacie — to wszystko, co
//  umieścimy WEWNĄTRZ znacznika komponentu. Dzięki temu Modal jest uniwersalny:
//  nie wie, co wyświetla, tylko "opakowuje" dowolną treść.
// =============================================================================

import { useEffect } from 'react'

function Modal({ open, title, onClose, children }) {
  // Efekt uboczny: gdy modal jest otwarty, nasłuchujemy klawisza Escape,
  // żeby dało się go zamknąć z klawiatury (drobiazg, ale to dobry UX).
  useEffect(() => {
    if (!open) return

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)

    // Funkcja zwracana z useEffect to "sprzątanie": React wywoła ją, gdy
    // komponent zniknie lub gdy `open` się zmieni. Usuwamy nasłuchiwacz,
    // żeby nie zostawić "wiszących" listenerów (to częste źródło wycieków).
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    // Warstwa tła (overlay). Kliknięcie w nią zamyka modal.
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Przyciemnione, rozmyte tło. */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Właściwe okno. `stopPropagation` zatrzymuje "kliknięcie" tak, by
          klik W ŚRODKU okna nie zamykał modalu (tylko klik w tło zamyka). */}
      <div
        className="glass relative w-full max-w-md rounded-3xl border border-white/60 p-7
                   shadow-2xl shadow-brand-900/20 animate-rise"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400
                       transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Zamknij"
          >
            ✕
          </button>
        </div>

        {/* Tutaj ląduje to, co przekazaliśmy jako dzieci komponentu. */}
        {children}
      </div>
    </div>
  )
}

export default Modal
