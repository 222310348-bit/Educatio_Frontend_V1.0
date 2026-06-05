import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css' Esta linea se comenta para que no interfiera con el diseño css agregado
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
