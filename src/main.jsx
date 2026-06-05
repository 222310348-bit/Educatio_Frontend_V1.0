import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css' Esta linea se comenta para que no interfiera con el diseño css agregado
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
