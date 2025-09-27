import React, { useEffect } from "react";
import "./App.css";
import { UserProvider } from "./UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Plantilla from "./components/layouts/Plantilla";
import Admins from "./components/users/Admins";
import Periodos from "./components/cursos/Periodos";
import Certificados from "./components/cursos/Certificados";
import CarpetImgs from "./components/img-pages/CarpetImgs";
import Imagenes from "./components/img-pages/Imagenes";
import Paginas from "./components/img-pages/Paginas";
import Participantes from "./components/users/Participantes";
import ProtectedRoute from "./ProtectedRoute";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <UserProvider>
      {/* <Router> */}
      <Router basename="/panel-admin">
        <Routes>
          <Route path="/admin/login" exact element={<Login />} />
          <Route path="/admin/inicio" element={<ProtectedRoute element={<Plantilla />} />} />
          <Route path="/admin/admins" element={<ProtectedRoute element={<Admins />} />} />
          <Route path="/admin/periodos" element={<ProtectedRoute element={<Periodos />} />} />
          <Route path="/admin/constancias" element={<ProtectedRoute element={<Certificados />} />} />
          <Route path="/admin/galerias" element={<ProtectedRoute element={<CarpetImgs />} />} />
          <Route path="/admin/imagenes" element={<ProtectedRoute element={<Imagenes />} />} />
          <Route path="/admin/paginas" element={<ProtectedRoute element={<Paginas />} />} />
          <Route path="/admin/participantes" element={<ProtectedRoute element={<Participantes />} />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
