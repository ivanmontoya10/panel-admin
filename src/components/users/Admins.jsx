import React, { useState } from "react";
import Dashboard from "../Dashboard";
import "../../styles/Dashboard.css";
import ModalCreate from "../modals/ModalCreate";
import ModalConfirm from "../modals/ModalConfirm";
import ModalError from "../modals/ModalError";
import TableModal from "../modals/TableModal";

const Admins = () => {
  const initialAdmins = [
    { id: 1, username: "admin1" },
    { id: 2, username: "superuser" },
    { id: 3, username: "guestAdmin" },
  ];

  const [admins, setAdmins] = useState(initialAdmins);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputNewUsername, setInputNewUsername] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ----- FUNCIONES DE VALIDACIÓN -----
  const validateUsername = (username) => {
    if (!username) return "El nombre de usuario es obligatorio.";
    if (username.length < 6 || username.length > 12)
      return "El nombre de usuario debe tener entre 6 y 12 caracteres.";
    if (/\s/.test(username))
      return "El nombre de usuario no puede contener espacios.";
    if (/[^a-zA-Z0-9]/.test(username))
      return "El nombre de usuario solo puede contener letras y números.";
    if (admins.some((a) => a.username === username))
      return "El nombre de usuario ya existe.";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "La contraseña es obligatoria.";
    if (password.length < 8 || password.length > 20)
      return "La contraseña debe tener entre 8 y 20 caracteres.";
    if (!/[a-z]/.test(password))
      return "La contraseña debe contener al menos una letra minúscula.";
    if (!/[A-Z]/.test(password))
      return "La contraseña debe contener al menos una letra mayúscula.";
    if (!/[0-9]/.test(password))
      return "La contraseña debe contener al menos un número.";
    if (!/[$@!%*?&]/.test(password))
      return "La contraseña debe contener al menos un carácter especial ($, @, !, %, etc).";
    return null;
  };

  // ----- AGREGAR -----
  const closeModal = () => {
    setModalOpen(false);
    setInputUsername("");
    setInputPassword("");
  };

  const handleAdmin = () => {
    const userError = validateUsername(inputUsername);
    if (userError) {
      setErrorMessage(userError);
      setErrorModalOpen(true);
      return;
    }

    const passError = validatePassword(inputPassword);
    if (passError) {
      setErrorMessage(passError);
      setErrorModalOpen(true);
      return;
    }

    const newAdmin = { id: admins.length + 1, username: inputUsername };
    setAdmins([...admins, newAdmin]);
    closeModal();
  };

  // ----- EDITAR -----
  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setInputNewUsername(admin.username);
    setInputNewPassword("");
    setEditModalOpen(true);
  };

  const handleEditAdmin = () => {
    if (!inputNewUsername) {
      setErrorMessage("El nombre no puede estar vacío.");
      setErrorModalOpen(true);
      return;
    }

    // Validación de usuario (exceptuando el actual)
    const otherAdmins = admins.filter((a) => a.id !== selectedAdmin.id);
    if (otherAdmins.some((a) => a.username === inputNewUsername)) {
      setErrorMessage("El nombre de usuario ya existe.");
      setErrorModalOpen(true);
      return;
    }

    if (inputNewUsername.length < 6 || inputNewUsername.length > 12) {
      setErrorMessage("El nombre de usuario debe tener entre 6 y 12 caracteres.");
      setErrorModalOpen(true);
      return;
    }
    if (/\s/.test(inputNewUsername) || /[^a-zA-Z0-9]/.test(inputNewUsername)) {
      setErrorMessage(
        "El nombre de usuario solo puede contener letras y números, sin espacios."
      );
      setErrorModalOpen(true);
      return;
    }

    // Validación de contraseña solo si se ingresó
    if (inputNewPassword) {
      const passError = validatePassword(inputNewPassword);
      if (passError) {
        setErrorMessage(passError);
        setErrorModalOpen(true);
        return;
      }
    }

    const updatedAdmins = admins.map((a) =>
      a.id === selectedAdmin.id ? { ...a, username: inputNewUsername } : a
    );
    setAdmins(updatedAdmins);
    setEditModalOpen(false);
  };

  // ----- ELIMINAR -----
  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setDeleteModalOpen(true);
  };

  const handleDeleteAdmin = () => {
    setAdmins(admins.filter((a) => a.id !== selectedAdmin.id));
    setDeleteModalOpen(false);
  };

  const columns = [
    { name: "Acciones" },
    { name: "ID" },
    { name: "Administradores" },
  ];

  const renderRow = (admin, index) => (
    <>
      <td key={index}>
        <button
          onClick={() => handleEdit(admin)}
          className="btn btn-success me-2"
        >
          Editar
        </button>
        <button onClick={() => handleDelete(admin)} className="btn btn-danger">
          Eliminar
        </button>
      </td>
      <td>{admin.id}</td>
      <td>{admin.username}</td>
    </>
  );

  return (
    <Dashboard>
      <div className="top-edit-periodo">
        <p className="tittle-page">Administradores</p>
        <div className="btn-add-periodo">
          <button onClick={() => setModalOpen(true)}>
            Agregar administrador
          </button>
        </div>
      </div>
      <div className="content-dash">
        <div className="text-info">
          <p>
            En esta sección, podrás agregar o editar la información de los
            administradores. Podrás cambiar tanto el nombre del administrador
            (username) como la contraseña, además de poder eliminarlos. Para
            poder realizar estas acciones, se deberá tener en cuenta lo
            siguiente:
          </p>
          <ul>
            <li>
              El nuevo nombre de usuario (en caso de ser cambiado) no puede ser
              repetido.
            </li>
            <li>
              La nueva contraseña (en caso de ser cambiada) debe de contener:
            </li>
            <ul>
              <li>Al menos una letra minúscula.</li>
              <li>Al menos una letra mayúscula.</li>
              <li>Al menos un número.</li>
              <li>Al menos un carácter especial ($, @, !, %, etc).</li>
            </ul>
            <li>El nombre de usuario debe contener de 6 a 12 caracteres.</li>
            <li>
              El nombre de usuario debe estar sin espacios y sin caracteres
              especiales.{" "}
            </li>
            <li>
              La contraseña tiene una longitud mínima de 8 caracteres y máximo
              de 20 caracteres.
            </li>
          </ul>
        </div>

        <TableModal columns={columns} data={admins} renderRow={renderRow} />

        {/* Modal crear */}
        <ModalCreate
          isOpen={modalOpen}
          onClose={closeModal}
          title="Agregar un administrador"
          onConfirm={handleAdmin}
          confirmText="Agregar"
          cancelText="Cancelar"
        >
          <div className="mb-3">
            <label htmlFor="label-username">Nombre de usuario</label>
            <input
              id="label-username"
              value={inputUsername}
              type="text"
              maxLength={20}
              onChange={(e) => setInputUsername(e.target.value.replace(/\s+/g, ""))}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="label-pass">Contraseña</label>
            <input
              id="label-pass"
              value={inputPassword}
              type="password"
              maxLength={20}
              onChange={(e) => setInputPassword(e.target.value.replace(/\s+/g, ""))}
            />
          </div>
        </ModalCreate>

        {/* Modal editar */}
        <ModalCreate
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Editar administrador"
          onConfirm={handleEditAdmin}
          confirmText="Guardar"
          cancelText="Cancelar"
        >
          <div className="mb-3">
            <label htmlFor="label-new-username">Nuevo nombre de usuario</label>
            <input
              id="label-new-username"
              value={inputNewUsername}
              type="text"
              maxLength={20}
              onChange={(e) => setInputNewUsername(e.target.value.replace(/\s+/g, ""))}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="label-new-pass">Nueva contraseña (opcional)</label>
            <input
              id="label-new-pass"
              value={inputNewPassword}
              type="password"
              maxLength={20}
              onChange={(e) => setInputNewPassword(e.target.value.replace(/\s+/g, ""))}
            />
          </div>
        </ModalCreate>

        {/* Modal eliminar */}
        <ModalConfirm
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Eliminar administrador"
          message={`¿Seguro que deseas eliminar al administrador ${selectedAdmin?.username}?`}
          onConfirm={handleDeleteAdmin}
          confirmText="Eliminar"
          cancelText="Cancelar"
        />

        {/* Modal error */}
        <ModalError
          isOpen={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          errorMessage={errorMessage}
        />
      </div>
    </Dashboard>
  );
};

export default Admins;
