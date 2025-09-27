import React, { useState } from "react";
import Dashboard from "../Dashboard";
import "../../styles/Dashboard.css";
import ModalCreate from "../modals/ModalCreate";
import ModalError from "../modals/ModalError";
import ModalConfirm from "../modals/ModalConfirm";
import TableModal from "../modals/TableModal";

const CarpetImgs = () => {
  // Datos simulados
  const initialFolders = ["CursoImg1", "CursoImg2"];
  const initialSubfolders = {
    CursoImg1: ["julio-2024", "agosto-2024"],
    CursoImg2: ["enero-2024"],
  };

  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [subfolders, setSubfolders] = useState([]);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderInput, setNewFolderInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showCursoModal, setShowCursoModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ----- VALIDACIONES -----
  const validateSubfolder = (name) => {
    if (!name) return "El nombre del periodo es obligatorio.";
    if (name.length < 6 || name.length > 25)
      return "El nombre del periodo debe tener entre 6 y 25 caracteres.";
    if (/\s/.test(name)) return "El nombre del periodo no puede contener espacios.";
    if (/[^a-zA-Z0-9\-_]/.test(name))
      return "Solo se permiten letras, números, guión medio (-) y guión bajo (_).";
    if (subfolders.includes(name)) return "Ya existe un periodo con ese nombre.";
    return null;
  };

  const validateFolder = (name) => {
    if (!name) return "El nombre del curso es obligatorio.";
    if (name.length < 6 || name.length > 25)
      return "El nombre del curso debe tener entre 6 y 25 caracteres.";
    if (/\s/.test(name)) return "El nombre del curso no puede contener espacios.";
    if (/[^a-zA-Z0-9\-_]/.test(name))
      return "Solo se permiten letras, números, guión medio (-) y guión bajo (_).";
    if (folders.includes(name)) return "Ya existe un curso con ese nombre.";
    return null;
  };

  // ----- FUNCIONES -----
  const handleFolderChange = (event) => {
    const folder = event.target.value;
    setSelectedFolder(folder);
    setSubfolders(initialSubfolders[folder] || []);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setNewFolderName("");
    setNewFolderInput("");
    setEditingFolder(null);
    setErrorModalOpen(false);
    setShowCursoModal(false);
    setShowConfirmModal(false);
  };

  const handleAddFolder = () => {
    const error = validateSubfolder(newFolderInput);
    if (error) {
      setErrorMessage(error);
      setErrorModalOpen(true);
      return;
    }
    setSubfolders([...subfolders, newFolderInput]);
    closeModal();
  };

  const handleEdit = (subfolder) => {
    setEditingFolder(subfolder);
    setNewFolderName(subfolder);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    const error = validateSubfolder(newFolderName);
    if (error) {
      setErrorMessage(error);
      setErrorModalOpen(true);
      return;
    }
    setSubfolders(
      subfolders.map((sf) => (sf === editingFolder ? newFolderName : sf))
    );
    closeModal();
  };

  const handleDelete = (subfolder) => {
    setEditingFolder(subfolder);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setSubfolders(subfolders.filter((sf) => sf !== editingFolder));
    closeModal();
  };

  const handleAddCurso = () => {
    const error = validateFolder(newFolderInput);
    if (error) {
      setErrorMessage(error);
      setErrorModalOpen(true);
      return;
    }
    setFolders([...folders, newFolderInput]);
    initialSubfolders[newFolderInput] = [];
    closeModal();
  };

  const columns = [{ name: "Acciones" }, { name: "Periodo" }];
  const sortedData = subfolders.slice().sort((a, b) => a.localeCompare(b));

  const renderRow = (subfolder, index) => (
    <>
      <td key={index}>
        <button onClick={() => handleEdit(subfolder)} className="btn btn-success me-2">
          Editar
        </button>
        <button onClick={() => handleDelete(subfolder)} className="btn btn-danger">
          Eliminar
        </button>
      </td>
      <td>{subfolder}</td>
    </>
  );

  return (
    <Dashboard>
      <div className="top-edit-periodo">
        <p className="tittle-page">Carpeta de imágenes</p>
        <div className="btn-add-periodo">
          <button onClick={() => setModalOpen(true)}>Agregar periodo de imágenes</button>
        </div>
      </div>
      <div className="content-dash">
        <div className="text-info">
          <p>
            En esta sección, se podrán visualizar, eliminar y cambiar el nombre a
            las carpetas de imágenes existentes. Reglas importantes:
          </p>
          <ul>
            <li>El nombre de la carpeta no puede repetirse.</li>
            <li>No se pueden ingresar espacios.</li>
            <li>Longitud entre 6 y 25 caracteres.</li>
            <li>Solo caracteres alfanuméricos, guión medio (-) y guión bajo (_).</li>
            <li>
              <b>Si se elimina una carpeta, no podrá recuperarse.</b>
            </li>
          </ul>
        </div>

        <div className="content-img-pages">
          <div className="selector-periodo">
            <select value={selectedFolder} onChange={handleFolderChange}>
              <option value="">Selecciona un curso</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>
          <div className="btn-img">
            <button onClick={() => setShowCursoModal(true)}>Agregar curso de imágenes</button>
          </div>
        </div>

        {selectedFolder ? (
          subfolders.length > 0 ? (
            <TableModal columns={columns} data={sortedData} renderRow={renderRow} />
          ) : (
            <p className="please">No hay periodos en el curso seleccionado.</p>
          )
        ) : (
          <p className="please">Por favor, seleccione un curso para ver sus periodos.</p>
        )}

        {/* MODALES */}
        <ModalCreate
          isOpen={modalOpen}
          onClose={closeModal}
          title="Agregar un periodo"
          onConfirm={handleAddFolder}
          confirmText="Agregar"
          cancelText="Cancelar"
        >
          <div className="mb-3">
            <label>Periodo:</label>
            <input
              type="text"
              value={newFolderInput}
              placeholder="Ej. julio-2024"
              onChange={(e) => setNewFolderInput(e.target.value.replace(/\s+/g, ""))}
              minLength={6}
              maxLength={25}
              autoFocus
            />
          </div>
        </ModalCreate>

        <ModalCreate
          isOpen={editModalOpen}
          onClose={closeModal}
          title="Editar periodo"
          onConfirm={handleSaveEdit}
          confirmText="Actualizar"
          cancelText="Cancelar"
        >
          <div className="mb-3">
            <label>Nuevo nombre:</label>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value.replace(/\s+/g, ""))}
              minLength={6}
              maxLength={25}
              autoFocus
            />
          </div>
        </ModalCreate>

        <ModalConfirm
          isOpen={deleteModalOpen}
          onClose={closeModal}
          title="Eliminar periodo"
          message={`¿Deseas eliminar el periodo ${editingFolder}?`}
          onConfirm={handleConfirmDelete}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />

        <ModalCreate
          isOpen={showCursoModal}
          onClose={closeModal}
          title="Agregar un curso"
          onConfirm={handleAddCurso}
          confirmText="Agregar"
          cancelText="Cancelar"
        >
          <div className="mb-3">
            <label>Nombre del curso:</label>
            <input
              type="text"
              value={newFolderInput}
              onChange={(e) => setNewFolderInput(e.target.value.replace(/\s+/g, ""))}
              minLength={6}
              maxLength={25}
              autoFocus
            />
          </div>
        </ModalCreate>

        <ModalError
          isOpen={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          errorMessage={errorMessage}
        />
      </div>
    </Dashboard>
  );
};

export default CarpetImgs;
