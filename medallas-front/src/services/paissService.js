import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getPaises = async () => {
  const response = await axios.get(`${API_URL}/paises`);
  return response.data.data;
};

export const createPais = async (pais) => {
  const response = await axios.post(`${API_URL}/paises`, pais);
  return response.data.data;
};

export const updatePais = async (id, pais) => {
  const response = await axios.put(`${API_URL}/paises/${id}`, pais);
  return response.data.data;
};

export const deletePais = async (id) => {
  await axios.delete(`${API_URL}/paises/${id}`);
};
