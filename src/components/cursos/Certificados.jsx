import React, { useState } from "react";
import Dashboard from "../Dashboard";
import "../../styles/Dashboard.css";
import ModalCreate from "../modals/ModalCreate";
import ModalConfirm from "../modals/ModalConfirm";
import ModalError from "../modals/ModalError";
import TableModal from "../modals/TableModal";
import Spinner from "../layouts/Spinner";

const Certificados = () => {
  // Datos simulados
  const initialFolders = [
    { name: "Curso1/julio-2024", files: [{ name: "constancia1.pdf" }] },
    { name: "Curso2/enero-2024", files: [] },
  ];

  const [folders] = useState(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // ----- VALIDACIONES -----
  const validateFiles = (files) => {
    if (files.length > 10) return "Solo puedes seleccionar hasta 10 archivos.";
    for (let file of files) {
      if (file.type !== "application/pdf") return "Solo se permiten archivos PDF.";
      if (file.name.length < 6 || file.name.length > 30)
        return "El nombre del archivo debe tener entre 6 y 30 caracteres.";
      if (/\s/.test(file.name)) return "El nombre del archivo no puede tener espacios.";
      if (/[^a-zA-Z0-9\-_\.]/.test(file.name))
        return "El nombre solo puede tener letras, números, guión medio (-), guión bajo (_) y punto.";
    }
    return null;
  };

  // ----- FUNCIONES -----
  const handleFolderChange = (e) => {
    const folderName = e.target.value;
    setSelectedFolder(folderName);
    const folder = folders.find((f) => f.name === folderName);
    setFiles(folder ? folder.files : []);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const error = validateFiles(files);
    if (error) {
      setErrorMessage(error);
      setErrorModalOpen(true);
      setModalOpen(false);
      return;
    }
    setSelectedFiles(files);
  };

  const handleAddPDF = () => {
    if (!selectedFolder) {
      setErrorMessage("Por favor selecciona un folder.");
      setErrorModalOpen(true);
      return;
    }

    const error = validateFiles(selectedFiles);
    if (error) {
      setErrorMessage(error);
      setErrorModalOpen(true);
      return;
    }

    setLoading(true);

    // Simular agregar archivos
    const newFiles = selectedFiles.map((file) => ({
      name: file.name,
      path: URL.createObjectURL(file), // Solo front
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setSelectedFiles([]);
    setModalOpen(false);
    setLoading(false);
  };

  const openDeleteModal = (file) => {
    setSelectedFile(file);
    setDeleteModalOpen(true);
  };

  const handleDeleteFile = () => {
    setLoadingDelete(true);
    setFiles((prev) => prev.filter((f) => f.name !== selectedFile.name));
    setDeleteModalOpen(false);
    setLoadingDelete(false);
  };

  const columns = [{ name: "Acciones" }, { name: "Constancias" }];
  const sortedData = files.slice().sort((a, b) => a.name.localeCompare(b.name));

  const renderRow = (file, index) => (
    <>
      <td key={index}>
        <button onClick={() => openDeleteModal(file)} className="btn btn-danger">
          Eliminar
        </button>
      </td>
      <td>
        <a href={file.path} target="_blank" rel="noopener noreferrer">
          {file.name}
        </a>
      </td>
    </>
  );

  return (
    <Dashboard>
      <div className="top-edit-periodo">
        <p className="tittle-page">Constancias</p>
        <div className="btn-add-periodo">
          <button onClick={() => setModalOpen(true)}>Agregar constancias</button>
        </div>
      </div>
      <div className="content-dash">
        <div className="text-info">
          <p>Requisitos/consideraciones para subir constancias:</p>
          <ul>
            <li>Máximo 10 archivos a la vez.</li>
            <li>Solo archivos en formato PDF.</li>
            <li>Nombre entre 6 y 30 caracteres, sin espacios.</li>
            <li>NO se pueden mover constancias entre cursos o periodos.</li>
            <li>Una vez eliminada, no se puede recuperar.</li>
          </ul>
        </div>

        <div className="selector">
          <select value={selectedFolder} onChange={handleFolderChange}>
            <option value="">Selecciona el curso/periodo</option>
            {folders.map((f, i) => (
              <option key={i} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {selectedFolder ? (
          <TableModal columns={columns} data={sortedData} renderRow={renderRow} />
        ) : (
          <p className="please">Selecciona un curso/periodo para ver las constancias.</p>
        )}

        {/* MODALS */}
        <ModalCreate
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Agregar constancias"
          onConfirm={handleAddPDF}
          confirmText="Agregar"
          cancelText="Cancelar"
          confirmDisabled={loading}
        >
          {loading && (
            <div className="spinner-overlay">
              <Spinner />
            </div>
          )}
          {!loading && (
            <div className="mb-3">
              <label htmlFor="pdf-files">Selecciona las constancias:</label>
              <input
                id="pdf-files"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
              />
            </div>
          )}
        </ModalCreate>

        <ModalConfirm
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Eliminar constancia"
          message={`¿Estás seguro de eliminar ${selectedFile?.name}?`}
          onConfirm={handleDeleteFile}
          confirmText="Eliminar"
          cancelText="Cancelar"
        >
          {loadingDelete && (
            <div className="spinner-overlay">
              <Spinner />
            </div>
          )}
        </ModalConfirm>

        <ModalError
          isOpen={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          errorMessage={errorMessage}
        />
      </div>
    </Dashboard>
  );
};

export default Certificados;