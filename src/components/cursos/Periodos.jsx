import React, { useState } from "react";
import Dashboard from "../Dashboard";
import "../../styles/Dashboard.css";
import ModalCreate from "../modals/ModalCreate";
import ModalError from "../modals/ModalError";
import ModalConfirm from "../modals/ModalConfirm";
import TableModal from "../modals/TableModal";
import Spinner from "../layouts/Spinner";

const Periodos = () => {
  // Datos iniciales simulados
  const initialFolders = ["Curso1", "Curso2", "Curso3"];
  const initialSubfolders = {
    Curso1: ["julio-2024", "agosto-2024"],
    Curso2: ["enero-2024"],
    Curso3: [],
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
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  // ----- VALIDACIONES -----
  const validateSubfolder = (name) => {
    if (!name) return "El nombre del periodo es obligatorio.";
    if (name.length < 6 || name.length > 25)
      return "El nombre del periodo debe tener entre 6 y 25 caracteres.";
    if (/\s/.test(name))
      return "El nombre del periodo no puede contener espacios.";
    if (/[^a-zA-Z0-9\-_]/.test(name))
      return "Solo se permiten letras, números, guión medio (-) y guión bajo (_).";
    if (subfolders.includes(name))
      return "Ya existe un periodo con ese nombre.";
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
        <button
          onClick={() => handleEdit(subfolder)}
          className="btn btn-success me-2"
        >
          Editar
        </button>
        <button
          onClick={() => handleDelete(subfolder)}
          className="btn btn-danger"
        >
          Eliminar
        </button>
      </td>
      <td>{subfolder}</td>
    </>
  );

  return (
    <Dashboard>
      <div className="top-edit-periodo">
        <p className="tittle-page">Periodos de cursos</p>
        <div className="btn-add-periodo">
          <button onClick={() => setModalOpen(true)}>Agregar periodo</button>
        </div>
      </div>
      <div className="content-dash">
                <div className="text-info">
          <p>
            En esta sección, se podrán agregar, eliminar y cambiar el nombre a
            los periodos de cada curso existente. Es muy importante estar
            consciente de los siguientes puntos:
          </p>
          <ul>
            <li>El nombre del periodo no puede ser repetido.</li>
            <li>No se pueden ingresar espacios.</li>
            <li>
              El nombre del periodo debe cumplir con una longitud mínima de 6
              caracteres y máximo de 25 caracteres.
            </li>
            <li>
              El nombre del periodo no puede contener caracteres especiales a
              excepción del guión medio y bajo ( - y _ ).
            </li>
            <li>
              <b>UNA VEZ ELIMINADO EL PERIODO NO PODRÁ SER RECUPERADO.</b>
            </li>
            <li>
              <b>
                EL PERIODO NO PODRÁ SER CAMBIADO A OTRO CURSO, PARA ELLO, DEBERÁ
                SER ELIMINADO Y VOLVERSE A CREAR.
              </b>
            </li>
            <li>
              <b>
                SI DESEA AGREGAR UN NUEVO CURSO, FAVOR DE COMUNICARSE CON EL
                DESARROLLADOR DEL SITIO.
              </b>
            </li>
          </ul>
        </div>
        <div className="content-img-pages">
          <div className="selector-periodo">
            <select
              id="folder-select"
              value={selectedFolder}
              onChange={handleFolderChange}
            >
              <option value="">Selecciona un curso</option>
              {folders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>
          <div className="btn-img">
            <button onClick={() => setShowCursoModal(true)}>Agregar curso</button>
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

        {/* MODALS */}
        <ModalCreate
          isOpen={modalOpen}
          onClose={closeModal}
          title="Agregar un periodo"
          onConfirm={handleAddFolder}
          confirmText="Agregar"
          cancelText="Cancelar"
        >
          <div className="mb-3">
            <label htmlFor="name-folder">Periodo:</label>
            <input
              id="name-folder"
              type="text"
              value={newFolderInput}
              placeholder="Ej. julio-2024"
              onChange={(e) =>
                setNewFolderInput(e.target.value.replace(/\s+/g, ""))
              }
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
            <label htmlFor="new-name-folder">Ingresa un nuevo nombre:</label>
            <input
              id="new-name-folder"
              type="text"
              value={newFolderName}
              onChange={(e) =>
                setNewFolderName(e.target.value.replace(/\s+/g, ""))
              }
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
          message={`¿Estás seguro de que deseas eliminar el periodo ${editingFolder}?`}
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
            <label htmlFor="new-course-name">Nombre del curso:</label>
            <input
              id="new-course-name"
              type="text"
              value={newFolderInput}
              placeholder="Ej. marinados"
              onChange={(e) =>
                setNewFolderInput(e.target.value.replace(/\s+/g, ""))
              }
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

export default Periodos;
