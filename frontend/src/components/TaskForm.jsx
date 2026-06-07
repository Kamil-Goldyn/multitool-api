// =============================================================================
//  TaskForm.jsx  —  formularz do TWORZENIA i EDYCJI zadania
// =============================================================================
//
//  Jeden formularz, dwa zastosowania. Tworzenie i edycja różnią się tylko
//  danymi początkowymi i etykietą przycisku, więc nie ma sensu pisać tego
//  dwa razy (zasada DRY — Don't Repeat Yourself).
//
//  PROPS:
//    - initialValues: { title, description, status } — wartości startowe pól
//    - onSubmit:      async (values) => {}  — co zrobić po zatwierdzeniu
//    - submitLabel:   tekst na przycisku zatwierdzania
//    - onCancel:      (opcjonalnie) funkcja "Anuluj"; gdy podana, pokazujemy przycisk
//
//  KLUCZOWY KONCEPT: "controlled components" (komponenty kontrolowane).
//  Wartość każdego <input> trzymamy w stanie Reacta (useState). React jest
//  "jedynym źródłem prawdy" — pole pokazuje to, co jest w stanie, a każda
//  zmiana w polu aktualizuje stan. Dzięki temu mamy pełną kontrolę nad danymi.
// =============================================================================

import { useState } from 'react'
import { STATUS, STATUS_ORDER, STATUS_META } from '../constants/taskStatus'

// Wspólny zestaw klas dla pól formularza — wydzielony, by się nie powtarzać.
const inputClasses =
  'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm ' +
  'text-slate-800 shadow-sm transition placeholder:text-slate-400 ' +
  'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100'

function TaskForm({ initialValues, onSubmit, submitLabel = 'Zapisz', onCancel }) {
  // Lokalny stan formularza. `?.` i `??` dają bezpieczne wartości domyślne,
  // gdyby `initialValues` było puste (np. przy tworzeniu nowego zadania).
  const [values, setValues] = useState({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    status: initialValues?.status ?? STATUS.TODO,
  })

  // `submitting` blokuje przycisk w trakcie wysyłania, żeby użytkownik nie
  // kliknął dwa razy i nie utworzył dwóch takich samych zadań.
  const [submitting, setSubmitting] = useState(false)

  // Jedna funkcja obsługuje zmianę KAŻDEGO pola. Sztuczka: czytamy `name`
  // z atrybutu pola (np. name="title") i używamy go jako klucza w obiekcie.
  // `[name]: value` to "computed property name" — dynamiczny klucz obiektu.
  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  // Obsługa wysłania formularza.
  const handleSubmit = async (event) => {
    event.preventDefault() // blokujemy domyślne przeładowanie strony przez przeglądarkę
    setSubmitting(true)
    try {
      // `onSubmit` pochodzi z rodzica (App). To on wie, czy tworzyć, czy edytować.
      // `.trim()` usuwa zbędne spacje z początku/końca tytułu.
      await onSubmit({ ...values, title: values.title.trim() })
    } finally {
      // `finally` wykona się zawsze — czy się udało, czy poleciał błąd —
      // więc przycisk na pewno się odblokuje.
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* --- POLE: Tytuł --- */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Tytuł <span className="font-normal text-slate-400">(min. 3 znaki)</span>
        </label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={100}
          placeholder="np. Przygotować prezentację"
          className={inputClasses}
        />
      </div>

      {/* --- POLE: Opis --- */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Opis
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Krótko opisz, na czym polega zadanie…"
          className={`${inputClasses} resize-y min-h-[96px]`}
        />
      </div>

      {/* --- POLE: Status (przyciski zamiast nudnego <select>) --- */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {/* Iterujemy po statusach i robimy z każdego klikalny przycisk.
              `key` jest wymagany przez Reacta przy renderowaniu list —
              pozwala mu śledzić, który element jest który. */}
          {STATUS_ORDER.map((statusValue) => {
            const meta = STATUS_META[statusValue]
            const active = values.status === statusValue
            return (
              <button
                key={statusValue}
                type="button" // WAŻNE: nie "submit", inaczej kliknięcie wysłałoby formularz
                onClick={() => setValues((prev) => ({ ...prev, status: statusValue }))}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5
                            text-xs font-semibold transition ${
                              active
                                ? 'border-brand-300 bg-brand-50 text-brand-700 ring-2 ring-brand-200'
                                : 'border-slate-200 bg-white/60 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                            }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* --- PRZYCISKI AKCJI --- */}
      <div className="mt-1 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3
                     text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition
                     hover:from-brand-700 hover:to-brand-600 hover:shadow-brand-500/40
                     active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Zapisywanie…' : submitLabel}
        </button>

        {/* Przycisk "Anuluj" pokazujemy tylko, gdy rodzic przekazał `onCancel`
            (czyli w trybie edycji). To przykład warunkowego renderowania. */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm
                       font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Anuluj
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
