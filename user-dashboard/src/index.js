import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import bg from './assets/bg.jpeg';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div className=" bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
    {/* Logo positioned in the top-right corner */}
 

    <App />
  </div>
);
