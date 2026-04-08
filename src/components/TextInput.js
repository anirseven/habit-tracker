function TextInput({ value, onChange, placeholder, label, required = false }) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="form-input text-input"
      />
    </div>
  );
}

export default TextInput;
