import { useEffect, useState, type ReactNode } from 'react'
import { ContextoPreferenciasVisuales, type TamanoTexto, type Tema } from './preferenciasVisualesContexto'
const temas: Tema[] = ['claro', 'oscuro']; const tamanos: TamanoTexto[] = ['normal', 'grande', 'extra-grande']
const seguro = <T,>(valor: string | null, opciones: T[], defecto: T) => opciones.includes(valor as T) ? valor as T : defecto

export function ProveedorPreferenciasVisuales({ children }: { children: ReactNode }) {
  const [tema, cambiarTema] = useState<Tema>(() => seguro(localStorage.getItem('ivera-tema'), temas, window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'))
  const [tamanoTexto, cambiarTamanoTexto] = useState<TamanoTexto>(() => seguro(localStorage.getItem('ivera-tamano-texto'), tamanos, 'normal'))
  useEffect(() => { document.documentElement.dataset.tema = tema; localStorage.setItem('ivera-tema', tema) }, [tema])
  useEffect(() => { document.documentElement.dataset.tamanoTexto = tamanoTexto; localStorage.setItem('ivera-tamano-texto', tamanoTexto) }, [tamanoTexto])
  return <ContextoPreferenciasVisuales.Provider value={{ tema, tamanoTexto, cambiarTema, cambiarTamanoTexto }}>{children}</ContextoPreferenciasVisuales.Provider>
}
