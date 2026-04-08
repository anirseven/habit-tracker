function DateSelector({ value, onChange, label }) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input date-input"
      />
    </div>
  );
}

export default DateSelector;
