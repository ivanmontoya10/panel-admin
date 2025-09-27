import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext";
import "../../styles/Dashboard.css";

function Sidebar({ showSidebar, onHideSidebar }) {
  const { user } = useContext(UserContext);

  const handleLinkClick = () => {
    onHideSidebar();
  };

  const sidebarLinks = [
    {
      title: "Inicio",
      links: [
        { path: "/admin/inicio", label: "Pagina principal" },
        { path: "/admin/admins", label: "Administradores" },
      ],
    },
    {
      title: "Alta de participantes",
      links: [
        { path: "/admin/periodos", label: "1.- Periodo de cursos" },
        { path: "/admin/constancias", label: "2.- Constancias" },
        { path: "/admin/galerias", label: "3.- Carpeta de imágenes" },
        { path: "/admin/imagenes", label: "4.- Imágenes" },
        { path: "/admin/paginas", label: "5.- Páginas" },
        { path: "/admin/participantes", label: "6.- Participantes" },
      ],
    },
  ];

  return (
    <aside
      className={`dashboard-sidebar ${showSidebar ? "d-block" : "d-none"
      } border-end d-flex flex-column`}
    >
      <div className="flex-grow-1 overflow-auto">
        <ul className="list-unstyled">
          {sidebarLinks.map((section, index) => (
            <div key={index}>
              <p className="title-side mt-3">{section.title}</p>
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link to={link.path} onClick={handleLinkClick}>
                    <div className="dropdown-item d-flex align-items-center">
                      <div className="block-4 ms-2">{link.label}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </div>
          ))}
        </ul>
      </div>

      <div className="sidefooter p-3">
        <p className="title-sidefooter mb-0">
          Sesión de: {user?.username}
          <br />
          Copyright © Genericorp {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
