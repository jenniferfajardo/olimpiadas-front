import React, { useEffect, useState } from 'react';
import { getPaises, createPais, updatePais, deletePais } from '../services/paissService';

const PaisList = () => {
  const [paises, setPaises] = useState([]);
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [editando, setEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const fetchPaises = async () => {
    const data = await getPaises();
    setPaises(data);
  };

  useEffect(() => {
    fetchPaises();
  }, []);

  const abrirModal = (pais = null) => {
    if (pais) {
      setEditando(pais);
      setNombre(pais.nombre);
      setCodigo(pais.codigo);
    } else {
      setEditando(null);
      setNombre('');
      setCodigo('');
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setNombre('');
    setCodigo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await updatePais(editando.id, { nombre, codigo });
    } else {
      await createPais({ nombre, codigo });
    }
    cerrarModal();
    fetchPaises();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este país?')) {
      await deletePais(id);
      fetchPaises();
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Listado de Países</h2>

      <button onClick={() => abrirModal()}>Agregar País</button>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paises.map((pais) => (
            <tr key={pais.id}>
              <td>{pais.nombre}</td>
              <td>{pais.codigo}</td>
              <td>
                <button onClick={() => abrirModal(pais)}>Editar</button>
                <button className="delete" onClick={() => handleDelete(pais.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {paises.length === 0 && (
            <tr>
              <td colSpan="3">No hay países registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editando ? 'Editar País' : 'Agregar País'}</h3>
            <form onSubmit={handleSubmit}>
              <div>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              </div>
              <div>
              <input
                type="text"
                placeholder="Código (3 letras)"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                required
              />
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

export default PaisList;
