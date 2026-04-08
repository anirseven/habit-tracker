import { useState, useEffect } from "react";
import TextInput from "./TextInput";
import DateSelector from "./DateSelector";
import StatusSelector from "./StatusSelector";
import CategorySelector from "./CategorySelector";

function HabitForm({ onAddHabit, editingHabit, onCancelEdit }) {
  const [habit, setHabit] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [status, setStatus] = useState("To Do");
  const [category, setCategory] = useState("other");

  // Update form when editing
  useEffect(() => {
    if (editingHabit) {
      setHabit(editingHabit.habit);
      setDate(editingHabit.date);
      setStatus(editingHabit.status);
      setCategory(editingHabit.category || "other");
    }
  }, [editingHabit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!habit.trim()) return;

    const habitData = {
      habit,
      date,
      status,
      category,
      id: editingHabit?.id || Date.now(),
    };

    onAddHabit(habitData);

    // Reset form only if not editing
    if (!editingHabit) {
      resetForm();
    }
  };

  const resetForm = () => {
    setHabit("");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus("To Do");
    setCategory("other");
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="habit-form-container">
      <h2 className="form-title">
        {editingHabit ? "✏️ Edit Habit" : "➕ Add New Habit"}
      </h2>
      <form className="habit-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <TextInput
            value={habit}
            onChange={setHabit}
            placeholder="Enter habit (e.g., Morning workout, Read 30 mins)"
            label="Habit"
            required
          />
        </div>
        <div className="form-row form-row-split">
          <DateSelector value={date} onChange={setDate} label="Date" />
          <CategorySelector value={category} onChange={setCategory} label="Category" />
        </div>
        <div className="form-row">
          <StatusSelector value={status} onChange={setStatus} label="Status" />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {editingHabit ? "💾 Save Changes" : "➕ Add Habit"}
          </button>
          {editingHabit && (
            <button type="button" className="cancel-button" onClick={handleCancel}>
              ✖ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default HabitForm;
