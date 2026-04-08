import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles/habit.css";
import "./styles/trends.css";
import ThemeToggle from "./components/ThemeToggle";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Trends from "./pages/Trends";
import useTheme from "./hooks/useTheme";

const HABITS_STORAGE_KEY = "habit-tracker-habits";

function App() {
  const { theme, toggleTheme } = useTheme();

  // Load habits from localStorage on mount
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const handleAddHabit = (habitEntry) => {
    setHabits((prev) => [habitEntry, ...prev]);
  };

  const handleUpdateHabit = (updatedHabit) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
    );
  };

  const handleDeleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <h1>Habit Tracker</h1>
            <Navigation />
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  habits={habits}
                  onAddHabit={handleAddHabit}
                  onUpdateHabit={handleUpdateHabit}
                  onDeleteHabit={handleDeleteHabit}
                />
              }
            />
            <Route path="/trends" element={<Trends habits={habits} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
