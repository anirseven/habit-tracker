import '../styles/progress-bar.css';

function ProgressBar({ value = 0, max = 100, label, showPercent = true, className }) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className={`progress-bar-wrapper ${className || ''}`}>
      {(label || showPercent) && (
        <div className="progress-bar-header">
          {label && <span className="progress-bar-label">{label}</span>}
          {showPercent && <span className="progress-bar-percent">{percent}%</span>}
        </div>
      )}
      <div className="progress-bar-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
