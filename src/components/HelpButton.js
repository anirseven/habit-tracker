// 1. React imports
import { useState, useEffect, useRef } from 'react';

// 2. Style imports
import '../styles/help-button.css';

// 3. Component definition
function HelpButton({
  tooltipText = 'Need help?',
  helpContent,
  onClick,
  position = 'bottom-right',
  className
}) {
  // 4. Hooks
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const helpRef = useRef(null);

  // 5. Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 6. Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  // 7. Event handlers
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (helpContent) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleMouseEnter = () => {
    if (!isExpanded) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // 8. Main render
  return (
    <div
      ref={helpRef}
      className={`help-button-container ${position} ${className || ''}`}
    >
      {/* Help Content Popup */}
      {isExpanded && helpContent && (
        <div className="help-content" role="dialog" aria-label="Help content">
          <div className="help-content-header">
            <h3 className="help-content-title">Help</h3>
            <button
              className="help-content-close"
              onClick={() => setIsExpanded(false)}
              aria-label="Close help"
            >
              ✕
            </button>
          </div>
          <div className="help-content-body">{helpContent}</div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && !isExpanded && (
        <div className="help-tooltip" role="tooltip">
          {tooltipText}
        </div>
      )}

      {/* Help Button */}
      <button
        className={`help-button ${isExpanded ? 'expanded' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={tooltipText}
        aria-expanded={isExpanded}
        type="button"
      >
        <span className="help-icon">?</span>
      </button>
    </div>
  );
}

// 9. Export
export default HelpButton;
