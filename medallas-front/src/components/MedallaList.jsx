import React, { useEffect, useState } from 'react';
import { getMedallas, createMedalla, updateMedalla, deleteMedalla } from '../services/medallaService';
import { getPaises } from '../services/paissService';

const MedallaList = () => {
  const [medallas, setMedallas] = useState([]);
  const [paises, setPaises] = useState([]);

  const [tipo, setTipo] = useState('');
  const [deporte, setDeporte] = useState('');
  const [paisId, setPaisId] = useState('');

  const [editando, setEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [meds, ps] = await Promise.all([getMedallas(), getPaises()]);
    setMedallas(meds);
    setPaises(ps);
  };

  const abrirModal = (medalla = null) => {
    if (medalla) {
      setEditando(medalla);
      setTipo(medalla.tipo);
      setDeporte(medalla.deporte);
      setPaisId(medalla.pais_id);
    } else {
      setEditando(null);
      setTipo('');
      setDeporte('');
      setPaisId('');
    }
    setMostrarModal(true);

































    
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setTipo('');
    setDeporte('');
    setPaisId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { tipo, deporte, pais_id: paisId };
    if (editando) {
      await updateMedalla(editando.id, data);
    } else {
      await createMedalla(data);
    }
    cerrarModal();
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar esta medalla?')) {
      await deleteMedalla(id);
      loadData();
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Listado de Medallas</h2>
      <button onClick={() => abrirModal()}>Agregar Medalla</button>

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
          {medallas.length === 0 && (
            <tr><td colSpan="4">No hay medallas registradas.</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
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
