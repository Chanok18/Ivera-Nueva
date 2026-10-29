import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'
import { ProveedorPreferenciasVisuales } from './contexto/PreferenciasVisuales'

const raiz = document.getElementById('root')
if (!raiz) {
  throw new Error('No se encontró el elemento #root')
}

createRoot(raiz).render(
  <StrictMode>
    <ProveedorPreferenciasVisuales><App /></ProveedorPreferenciasVisuales>
  </StrictMode>,
)
