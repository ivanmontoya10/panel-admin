import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import "../../styles/Dashboard.css";

const Plantilla = () => {
  const [counts, setCounts] = useState({});

  return (
    <Dashboard>
      <div className="top-edit-periodo">
        <p className="tittle-page">Inicio</p>
      </div>
      <div className="content-dash">
        <p
          style={{
            fontSize: "25px",
            textAlign: "center",
            fontWeight: "bold",
            padding: "20px",
          }}
        >
          Total de participantes por curso
        </p>
        <div className="container mt-4">
          <div className="row">
            {[
              { name: "Curso de React", count: 25 },
              { name: "Curso de JavaScript", count: 30 },
              { name: "Curso de Python", count: 18 },
              { name: "Curso de PHP", count: 22 },
              { name: "Curso de Laravel", count: 15 },
              { name: "Curso de TypeScript", count: 20 },
              { name: "Curso de Visual Basic", count: 12 },
              { name: "Curso de C#", count: 28 },
            ].map((curso, index) => (
              <div key={index} className="col-md-3 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{curso.name}</h5>
                    <p className="card-text">Participantes: {curso.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-info">
          <p>
            Este es el panel de administración, aqui puedes realizar varias
            actividades con bastante responsabilidad, dentro de las cuales son
            las siguientes:
            <br />
          </p>
          <p>
            <b>USUARIOS</b>
          </p>
          <ul>
            <li>
              <b>Crear usuarios administradores:</b> En esta sección podrás
              crear un administrador, con la finalidad de incluir más personal y
              que puedan realizar todas las acciones posibles en el panel de
              control.
              <br />
            </li>
            <li>
              <b>Crear participantes:</b> Tal vez esta sea la acción más
              importante del panel de control, esta opción te permite agregar
              participantes a la base de datos para que ellos puedan consultar
              su información y evidencia en cualquier momento. <br />
            </li>
            <li>
              <b>Editar participantes:</b> Esta opción te permite modificar
              algun elemento que se haya ingresado por error o incompleto al
              momento de agregar al participante, además de poder eliminar
              participantes de ser necesario.
              <br />
            </li>
          </ul>
          <p>
            <b>CURSOS</b>
          </p>
          <ul>
            <li>
              <b>Crear cursos</b>: Aquí podrás crear un nuevo curso, en otras
              palabras, podrás crear una carpeta dentro del directorio "/pdf",
              sección en donde se muestran los cursos.
              <br />
            </li>
            <li>
              <b>Editar cursos</b>: En esta sección podrás editar los cursos
              existentes, pudiendo cambiar el nombre o eliminarlos.
              <br />
            </li>
            <li>
              <b>Crear periodos para los cursos</b>: Podrás crear un periodo
              para un curso, es decir, dentro de alguna carpeta situada dentro
              del directorio "/pdf/" podrás crear una carpeta dentro de un
              curso, indicando el periodo/fecha en que se hizo ese curso.
              <br />
            </li>
            <li>
              <b>Editar periodos</b>: En esta sección podrás editar los periodos
              existentes para el curso que necesites, pudiendo cambiar el nombre
              o eliminarlos.
              <br />
            </li>
            <li>
              <b>Agregar certificado</b>: Aquí podrás subir uno o varios
              certificados dentro de un periodo o curso, según la necesidad. Los
              certificados tienen que estar en formato PDF.
              <br />
            </li>
            <li>
              <b>Editar certificados</b>: En esta sección podrás obtener la ruta
              del certificado en archivo PDF{" "}
              <b>(necesario para agregar un participante)</b>, además podrás
              eliminar los certificados existentes para el curso o periodo que
              se requiera. <br />
            </li>
          </ul>
          <p>
            <b>IMAGENES Y GALERÍA</b>
          </p>
          <ul>
            <li>
              <b>Crear carpeta de imagenes</b>: Aquí podrás crear una carpeta
              para subir imagenes, es decir, dentro del directorio "/img/fotos/"
              podrás crear una carpeta indicando el curso, periodo y año en que
              se realizó. <br />
            </li>
            <li>
              <b>Editar carpeta de imagenes</b>: En esta sección podrás editar
              la carpeta que incluirá el catálogo de imagenes del curso en el
              periodo realizado. Podrás cambiar el nombre o eliminarlo según
              sean las necesidades.
              <br />
            </li>
            <li>
              <b>Subir imagenes</b>: Podrás subir todas las imagenes que se
              realizaron en la carpeta de imagenes del curso y periodo que se
              requira.
              <br />
            </li>
            <li>
              <b>Editar catálogo de imagenes</b>: Aquí podrás visualizar todas
              las imagenes de la carpeta de imagenes del curso y periodo
              requerido, además de poder eliminar imagenes de ser necesario.{" "}
              <br />
            </li>
            <li>
              <b>Crear página</b>: En esta sección podrás seleccionar: Ruta en
              donde se creará la página (en el directorio "/galeria/"), Ruta en
              donde se obtendrán las imagenes (a través del directorio
              "/img/fotos/"). Podrás asignarle un nombre a la página, además de
              asignar un título para la página. En otras palabras, se creará un
              archivo HTML que incluirá la galería de imagenes del curso
              deseado.
              <br />
            </li>
            <li>
              <b>Editar páginas</b>: En esta sección podrás obtener la ruta la
              página con la galería de fotos{" "}
              <b>(necesario para agregar un participante)</b>, además de poder
              modificar el nombre de la página, y eliminar las páginas
              existentes que se requieran.
              <br />
            </li>
          </ul>
        </div>
      </div>
    </Dashboard>
  );
};

export default Plantilla;
