import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ModalConfirm = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, btnRed, btnPrimary }) => {
  
  if (!isOpen) return null;

  const btnChangeGreen= `btn btn-${btnRed || "success"}`
  const btnChangeRed= `btn btn-${btnPrimary || "danger"}`

  return (
    <div className="modal fade show d-block" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{color:"black", fontWeight:"bold"}}>{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p style={{color:"black", fontWeight:"bold"}}>{message}</p>
          </div>
          <div className="modal-footer justify-content-center">
            <button onClick={onConfirm} className={btnChangeGreen}>
              {confirmText || 'Confirmar'}
            </button>
            <button onClick={onClose} className={btnChangeRed}>
              {cancelText || 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
