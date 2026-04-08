import { useState } from "react";
import TextInput from "./TextInput";
import DateSelector from "./DateSelector";
import StatusSelector from "./StatusSelector";

function HabitForm({ onAddHabit }) {
  const [habit, setHabit] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [status, setStatus] = useState("To Do");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!habit.trim()) return;
    onAddHabit({
      habit,
      date,
      status,
      id: Date.now(),
    });
    setHabit("");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus("To Do");
  };

  return (
    <div className="habit-form-container">
      <h2 className="form-title">Add New Habit</h2>
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
          <StatusSelector value={status} onChange={setStatus} label="Status" />
        </div>
        <button type="submit" className="submit-button">
          <span>+</span> Add Habit
        </button>
      </form>
    </div>
  );
}

export default HabitForm;
