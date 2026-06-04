import { useState, useEffect } from 'react'

function App() {
  // Stan do przechowywania danych z formularza
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'TODO'
  })

  // Stan do przechowywania listy zadań pobranych z backendu
  const [taskList, setTaskList] = useState([])
  const [message, setMessage] = useState('')

  // Funkcja pobierająca zadania z backendu (GET /api/tasks)
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTaskList(data); // Zapisujemy pobraną tablicę do stanu
      }
    } catch (error) {
      console.error("Blad pobierania zadan:", error);
    }
  }

  // useEffect uruchamia funkcję fetchTasks dokładnie jeden raz, zaraz po wczytaniu strony
  useEffect(() => {
    fetchTasks();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        setMessage('Zadanie dodane pomyslnie!');
        setTask({ title: '', description: '', status: 'TODO' }); // Reset formularza
        fetchTasks(); // Ponownie pobieramy zadania, aby lista na stronie od razu sie zaktualizowala
      } else {
        setMessage('Blad walidacji danych po stronie backendu.');
      }
    } catch (error) {
      setMessage('Blad polaczenia z serwerem.');
    }
  }

  return (
    // Kontener główny ze stylami Tailwind: maksymalna szerokość, wyśrodkowanie, odstępy
    <div className="max-w-6xl mx-auto my-10 p-5 font-sans">
      
      {/* Układ dwukolumnowy na większych ekranach (md:grid-cols-2), odstęp między kolumnami (gap-10) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* KOLUMNA 1: Formularz */}
        <div className="bg-purple-50 p-6 rounded-xl shadow-md border border-gray-100 h-fit">
          <h2 className="text-2xl font-bold mb-5 text-blue-800">Dodaj nowe zadanie</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tytuł (min. 3 znaki):</label>
              <input 
                type="text" 
                name="title" 
                value={task.title} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opis:</label>
              <textarea 
                name="description" 
                value={task.description} 
                onChange={handleChange} 
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
              <select 
                name="status" 
                value={task.status} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODO">DO ZROBIENIA</option>
                <option value="IN_PROGRESS">W TRAKCIE</option>
                <option value="DONE">ZAKOŃCZONE</option>
              </select>
            </div>

            <button type="submit" className="w-full mt-2 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Zapisz zadanie
            </button>
          </form>

          {message && <p className="mt-4 text-sm font-medium text-blue-600 bg-blue-50 p-3 rounded-lg text-center">{message}</p>}
        </div>

        {/* KOLUMNA 2: Lista zadań */}
        <div>
          <h2 className="text-2xl font-bold mb-5 text-gray-800">Lista istniejących zadań</h2>
          
          {taskList.length === 0 ? (
            <p className="text-gray-500 italic text-center p-10 border-2 border-dashed border-gray-200 rounded-xl">Brak zadan w bazie danych.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Mapujemy tablicę zadań na elementy HTML */}
              {taskList.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full 
                      ${item.status === 'DONE' ? 'bg-green-100 text-green-800' : 
                        item.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="text-xs text-gray-400">
                    ID: {item.id} | Utworzono: {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App
