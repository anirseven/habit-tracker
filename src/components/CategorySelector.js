import { CATEGORIES } from '../constants/categories';

function CategorySelector({ value, onChange, label }) {
  return (
    <div className="form-field">
      {label && <label className="form-label">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input category-select"
      >
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.icon} {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelector;
