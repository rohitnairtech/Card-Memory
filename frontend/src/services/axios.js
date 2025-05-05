import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @typedef {Object} LoginOrRegsiterPayload
 * @property {string} username
 * @property {string} password
 */



/**
 * Function to handle user login
 * @param {LoginOrRegsiterPayload} payload 
 * @returns 
 */
export const login = async (payload) => {
  try {
    const response = await apiInstance.post('/users/login', payload);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Function to handle user registeration
 * @param {LoginOrRegsiterPayload} payload 
 * @returns 
 */
export const register = async (payload) => {
  try {
    const response = await apiInstance.post('/users/register', payload);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Function to save game data
 * @param {LoginOrRegsiterPayload} payload 
 * @returns 
 */
export const saveGame = async (payload) => {
  try {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiInstance.post('/memory/save', payload , config);
    return response.data;
  } catch (error) {
    console.error('Failed to save game:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Function to get game history for a user
 * @param {none} _
 * @returns {Promise<Array>} - Array of game history records
 */
export const getGameHistory = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiInstance.get(`/memory/history`, config);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch game history:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default apiInstance;
