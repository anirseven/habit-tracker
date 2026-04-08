const STATUS_OPTIONS = [
  { value: "Completed", label: "✓ Completed", color: "#4caf50" },
  { value: "To Do", label: "○ To Do", color: "#ff9800" },
  { value: "Not Completed", label: "✗ Not Completed", color: "#f44336" },
  { value: "Skipped", label: "⊘ Skipped", color: "#9e9e9e" },
];

function StatusSelector({ value, onChange, label }) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input status-select"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StatusSelector;
export { STATUS_OPTIONS };
