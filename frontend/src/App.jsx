// =============================================================================
//  App.jsx  —  GŁÓWNY komponent, który "dyryguje" całą aplikacją
// =============================================================================
//
//  To jest serce frontendu. Tu mieszka cały STAN aplikacji (lista zadań,
//  filtry, edytowane zadanie, powiadomienia) oraz LOGIKA (pobieranie,
//  tworzenie, edycja, usuwanie). Mniejsze komponenty (Header, TaskForm,
//  TaskList…) tylko WYŚWIETLAJĄ dane i ZGŁASZAJĄ zdarzenia w górę, do App.
//
//  Ten wzorzec nazywa się "lifting state up" (wyniesienie stanu w górę):
//  stan trzymamy w jednym, wspólnym miejscu — rodzicu — a dzieci dostają
//  dane przez props i informują rodzica o akcjach przez funkcje (callbacki).
//
//  PRZEPŁYW DANYCH (jednokierunkowy — to fundament Reacta):
//    App (stan) ──props──► komponenty potomne ──callback──► App (zmienia stan)
//                                          └──► React odrysowuje widok
// =============================================================================

import { useState, useEffect, useMemo, useCallback } from 'react'

// Warstwa API — funkcje rozmawiające z backendem.
import * as tasksApi from './api/tasksApi'

// Stałe (statusy) i komponenty UI.
import { STATUS } from './constants/taskStatus'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Modal from './components/Modal'
import Toast from './components/Toast'

function App() {
  // ---------------------------------------------------------------------------
  //  STAN APLIKACJI
  //  Każde wywołanie `useState` tworzy jeden "kawałek" stanu i funkcję do jego
  //  zmiany. Gdy stan się zmienia, React automatycznie odrysowuje to, co od
  //  niego zależy — nie musimy ręcznie dotykać DOM-u.
  // ---------------------------------------------------------------------------
  const [tasks, setTasks] = useState([])        // pełna lista zadań z serwera
  const [loading, setLoading] = useState(true)  // czy trwa pierwsze pobieranie
  const [error, setError] = useState(null)      // komunikat błędu pobierania

  const [query, setQuery] = useState('')        // tekst z wyszukiwarki
  const [filter, setFilter] = useState('ALL')   // aktywny filtr statusu

  const [editingTask, setEditingTask] = useState(null) // zadanie w edycji (lub null)
  const [toast, setToast] = useState(null)             // powiadomienie { message, type }

  // ---------------------------------------------------------------------------
  //  POMOCNIK: pokaż powiadomienie (toast).
  //  `useCallback` "zapamiętuje" funkcję między renderami, żeby nie tworzyć jej
  //  od nowa za każdym razem — to drobna optymalizacja, przydatna gdy funkcję
  //  przekazujemy do useEffect/dzieci.
  // ---------------------------------------------------------------------------
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  // Toast sam znika po 3 sekundach. useEffect uruchamia się, gdy zmieni się
  // `toast`; ustawiamy timer, a w "sprzątaniu" go czyścimy (gdyby pojawił się
  // kolejny toast wcześniej — unikamy nakładających się timerów).
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  // ---------------------------------------------------------------------------
  //  POBIERANIE ZADAŃ z backendu.
  // ---------------------------------------------------------------------------
  //  Uwaga: `setState` wołamy dopiero PO `await`. Dzięki temu (1) linter nie
  //  protestuje o synchroniczny setState w efekcie i (2) odświeżenie listy po
  //  akcji CRUD nie miga szkieletami — `loading` zostaje `false`, bo ustawiamy
  //  je na false tylko w `finally`, a na true nigdy ponownie po starcie.
  const loadTasks = useCallback(async () => {
    try {
      const data = await tasksApi.getTasks()
      setTasks(data ?? [])
      setError(null)
    } catch (err) {
      // Komunikat z warstwy API (np. "Błąd serwera (500)") trafia tutaj.
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Pobierz zadania RAZ, zaraz po pierwszym wyświetleniu aplikacji.
  // `[loadTasks]` w zależnościach = "wykonaj przy montowaniu" (loadTasks jest
  // stabilne dzięki useCallback, więc efekt nie zapętli się).
  //
  // Linijka `eslint-disable` poniżej świadomie wyłącza jedną regułę: pobranie
  // danych z serwera tuż po starcie to PODRĘCZNIKOWE, poprawne użycie useEffect.
  // Reguła ostrzega przed setState w efektach (bo zwykle da się bez nich),
  // ale akurat tutaj jest to uzasadnione — a dobry programista wie, kiedy
  // reguła nie pasuje do przypadku.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks()
  }, [loadTasks])

  // ---------------------------------------------------------------------------
  //  AKCJE CRUD (Create / Read / Update / Delete)
  //  Po każdej zmianie po prostu ponownie pobieramy listę (`loadTasks`).
  //  To najprostsza, niezawodna strategia synchronizacji z serwerem.
  //  (Alternatywą jest "optimistic update" — od razu zmieniamy listę lokalnie;
  //   szybsze wizualnie, ale trudniejsze, bo trzeba cofać zmiany przy błędzie.)
  // ---------------------------------------------------------------------------

  // CREATE — tworzenie nowego zadania (wołane z formularza po lewej).
  const handleCreate = async (values) => {
    try {
      await tasksApi.createTask(values)
      await loadTasks()
      showToast('Zadanie zostało dodane ✨')
    } catch (err) {
      showToast(err.message, 'error')
      throw err // rzucamy dalej, by TaskForm wiedział, że się nie udało
    }
  }

  // UPDATE — zapis zmian z modalu edycji.
  const handleUpdate = async (values) => {
    try {
      await tasksApi.updateTask(editingTask.id, values)
      await loadTasks()
      setEditingTask(null) // zamykamy modal
      showToast('Zmiany zostały zapisane ✅')
    } catch (err) {
      showToast(err.message, 'error')
      throw err
    }
  }

  // DELETE — usuwanie z potwierdzeniem.
  // `window.confirm` to najprostsze, wbudowane okno potwierdzenia. Wystarcza
  // na start; w przyszłości można je podmienić na ładny modal (masz już Modal!).
  const handleDelete = async (task) => {
    const ok = window.confirm(`Usunąć zadanie „${task.title}”?`)
    if (!ok) return
    try {
      await tasksApi.deleteTask(task.id)
      await loadTasks()
      showToast('Zadanie zostało usunięte 🗑️')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // CHANGE STATUS — szybkie przełączenie statusu z karty.
  // Backend (PUT) wymaga kompletnego obiektu, więc wysyłamy całe zadanie
  // z podmienionym tylko statusem.
  const handleChangeStatus = async (task, nextStatus) => {
    try {
      await tasksApi.updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: nextStatus,
      })
      await loadTasks()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // ---------------------------------------------------------------------------
  //  DANE WYLICZANE (derived state) — liczone z `tasks`, NIE trzymane osobno.
  //  Zasada: nie duplikuj stanu. Statystyki i przefiltrowaną listę wyliczamy
  //  na bieżąco. `useMemo` zapamiętuje wynik i przelicza go tylko, gdy zmienią
  //  się jego zależności — żeby nie liczyć tego samego przy każdym renderze.
  // ---------------------------------------------------------------------------

  // Statystyki do kafelków w nagłówku.
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      [STATUS.TODO]: tasks.filter((t) => t.status === STATUS.TODO).length,
      [STATUS.IN_PROGRESS]: tasks.filter((t) => t.status === STATUS.IN_PROGRESS).length,
      [STATUS.DONE]: tasks.filter((t) => t.status === STATUS.DONE).length,
    }
  }, [tasks])

  // Lista po zastosowaniu filtra statusu i wyszukiwarki.
  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tasks
      .filter((task) => filter === 'ALL' || task.status === filter)
      .filter((task) => {
        if (!q) return true // pusta wyszukiwarka = pokaż wszystko
        // Szukamy frazy w tytule LUB w opisie (bez rozróżniania wielkości liter).
        return (
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q)
        )
      })
  }, [tasks, filter, query])

  // Czy aktywne jest jakieś zawężanie? Potrzebne, by pokazać właściwy
  // komunikat w pustym stanie listy.
  const isFiltered = filter !== 'ALL' || query.trim() !== ''

  // ---------------------------------------------------------------------------
  //  WIDOK (JSX). To, co zwraca komponent, React zamienia na elementy na ekranie.
  // ---------------------------------------------------------------------------
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Header stats={stats} />

      {/* Główny układ: na desktopie dwie kolumny (formularz | lista).
          `lg:grid-cols-[380px_1fr]` = stała szerokość formularza + reszta na listę. */}
      <main className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        {/* LEWA KOLUMNA: formularz tworzenia.
            `lg:sticky lg:top-8` sprawia, że formularz "przykleja się" i jest
            widoczny podczas przewijania długiej listy zadań. */}
        <section className="lg:sticky lg:top-8 lg:self-start">
          <div className="glass rounded-3xl border border-white/60 p-6 shadow-xl shadow-brand-900/10 animate-rise">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-lg text-white shadow-lg shadow-brand-500/30">
                ＋
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Nowe zadanie</h2>
                <p className="text-xs text-slate-400">Wypełnij i zapisz</p>
              </div>
            </div>

            {/* TaskForm sam zarządza polami; my dostajemy gotowe dane w onSubmit. */}
            <TaskForm onSubmit={handleCreate} submitLabel="Dodaj zadanie" />
          </div>
        </section>

        {/* PRAWA KOLUMNA: filtry + lista. */}
        <section className="flex flex-col gap-5">
          <FilterBar
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onFilterChange={setFilter}
          />

          <TaskList
            tasks={filteredTasks}
            loading={loading}
            error={error}
            isFiltered={isFiltered}
            onEdit={setEditingTask}        // kliknięcie "Edytuj" otwiera modal
            onDelete={handleDelete}
            onChangeStatus={handleChangeStatus}
          />
        </section>
      </main>

      {/* MODAL EDYCJI. Renderujemy go zawsze, ale jego `open` zależy od tego,
          czy jest jakieś `editingTask`. W środku — ten sam TaskForm, tylko
          z danymi startowymi edytowanego zadania. */}
      <Modal
        open={editingTask !== null}
        title="Edytuj zadanie"
        onClose={() => setEditingTask(null)}
      >
        {/* `key={editingTask?.id}` to ważna sztuczka: zmiana `key` każe Reactowi
            stworzyć formularz OD NOWA, dzięki czemu pola wypełnią się danymi
            właśnie wybranego zadania. */}
        {editingTask && (
          <TaskForm
            key={editingTask.id}
            initialValues={editingTask}
            onSubmit={handleUpdate}
            submitLabel="Zapisz zmiany"
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      {/* POWIADOMIENIA. Zawsze obecny, pokazuje się tylko gdy `toast` != null. */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* STOPKA. */}
      <footer className="mt-16 text-center text-xs text-slate-400">
        Zbudowane z React + Vite + Tailwind CSS · łączy się z Spring Boot API
      </footer>
    </div>
  )
}

export default App
