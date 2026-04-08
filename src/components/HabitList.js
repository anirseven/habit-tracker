import { getCategoryById } from '../constants/categories';

function HabitList({ habits, onEdit, onDelete, selectedCategory }) {
  const formatDateHeader = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const habitDate = new Date(dateString + 'T00:00:00');
    habitDate.setHours(0, 0, 0, 0);

    if (habitDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (habitDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Completed": "✓",
      "To Do": "○",
      "Not Completed": "✗",
      "Skipped": "⊘"
    };
    return icons[status] || "○";
  };

  const groupHabitsByDate = (habits) => {
    // Filter by category if selected
    let filteredHabits = habits;
    if (selectedCategory && selectedCategory !== 'all') {
      filteredHabits = habits.filter(h => h.category === selectedCategory);
    }

    const grouped = {};
    filteredHabits.forEach((habit) => {
      if (!grouped[habit.date]) {
        grouped[habit.date] = [];
      }
      grouped[habit.date].push(habit);
    });

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      return new Date(b) - new Date(a);
    });

    return sortedDates.map(date => ({
      date,
      habits: grouped[date]
    }));
  };

  const handleDelete = (habit) => {
    if (window.confirm(`Delete "${habit.habit}"?`)) {
      onDelete(habit.id);
    }
  };

  if (habits.length === 0) {
    return (
      <div className="habit-list-empty">
        <div className="empty-icon">📝</div>
        <p>No habits tracked yet</p>
        <span>Add your first habit to get started!</span>
      </div>
    );
  }

  const groupedHabits = groupHabitsByDate(habits);

  return (
    <div className="habit-list-container">
      <h2 className="list-title">Your Habits</h2>
      {groupedHabits.map(({ date, habits: dateHabits }) => (
        <div key={date} className="habit-date-group">
          <div className="date-header">
            <h3 className="date-title">{formatDateHeader(date)}</h3>
            <span className="habit-count">{dateHabits.length} {dateHabits.length === 1 ? 'habit' : 'habits'}</span>
          </div>
          <div className="habit-list">
            {dateHabits.map((h) => {
              const category = getCategoryById(h.category || 'other');
              return (
                <div key={h.id} className="habit-card">
                  <div className="habit-card-header">
                    <div className="habit-info">
                      <h3 className="habit-name">{h.habit}</h3>
                      <span
                        className="category-badge"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        {category.icon} {category.name}
                      </span>
                    </div>
                    <span
                      className={`habit-status status-${h.status.replace(/\s+/g, "").toLowerCase()}`}
                    >
                      {getStatusIcon(h.status)} {h.status}
                    </span>
                  </div>
                  <div className="habit-card-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(h)}
                      title="Edit habit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(h)}
                      title="Delete habit"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HabitList;
