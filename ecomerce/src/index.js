import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { restoreUser } from './features/auth/authSlice';

// Restore user from localStorage when the app starts
try {
  const userData = localStorage.getItem('userData');
  if (userData) {
    const parsedUserData = JSON.parse(userData);
    if (parsedUserData && parsedUserData.success && parsedUserData.user) {
      console.log('Restoring user from localStorage:', parsedUserData);
      store.dispatch(restoreUser(parsedUserData));
    } else {
      console.warn('Invalid user data in localStorage, clearing it');
      localStorage.removeItem('userData');
    }
  }
} catch (error) {
  console.error('Error restoring user from localStorage:', error);
  localStorage.removeItem('userData');
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
