// Importamos la librería axios para hacer solicitudes HTTP
import axios from 'axios';

// Leemos la URL base de la API desde las variables de entorno del proyecto (archivo .env)
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtener la lista de países desde la API.
 * Método: GET
 * Ruta: /paises
 * 
 * @returns {Promise<Array>} - Lista de países en formato { id, nombre }
 */
export const getPaises = async () => {
  const response = await axios.get(`${API_URL}/paises`);
  return response.data.data; // Se accede a la propiedad "data" del objeto de respuesta
};

/**
 * Crear un nuevo país en la base de datos.
 * Método: POST
 * Ruta: /paises
 * 
 * @param {Object} pais - Objeto con los datos del país. Ej: { nombre: "México" }
 * @returns {Promise<Object>} - Objeto del país creado.
 */
export const createPais = async (pais) => {
  const response = await axios.post(`${API_URL}/paises`, pais);
  return response.data.data;
};

/**
 * Actualizar un país existente por su ID.
 * Método: PUT
 * Ruta: /paises/:id
 * 
 * @param {number|string} id - ID del país a actualizar
 * @param {Object} pais - Objeto con los datos actualizados. Ej: { nombre: "Argentina" }
 * @returns {Promise<Object>} - Objeto del país actualizado.
 */
export const updatePais = async (id, pais) => {
  const response = await axios.put(`${API_URL}/paises/${id}`, pais);
  return response.data.data;
};

/**
 * Eliminar un país por su ID.
 * Método: DELETE
 * Ruta: /paises/:id
 * 
 * @param {number|string} id - ID del país a eliminar
 * @returns {Promise<void>}
 */
export const deletePais = async (id) => {
  await axios.delete(`${API_URL}/paises/${id}`);
};
