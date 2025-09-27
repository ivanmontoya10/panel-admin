import React, { useState } from "react";
import Dashboard from "../Dashboard";
import "../../styles/Dashboard.css";
import ModalCreate from "../modals/ModalCreate";
import ModalConfirm from "../modals/ModalConfirm";
import ModalError from "../modals/ModalError";
import TableModal from "../modals/TableModal";
import Spinner from "../layouts/Spinner";

const Paginas = () => {
  // Datos iniciales simulados
  const initialCourses = ["Curso1", "Curso2"];
  const initialPages = {
    Curso1: [{ name: "pagina1.html", path: "#" }],
    Curso2: [],
    Curso3: [],
  };

  const [folders] = useState(initialCourses);
  const [files, setFiles] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newPageName, setNewPageName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentFile, setCurrentFile] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar páginas al seleccionar un curso
  const handleCourseChange = (event) => {
    const course = event.target.value;
    setSelectedCourse(course);
    setFiles(initialPages[course] || []);
  };

  const validateForm = () => {
    if (!selectedCourse || !newFileName || !newPageName) {
      return "Todos los campos son obligatorios.";
    }
    if (newFileName.length < 6 || newFileName.length > 60) {
      return "El nombre del archivo debe tener entre 6 y 60 caracteres.";
    }
    if (newPageName.length < 6 || newPageName.length > 60) {
      return "El nombre de la página debe tener entre 6 y 60 caracteres.";
    }
    if (/\s/.test(newFileName)) {
      return "El nombre del archivo no puede contener espacios.";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(newFileName)) {
    return "El nombre del archivo solo puede contener letras, números, guiones y guion bajo.";
  }
    return null;
  };

  const handleAddPage = () => {
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    const newFile = {
      name: newFileName + ".html",
      path: "#",
    };
    setFiles((prev) => [...prev, newFile]);
    setNewFileName("");
    setNewPageName("");
    setModalOpen(false);
    setLoading(false);
  };

  const handleDeleteClick = (file) => {
    setCurrentFile(file);
    setDeleteModalOpen(true);
  };

  const handleDeleteFile = () => {
    if (!currentFile) return;
    setFiles((prev) => prev.filter((f) => f.name !== currentFile.name));
    setDeleteModalOpen(false);
  };

  const columns = [{ name: "Acciones" }, { name: "Páginas" }];
  const sortedData = files.slice().sort((a, b) => a.name.localeCompare(b.name));

  const renderRow = (file, index) => (
    <>
      <td key={index}>
        <button onClick={() => handleDeleteClick(file)} className="btn btn-danger">
          Eliminar
        </button>
      </td>
      <td>{file.name}</td>
    </>
  );

  return (
    <Dashboard>
      <div className="top-edit-periodo">
        <p className="tittle-page">Páginas</p>
        <div className="btn-add-periodo">
          <button onClick={() => setModalOpen(true)}>Crear páginas</button>
        </div>
      </div>

      <div className="content-dash">
        <div className="text-info">
          <p>
            En esta sección podrás crear una página en la que se mostrará una
            galería de imágenes del curso deseado. Para ello, se recomienda
            seguir las siguientes instrucciones para su correcto funcionamiento.
          </p>
          <ul>
            <li>
              Como primer paso, deberás seleccionar la ruta en donde se creará
              la página (en el directorio "/galeria/").
            </li>
            <li>
              Posteriormente, selecciona la ruta en donde se encuentran las
              imágenes que estarán en la página de la galería (a través del
              directorio "/img/fotos/").
            </li>
            <li>
              En el nombre del archivo no es necesario ingresar el punto (.) y
              la nomenclatura del archivo (html). Únicamente ingresa texto.
              Tampoco puede incluir espacios ni caracteres especiales.
            </li>
            <li>
              En el nombre de la página no se podrán ingresar carteres
              especiales: ($, @, !, %, etc).
            </li>
            <li>
              Tanto para el nombre del archivo como para el titulo de la página
              el minimo será de 6, mientras que el máximo será de 60.
            </li>
            <li>
              <b>
                UNA VEZ ELIMINADAS LAS PÁGINAS SERÁ TOTALMENTE IMPOSIBLE
                RECUPERARLAS.
              </b>
            </li>
          </ul>
        </div>
        <div className="selector-periodo">
          <select value={selectedCourse} onChange={handleCourseChange}>
            <option value="">Selecciona un curso</option>
            {folders.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse ? (
          files.length > 0 ? (
            <TableModal columns={columns} data={sortedData} renderRow={renderRow} />
          ) : (
            <p className="please">No hay páginas en el curso seleccionado.</p>
          )
        ) : (
          <p className="please">Por favor, seleccione un curso para ver sus páginas.</p>
        )}

        <ModalCreate
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Crear página"
          onConfirm={handleAddPage}
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
            <>
              <div className="mb-3">
                <label>Selecciona el curso:</label>
                <select value={selectedCourse} onChange={handleCourseChange}>
                  <option value="">Selecciona un curso</option>
                  {folders.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label>Nombre del archivo:</label>
                <input
                  type="text"
                  value={newFileName}
                  placeholder="Ej. galeria-julio-2024"
                  onChange={(e) => setNewFileName(e.target.value.replace(/\s+/g, ""))}
                />
              </div>
              <div className="mb-3">
                <label>Nombre de la página:</label>
                <input
                  type="text"
                  value={newPageName}
                  placeholder="Ej. Galería de imágenes Julio 2024"
                  onChange={(e) => setNewPageName(e.target.value)}
                />
              </div>
            </>
          )}
        </ModalCreate>

        <ModalConfirm
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteFile}
          title="Eliminar página"
          message={`¿Deseas eliminar la página ${currentFile ? currentFile.name : "desconocida"}?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />

        <ModalError
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          errorMessage={errorMessage}
        />
      </div>
    </Dashboard>
  );
};

export default Paginas;
