import React from 'react';

const ModalCreate = ({ isOpen, onClose, title, children, onConfirm, confirmText, cancelText, grande }) => {
  if (!isOpen) return null;

  const typemodal = `modal-dialog modal-dialog-centered ${grande || ""}`;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className={typemodal}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {children}
          </div>

          <div className="modal-footer justify-content-center">
            <button onClick={onConfirm} className="btn btn-success">
              {confirmText || 'Confirmar'}
            </button>
            <button onClick={onClose} className="btn btn-danger">
              {cancelText || 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreate;
