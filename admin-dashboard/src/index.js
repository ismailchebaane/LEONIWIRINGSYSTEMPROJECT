import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from "./App"
import { AuthContextProvider } from './Components/AuthContext/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
 <React.StrictMode>
    <AuthContextProvider>
  
    <App />
    </AuthContextProvider>
  </React.StrictMode>,

  </div>
);
