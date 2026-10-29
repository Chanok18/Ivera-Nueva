import { useContext } from 'react'
import { ContextoPreferenciasVisuales } from './preferenciasVisualesContexto'

export function usePreferenciasVisuales() { const contexto = useContext(ContextoPreferenciasVisuales); if (!contexto) throw new Error('Preferencias visuales no disponibles'); return contexto }
