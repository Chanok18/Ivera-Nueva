import { createContext } from 'react'

export type Tema = 'claro' | 'oscuro'
export type TamanoTexto = 'normal' | 'grande' | 'extra-grande'
export type PreferenciasVisuales = { tema: Tema; tamanoTexto: TamanoTexto; cambiarTema: (tema: Tema) => void; cambiarTamanoTexto: (tamano: TamanoTexto) => void }
export const ContextoPreferenciasVisuales = createContext<PreferenciasVisuales | null>(null)
