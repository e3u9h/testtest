import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import "bootstrap/dist/js/bootstrap.bundle"
import { AuthProvider } from './provider/context';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </React.StrictMode>
);


