import { useState } from "react";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import SummaryCards from "../components/SummaryCards";
import { CATEGORIES } from "../constants/categories";

function Home({ habits, onAddHabit, onUpdateHabit, onDeleteHabit }) {
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      onUpdateHabit(habitData);
      setEditingHabit(null);
    } else {
      onAddHabit(habitData);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingHabit(null);
  };

  return (
    <div>
      <HabitForm
        onAddHabit={handleSaveHabit}
        editingHabit={editingHabit}
        onCancelEdit={handleCancelEdit}
      />

      <SummaryCards habits={habits} />

      {/* Category Filter */}
      <div className="category-filter">
        <label className="filter-label">Filter by Category:</label>
        <div className="category-buttons">
          <button
            className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            🌐 All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                backgroundColor: selectedCategory === cat.id ? cat.color + '20' : 'transparent',
                borderColor: selectedCategory === cat.id ? cat.color : 'var(--border-color)'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <HabitList
        habits={habits}
        onEdit={handleEdit}
        onDelete={onDeleteHabit}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}

export default Home;
