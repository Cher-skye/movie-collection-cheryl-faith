import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const APP_NAME = import.meta.env.VITE_APP_NAME;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function fetchInitialMovies() {
  try {
    console.log(`Starting ${APP_NAME}...`);
    console.log("Fetching movies from:", BASE_URL);

    const response = await apiClient.get('/movie');
    console.log("Movies successfully retrieved:", response.data);
  } catch (error) {
    console.error("An error occurred while fetching movies:", error.message);
  }
}

fetchInitialMovies();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)