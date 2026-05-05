// 1. React imports
import { useEffect } from 'react';

// 2. Style imports
import '../styles/modal.css';

// 3. Component definition
function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true
}) {
  // 4. Effect for keyboard handling and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Handle Escape key
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  // 5. Event handlers
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleCloseClick = () => {
    onClose?.();
  };

  // 6. Early return if modal is not open
  if (!isOpen) {
    return null;
  }

  // 7. Main render
  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-content ${className || ''}`} role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          {showCloseButton && (
            <button
              className="modal-close-button"
              onClick={handleCloseClick}
              aria-label="Close modal"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

// 8. Export
export default Modal;
