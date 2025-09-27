import React from "react";

const ModalError = ({ isOpen, onClose, errorMessage, title, textButton, buttonClass }) => {
  if (!isOpen) return null;

  const buttonClassName = `btn btn-${buttonClass || "danger"}`;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ fontWeight: "bold" }}>
              {title || "Ocurrió un error"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {errorMessage}
            </p>
          </div>
          <div className="modal-footer justify-content-center">
            <button onClick={onClose} className={buttonClassName}>
              {textButton || "Cerrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalError;
