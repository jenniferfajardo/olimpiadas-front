// Importa React y los hooks necesarios
import React, { useEffect, useState } from "react";
// Importa las funciones de servicio para realizar operaciones CRUD sobre países
import {
  getPaises,
  createPais,
  updatePais,
  deletePais,
  getPaisConMedallas,
} from "../services/paissService";

// Componente funcional que muestra y gestiona una lista de países
const PaisList = () => {
  // Estado que guarda el arreglo de países
  const [paises, setPaises] = useState([]);
  // Estado para el nombre del país en el formulario
  const [nombre, setNombre] = useState("");
  // Estado para el código del país (ej. ARG, COL, etc.)
  const [codigo, setCodigo] = useState("");
  // Estado que guarda el país que se está editando (null si se está creando uno nuevo)
  const [editando, setEditando] = useState(null);
  // Estado que controla si el modal está visible o no
  const [mostrarModal, setMostrarModal] = useState(false);

  // Para mostrar medallas asociadas a un país
  const [medallas, setMedallas] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [mostrarMedallas, setMostrarMedallas] = useState(false);

  // Función asincrónica para obtener los países desde el backend
  const fetchPaises = async () => {
    const data = await getPaises();
    setPaises(data); // Almacena los países obtenidos en el estado
  };

  // useEffect se ejecuta al montar el componente y carga los países
  useEffect(() => {
    fetchPaises();
  }, []);

  // Abre el modal para crear o editar un país
  const abrirModal = (pais = null) => {
    if (pais) {
      // Si se pasa un país, se está editando
      setEditando(pais);
      setNombre(pais.nombre);
      setCodigo(pais.codigo);
    } else {
      // Si no se pasa país, se está creando uno nuevo
      setEditando(null);
      setNombre("");
      setCodigo("");
    }
    setMostrarModal(true); // Muestra el modal
  };

  // Cierra el modal y limpia los estados del formulario
  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setNombre("");
    setCodigo("");
  };

  // Maneja el envío del formulario (crear o actualizar país)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene recarga del formulario

    if (editando) {
      // Si hay país en edición, actualiza
      await updatePais(editando.id, { nombre, codigo });
    } else {
      // Si no, crea uno nuevo
      await createPais({ nombre, codigo });
    }

    cerrarModal(); // Cierra el modal después de guardar
    fetchPaises(); // Refresca la lista de países
  };

  // Elimina un país por su ID, previa confirmación
  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este país?")) {
      await deletePais(id); // Llama al servicio para eliminar
      fetchPaises(); // Refresca la lista
    }
  };

  // Función para obtener medallas por país
  const verMedallas = async (id) => {
  try {
    const pais = await getPaisConMedallas(id); // Usa el servicio para buscar medallas por país
    setPaisSeleccionado(pais);
    setMedallas(pais.medallas);
    setMostrarMedallas(true);
  } catch (error) {
    console.error('Error al cargar medallas:', error);
    alert('No se pudieron cargar las medallas del país.');
  }
};



  // Renderizado del componente
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Listado de Países</h2>

      {/* Botón para abrir el modal en modo creación */}
      <button onClick={() => abrirModal()}>Agregar País</button>

      {/* Tabla con la lista de países */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Acciones</th>
            <th>Medallas</th>
          </tr>
        </thead>
        <tbody>
          {/* Renderiza una fila por cada país */}
          {paises.map((pais) => (
            <tr key={pais.id}>
              <td>{pais.nombre}</td>
              <td>{pais.codigo}</td>
              <td>
                {/* Botón para editar un país */}
                <button onClick={() => abrirModal(pais)}>Editar</button>
                {/* Botón para eliminar un país */}
                <button
                  className="delete"
                  onClick={() => handleDelete(pais.id)}
                >
                  Eliminar
                </button>
              </td>
              <td>
                {/* Botón para ver medallas del país */}
                <button onClick={() => verMedallas(pais.id)}>
                  Ver Medallas
                </button>
              </td>
            </tr>
          ))}
          {/* Si no hay países, muestra un mensaje */}
          {paises.length === 0 && (
            <tr>
              <td colSpan="3">No hay países registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal que contiene el formulario para agregar o editar país */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editando ? "Editar País" : "Agregar País"}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                {/* Campo de entrada para el nombre del país */}
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                {/* Campo para el código del país (forzado a mayúsculas) */}
                <input
                  type="text"
                  placeholder="Código (3 letras)"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div style={{ marginTop: "10px" }}>
                {/* Botón para enviar (agregar o actualizar) */}
                <button type="submit">
                  {editando ? "Actualizar" : "Agregar"}
                </button>
                {/* Botón para cancelar y cerrar el modal */}
                <button type="button" className="cancel" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarMedallas && (
  <div className="modal">
    <div className="modal-content">
      <h3>Medallas de {paisSeleccionado?.nombre}</h3>
      {medallas.length > 0 ? (
        <ul>
          {medallas.map((medalla) => (
            <li key={medalla.id}>
              🏅 {medalla.tipo} - {medalla.deporte}
            </li>
          ))}
        </ul>
      ) : (
        <p>Este país no tiene medallas registradas.</p>
      )}
      <button onClick={() => setMostrarMedallas(false)}>Cerrar</button>
    </div>
  </div>
)}

    </div>
  );
};

// Exporta el componente para ser usado en otras partes de la aplicación
export default PaisList;
