import React, { useEffect, useState } from 'react';
// Importamos las funciones del servicio para medallas y países
import { getMedallas, createMedalla, updateMedalla, deleteMedalla } from '../services/medallaService';
import { getPaises } from '../services/paissService';

const MedallaList = () => {
  // Estado para guardar la lista de medallas
  const [medallas, setMedallas] = useState([]);
  // Estado para guardar la lista de países disponibles (llave foránea)
  const [paises, setPaises] = useState([]);

  // Estados controlados para el formulario
  const [tipo, setTipo] = useState('');
  const [deporte, setDeporte] = useState('');
  const [paisId, setPaisId] = useState('');

  // Estado que indica si estamos editando una medalla
  const [editando, setEditando] = useState(null);
  // Estado para mostrar u ocultar el modal
  const [mostrarModal, setMostrarModal] = useState(false);

  // Hook useEffect para cargar los datos al montar el componente
  useEffect(() => {
    loadData(); // Carga medallas y países
  }, []);

  // Función para cargar datos desde la API
  const loadData = async () => {
    const [meds, ps] = await Promise.all([getMedallas(), getPaises()]);
    setMedallas(meds);
    setPaises(ps);
  };

  // Abre el modal para agregar o editar una medalla
  const abrirModal = (medalla = null) => {
    if (medalla) {
      // Si se pasa una medalla, estamos editando
      setEditando(medalla);
      setTipo(medalla.tipo);
      setDeporte(medalla.deporte);
      setPaisId(medalla.pais_id); // ID de la relación con país
    } else {
      // Si no se pasa medalla, es un nuevo registro
      setEditando(null);
      setTipo('');
      setDeporte('');
      setPaisId('');
    }
    setMostrarModal(true); // Muestra el modal
  };

  // Cierra y resetea el modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setTipo('');
    setDeporte('');
    setPaisId('');
  };

  // Maneja el envío del formulario del modal
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      tipo,
      deporte,
      pais_id: paisId
    };

    if (editando) {
      // Si estamos editando, actualizamos
      await updateMedalla(editando.id, data);
    } else {
      // Si no, creamos una nueva medalla
      await createMedalla(data);
    }

    cerrarModal(); // Cerramos modal tras acción
    loadData();    // Recargamos la lista actualizada
  };

  // Maneja la eliminación de una medalla
  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta medalla?')) {
      await deleteMedalla(id);
      loadData(); // Recarga la lista
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Listado de Medallas</h2>
      <button onClick={() => abrirModal()}>Agregar Medalla</button>

      {/* Tabla de medallas */}
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Deporte</th>
            <th>País</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {medallas.map((medalla) => (
            <tr key={medalla.id}>
              <td>{medalla.tipo}</td>
              <td>{medalla.deporte}</td>
              <td>{medalla.pais?.nombre}</td>
              <td>
                <button onClick={() => abrirModal(medalla)}>Editar</button>
                <button className="delete" onClick={() => handleDelete(medalla.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {/* Mensaje si no hay registros */}
          {medallas.length === 0 && (
            <tr><td colSpan="4">No hay medallas registradas.</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal para formulario */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editando ? 'Editar Medalla' : 'Agregar Medalla'}</h3>

            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Tipo (oro, plata, bronce)"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Deporte"
                  value={deporte}
                  onChange={(e) => setDeporte(e.target.value)}
                  required
                />
              </div>

              {/* Select de países: se carga dinámicamente del backend */}
              <div>
                <select value={paisId} onChange={(e) => setPaisId(e.target.value)} required>
                  <option value="">Selecciona un país</option>
                  {paises.map((pais) => (
                    <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: '10px' }}>
                <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
                <button type="button" className="cancel" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedallaList;
