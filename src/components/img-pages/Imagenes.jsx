import React, { useState } from "react";
import Dashboard from "../Dashboard";
import "../../styles/Dashboard.css";
import ModalCreate from "../modals/ModalCreate";
import ModalConfirm from "../modals/ModalConfirm";
import ModalError from "../modals/ModalError";
import TableModal from "../modals/TableModal";
import Spinner from "../layouts/Spinner";

const Imagenes = () => {
  // Carpetas iniciales con archivos por defecto
  const initialFolders = [
    { name: "Curso1/julio-2024", files: [{ name: "constancia1.png", data: "https://picsum.photos/200" }] },
    { name: "Curso2/enero-2024", files: [] },
  ];

  const [folders, setFolders] = useState(initialFolders);
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

  // Validaciones
  const validateFiles = (files) => {
    if (files.length > 10) return "Solo puedes seleccionar hasta 10 archivos.";
    for (let file of files) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        return "Solo se permiten archivos JPG o PNG.";
      }
      if (file.size > 2 * 1024 * 1024) {
        return "Cada imagen no puede pesar más de 2MB.";
      }
      if (/\s/.test(file.name)) {
        return "El nombre de las imágenes no puede contener espacios.";
      }
    }
    return null;
  };

  // Manejo de carpeta seleccionada
  const handleFolderChange = (event) => {
  const folderName = event.target.value;
  setSelectedFolder(folderName);

  const folder = folders.find(f => f.name === folderName);
  if (folder) {
    setFiles(folder.files || []);
  } else {
    setFiles([]);
  }
  };

  const handleFileChange = (event) => {
    const filesArray = Array.from(event.target.files);
    const error = validateFiles(filesArray);
    if (error) {
      setErrorMessage(error);
      setErrorModalOpen(true);
      setModalOpen(false);
      return;
    }
    setSelectedFiles(filesArray);
  };

  const handleAddIMG = () => {
    if (!selectedFolder) {
      setErrorMessage("Selecciona una carpeta antes de subir imágenes.");
      setErrorModalOpen(true);
      return;
    }
    setLoading(true);

    const convertFilesToBase64 = (files) =>
      Promise.all(
        files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve({ name: file.name, data: reader.result });
              reader.onerror = (error) => reject(error);
              reader.readAsDataURL(file);
            })
        )
      );

    convertFilesToBase64(selectedFiles)
      .then((base64Files) => {
        setFiles((prev) => [...prev, ...base64Files]);

        // Actualizar carpeta en el estado
        setFolders((prevFolders) =>
          prevFolders.map((f) =>
            f.name === selectedFolder ? { ...f, files: [...f.files, ...base64Files] } : f
          )
        );

        setSelectedFiles([]);
        setModalOpen(false);
      })
      .catch((error) => {
        setErrorMessage(error);
        setErrorModalOpen(true);
      })
      .finally(() => setLoading(false));
  };

  const openDeleteModal = (file) => {
    setSelectedFile(file);
    setDeleteModalOpen(true);
  };

  const handleDeleteFile = () => {
    if (!selectedFile) return;
    setLoadingDelete(true);

    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== selectedFile.name));

    // Actualizar carpeta en el estado
    setFolders((prevFolders) =>
      prevFolders.map((f) =>
        f.name === selectedFolder
          ? { ...f, files: f.files.filter((file) => file.name !== selectedFile.name) }
          : f
      )
    );

    setDeleteModalOpen(false);
    setLoadingDelete(false);
  };

  const columns = [
    { name: "Acciones" },
    { name: "Archivo" },
    { name: "Vista previa" },
  ];
  const sortedData = files.slice().sort((a, b) => a.name.localeCompare(b.name));

  const renderRow = (file, index) => (
    <>
      <td key={index}>
        <button onClick={() => openDeleteModal(file)} className="btn btn-danger">
          Eliminar
        </button>
      </td>
      <td>{file.name}</td>
      <td>
        {file.data ? <img src={file.data} alt={file.name} style={{ width: "200px" }} /> : "-"}
      </td>
    </>
  );

  return (
    <Dashboard>
      <div className="top-edit-periodo">
        <p className="tittle-page">Imágenes</p>
        <div className="btn-add-periodo">
          <button onClick={() => setModalOpen(true)}>Subir imágenes</button>
        </div>
      </div>

      <div className="content-dash">
        <div className="text-info">
          <p>Sube imágenes a la carpeta seleccionada. Requisitos:</p>
          <ul>
            <li><b>Máximo 10 imágenes a la vez</b>.</li>
            <li>Solo archivos JPG o PNG.</li>
            <li>Cada imagen no mayor a 2MB.</li>
            <li>Nombres sin espacios.</li>
          </ul>
        </div>

        <div className="selector">
          <select value={selectedFolder} onChange={handleFolderChange}>
            <option value="">Selecciona la carpeta</option>
            {folders.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {selectedFolder ? (
          <TableModal columns={columns} data={sortedData} renderRow={renderRow} />
        ) : (
          <p className="please">Por favor, selecciona una carpeta para ver las imágenes.</p>
        )}

        <ModalCreate
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Agregar imágenes"
          onConfirm={handleAddIMG}
          confirmText="Agregar"
          cancelText="Cancelar"
          confirmDisabled={loading}
        >
          {loading && <div className="spinner-overlay"><Spinner /></div>}
          {!loading && (
            <div className="mb-3">
              <label>Selecciona las imágenes:</label>
              <input type="file" accept=".jpg,.png,.jpeg" multiple onChange={handleFileChange} />
            </div>
          )}
        </ModalCreate>

        <ModalConfirm
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Eliminar imagen"
          message={`¿Deseas eliminar la imagen: ${selectedFile?.name}?`}
          onConfirm={handleDeleteFile}
          confirmText="Eliminar"
          cancelText="Cancelar"
        >
          {loadingDelete && <div className="spinner-overlay"><Spinner /></div>}
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

export default Imagenes;
