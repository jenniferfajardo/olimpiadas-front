import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getMedallas = async () => {
  const response = await axios.get(`${API_URL}/medallas`);
  return response.data.data;
};

export const createMedalla = async (medalla) => {
  const response = await axios.post(`${API_URL}/medallas`, medalla);
  return response.data.data;
};

export const updateMedalla = async (id, medalla) => {
  const response = await axios.put(`${API_URL}/medallas/${id}`, medalla);
  return response.data.data;
};

export const deleteMedalla = async (id) => {
  await axios.delete(`${API_URL}/medallas/${id}`);
};
