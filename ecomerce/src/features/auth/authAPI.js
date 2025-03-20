import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const createUser = async (userData) => {
  try {
    const dataToSend = {
      email: userData.email,
      password: userData.password,
      confirmpassword: userData.password, // Using exact field name expected by backend
      role: userData.role || 'user'
    };
    console.log('Sending signup data:', dataToSend);
    
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: { 
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Signup response:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Signup API error:', error.message);
    throw error;
  }
};

export function checkuser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Auth API: Sending login request to:', `${API_URL}/login`);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(loginInfo),
        headers: { 
          'content-type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include' // Important for cookies
      });
      
      const data = await response.json();
      console.log('Auth API: Login response:', data);
      
      if (!response.ok) {
        console.error('Auth API: Login failed:', data);
        reject({
          message: data.message || 'Login failed. Please try again.'
        });
        return;
      }
      
      if (!data.success || !data.user) {
        console.error('Auth API: Invalid response structure:', data);
        reject({
          message: 'Invalid response from server'
        });
        return;
      }
      
      console.log('Auth API: Login successful');
      resolve({ data });
    } catch (error) {
      console.error('Auth API: Login error:', error);
      reject({
        message: 'Unable to connect to the server. Please check if the server is running.'
      });
    }
  });
}

export function signOut(userId) {
  return new Promise(async (resolve) => {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');
    resolve({ data: "success" });
  });
}

export function forgotPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
      });
      
      if (!response.ok) {
        const error = await response.json();
        reject(error);
      }

      const json = await response.json();
      resolve({ data: json });
    } catch (error) {
      reject(error);
    }
  });
}
