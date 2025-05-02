import axios from 'axios';

// Set up the base URL for API calls
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update to your backend's URL
});


// Example for sending POST request (signup)
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Example for login request
export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/login', loginData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
