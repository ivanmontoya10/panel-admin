import React, { useState, useMemo } from "react";
import Dashboard from "../Dashboard";
import "../../styles/Dashboard.css";
import ModalCreate from "../modals/ModalCreate";
import ModalConfirm from "../modals/ModalConfirm";
import ModalError from "../modals/ModalError";
import TableModal from "../modals/TableModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../layouts/Spinner";

const initialParticipants = [
  {
    ID: "ABC123",
    nombre: "Juan Pérez",
    fechacurso: "2023-01-01",
    nombrecurso: "Curso de inyecciones",
    constancia: "https://example.com/constancia1.pdf",
    galeria: "galeria1.php",
    descargables: "https://example.com/descargables1",
    sede: "Ciudad de México",
  },
  {
    ID: "XYZ789",
    nombre: "Ana López",
    fechacurso: "2023-02-15",
    nombrecurso: "Curso de primeros auxilios",
    constancia: "https://example.com/constancia2.pdf",
    galeria: "galeria2.php",
    descargables: "https://example.com/descargables2",
    sede: "Guadalajara",
  },
];

const Participantes = () => {
  const [dataUsers, setDataUsers] = useState(initialParticipants);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputID, setInputID] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputCursoName, setInputCursoName] = useState("");
  const [inputDescar, setInputDescar] = useState("");
  const [inputSede, setInputSede] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [exito, setExito] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const itemsPerPage = 10;
  const maxPageButtons = 3;

  // FILTRAR DATOS
  const filteredData = useMemo(() => {
    if (!searchQuery) return dataUsers;
    return dataUsers.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [dataUsers, searchQuery]);

  // ORDENAR DATOS
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) return sortConfig.direction === "ascending" ? "▲" : "▼";
    return "▲▼";
  };

  const handleClick = (event, number) => {
    event.preventDefault();
    setCurrentPage(number);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // FUNCIONES FRONT-END
  const handleAddParticipante = () => {
    if (!inputID || !inputUsername) return alert("ID y nombre obligatorios");
    setLoading(true);
    const newUser = {
      ID: inputID,
      nombre: inputUsername,
      fechacurso: inputDate,
      nombrecurso: inputCursoName,
      constancia: "#",
      galeria: "#",
      descargables: inputDescar,
      sede: inputSede,
    };
    setDataUsers([newUser, ...dataUsers]);
    setExito("Participante agregado correctamente");
    setShowConfirmModal(true);
    setModalOpen(false);
    setInputID("");
    setInputUsername("");
    setInputDate("");
    setInputCursoName("");
    setInputDescar("");
    setInputSede("");
    setLoading(false);
  };

  const handleEditClick = (dataUser) => {
    setInputCursoName(dataUser.nombrecurso);
    setInputID(dataUser.ID);
    setInputDate(dataUser.fechacurso);
    setInputSede(dataUser.sede);
    setInputUsername(dataUser.nombre);
    setInputDescar(dataUser.descargables);
    setEditModalOpen(true);
  };

  const handleEditParticipante = () => {
    setLoading(true);
    setDataUsers(
      dataUsers.map((user) =>
        user.ID === inputID
          ? {
              ...user,
              nombre: inputUsername,
              nombrecurso: inputCursoName,
              fechacurso: inputDate,
              descargables: inputDescar,
              sede: inputSede,
            }
          : user
      )
    );
    setEditModalOpen(false);
    setLoading(false);
  };

  const handleDeleteClick = (dataUser) => {
    setInputID(dataUser.ID);
    setDeleteModalOpen(true);
    setName(dataUser.ID);
  };

  const handleDeleteParticipante = () => {
    setLoadingDelete(true);
    setDataUsers(dataUsers.filter((user) => user.ID !== inputID));
    setDeleteModalOpen(false);
    setLoadingDelete(false);
  };

  const columns = [
    { name: "Acciones" },
    { name: "ID", onClick: () => requestSort("ID"), indicator: getSortIndicator("ID") },
    { name: "Nombre", onClick: () => requestSort("nombre"), indicator: getSortIndicator("nombre") },
    { name: "Fecha curso", onClick: () => requestSort("fechacurso"), indicator: getSortIndicator("fechacurso") },
    { name: "Nombre curso" },
    { name: "Constancia" },
    { name: "Galería" },
    { name: "Descargables" },
    { name: "Sede" },
  ];

  const renderRow = (dataUser, index) => (
    <>
      <td key={index} className="buttonTD">
        <button onClick={() => handleEditClick(dataUser)} className="btn btn-success me-2">Editar</button>
        <button onClick={() => handleDeleteClick(dataUser)} className="btn btn-danger">Eliminar</button>
      </td>
      <td>{dataUser.ID}</td>
      <td>{dataUser.nombre}</td>
      <td>{dataUser.fechacurso}</td>
      <td>{dataUser.nombrecurso}</td>
      <td><a href={dataUser.constancia}>{dataUser.constancia}</a></td>
      <td><a href={dataUser.galeria.replace(".php", "")}>{dataUser.galeria.replace(".php", "")}</a></td>
      <td><a href={dataUser.descargables}>{dataUser.descargables}</a></td>
      <td>{dataUser.sede}</td>
    </>
  );

  return (
    <Dashboard>
      <div className="top-edit-periodo">
        <p className="tittle-page">Participantes</p>
        <div className="btn-add-periodo">
          <button onClick={() => setModalOpen(true)}>Agregar participante</button>
        </div>
      </div>

      <div className="content-dash">
        
        <div className="text-info">
          <p>
            En esta sección, podrás crear un nuevo participante. Para poder
            realizar esta acción satisfactoriamente, se deberán de cumplir los
            siguientes aspectos:
          </p>
          <ul>
            <li>El ID no debe contener espacios, ni caracteres especiales.</li>
            <li>
              El nombre del participante no debe contener números, ni caracteres
              especiales.
            </li>
            <li>
              La fecha, el nombre del curso y la sede no deben contener
              caracteres especiales.
            </li>
            <li>
              El enlace de la constancia, galería y de los descargables no deben
              contener espacios ni estos caracteres:
            </li>
            <li>Caracteres especiales no válidos: ($, @, !, %, etc).</li>
            <li>Todos los campos son obligratorios.</li>
          </ul>
          <p>Además, es importante conocer los siguientes aspectos:</p>
          <ul>
            <li>
              Una vez que se agregue el participante,{" "}
              <b>su ID no se podrá modificar</b>.
            </li>
            <li>
              De igual manera que con el ID, si se agrega el participante a un
              taller este ya no podrá moverse a otro.
            </li>
            <li>
              La única forma de corregir las dos excepciones anteriores será
              eliminando y agregando nuevamente al participante.
            </li>
          </ul>
        </div>
        <input
          id="search-user"
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />

        <TableModal columns={columns} data={currentItems} renderRow={renderRow} />

        <div className="pagination">
          {currentPage > 1 && <button onClick={(e) => handleClick(e, currentPage - 1)}><FontAwesomeIcon icon={faChevronLeft} /></button>}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button key={page} onClick={(e) => handleClick(e, page)} className={currentPage === page ? "active" : ""}>{page}</button>
          ))}
          {currentPage < totalPages && <button onClick={(e) => handleClick(e, currentPage + 1)}><FontAwesomeIcon icon={faChevronRight} /></button>}
        </div>

        {/* MODALES */}
        <ModalCreate isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Agregar un participante" onConfirm={handleAddParticipante} confirmText="Agregar" cancelText="Terminar" grande="modal-xl" confirmDisabled={loading}>
          {loading && <div className="spinner-overlay"><Spinner /></div>}
          {!loading && (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>ID</label>
                  <input type="text" value={inputID} maxLength={20} onChange={(e) => setInputID(e.target.value.replace(/\s+/g, "").toUpperCase())} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Nombre</label>
                  <input type="text" value={inputUsername} maxLength={40} onChange={(e) => setInputUsername(e.target.value)} className="form-control" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Fecha curso</label>
                  <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Nombre curso</label>
                  <input type="text" value={inputCursoName} maxLength={240} onChange={(e) => setInputCursoName(e.target.value)} className="form-control" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Descargables</label>
                  <input type="text" value={inputDescar} maxLength={250} onChange={(e) => setInputDescar(e.target.value.replace(/\s+/g, ""))} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Sede</label>
                  <input type="text" value={inputSede} maxLength={20} onChange={(e) => setInputSede(e.target.value)} className="form-control" />
                </div>
              </div>
            </>
          )}
        </ModalCreate>

        <ModalCreate isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Editar participante" onConfirm={handleEditParticipante} confirmText="Actualizar" cancelText="Cancelar" grande="modal-xl" confirmDisabled={loading}>
          {loading && <div className="spinner-overlay"><Spinner /></div>}
          {!loading && (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Nombre</label>
                  <input type="text" value={inputUsername} maxLength={40} onChange={(e) => setInputUsername(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Nombre curso</label>
                  <input type="text" value={inputCursoName} maxLength={180} onChange={(e) => setInputCursoName(e.target.value)} className="form-control" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Fecha curso</label>
                  <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-6">
                  <label>Descargables</label>
                  <input type="text" value={inputDescar} onChange={(e) => setInputDescar(e.target.value)} className="form-control" />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Sede</label>
                  <input type="text" value={inputSede} onChange={(e) => setInputSede(e.target.value)} className="form-control" />
                </div>
              </div>
            </>
          )}
        </ModalCreate>

        <ModalConfirm isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Eliminar participante" message={`¿Estás seguro de eliminar al participante con ID: ${name}?`} onConfirm={handleDeleteParticipante} confirmText="Eliminar" cancelText="Cancelar">
          {loadingDelete && <div className="spinner-overlay"><Spinner /></div>}
        </ModalConfirm>

        <ModalError isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} errorMessage={exito} title="Éxito" textButton="Regresar" buttonClass="success" />
        <ModalError isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errorMessage="Ha ocurrido un error" />
      </div>
    </Dashboard>
  );
};

export default Participantes;
