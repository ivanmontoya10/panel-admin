import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Dashboard.css";
import ModalConfirm from "../modals/ModalConfirm";
import unnamed from '../unnamed.png';

function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      Cookies.remove("session");
      setUser(null);
      navigate("/admin/login");
    } catch (error) {}
    setShowModal(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="dashboard-header d-flex justify-content-between align-items-center p-3 text-red">
      <div className="header-content d-flex align-items-center">
        <img src={unnamed} alt="Logo" className="header-logo"/>
        <div className="header-button ms-3">
          <button className="btn btn-light" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
      <div className="header-final d-flex align-items-center">
        <p className="hola-user mb-0 me-3">Hola, {user?.username}</p>
        <div className="header-dropdown position-relative" ref={dropdownRef}>
          <button className="btn btn-light" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          {showDropdown && (
            <div className="dropdown-content position-absolute bg-white text-dark border rounded shadow-sm"
              style={{ zIndex: 1000, left: "-60px", top: "100%" }}>
              <span className="hola-user-re">Hola, {user?.username}</span>
              <a className="d-block py-2 px-3" onClick={() => { setShowDropdown(false); setShowModal(true); }}>
                Cerrar sesión
              </a>
            </div>
          )}
        </div>
      </div>

      <ModalConfirm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleLogout}
        title="Cerrar sesión"
        message={"¿Estás seguro de que deseas cerrar sesión?"}
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        btnRed="danger"
        btnPrimary="secondary"
      />
    </header>
  );
}

export default Header;
