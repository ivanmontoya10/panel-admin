import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye,faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import ModalError from "./modals/ModalError";
import unnamed from './unnamed.png';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate(); 

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
  if (username && password) {
    Cookies.set("session", `${username}-token`, { expires: 1 / 24 }); // 1 hora
    setUser({ username });
    navigate("/admin/inicio");
  } else {
    setErrorMessage("Usuario y contraseña requeridos");
    setShowErrorModal(true);
  }
};

  return (
    <div className="super-content-login">
      <div className="content-login">
        <div className="login">
          <div className="logo-img">
            <img
              className="logo"
              src={unnamed}
            />
          </div>
          <form>
            <p>
              <label className="icon-label" htmlFor="username">
                <i>
                  <FontAwesomeIcon icon={faUser} />
                </i>
              </label>
              <input
                id="username"
                placeholder="Usuario"
                type="text"
                value={username}
                maxLength={20}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </p>

            <p>
              <label className="icon-label" htmlFor="password">
                <i>
                  <FontAwesomeIcon icon={faLock} />
                </i>
              </label>
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                maxLength={20}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="eye-toggle-icon" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </i>
            </p>

            <button type="button" className="button-form" onClick={handleLogin}>
              Acceder
            </button>
          </form>
        </div>

        <ModalError
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};

export default Login;
