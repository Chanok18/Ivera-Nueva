import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProveedorPreferenciasVisuales } from './PreferenciasVisuales'
import { usePreferenciasVisuales } from './usePreferenciasVisuales'

function Control() { const p = usePreferenciasVisuales(); return <><p>{p.tema}:{p.tamanoTexto}</p><button onClick={() => p.cambiarTema(p.tema === 'claro' ? 'oscuro' : 'claro')}>tema</button><button onClick={() => p.cambiarTamanoTexto('extra-grande')}>texto</button></> }
function mostrar() { render(<ProveedorPreferenciasVisuales><Control /></ProveedorPreferenciasVisuales>) }
afterEach(() => { localStorage.clear(); delete document.documentElement.dataset.tema; delete document.documentElement.dataset.tamanoTexto; vi.restoreAllMocks() })
function sistemaOscuro(matches: boolean) { Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({ matches }) }) }

describe('Preferencias visuales', () => {
  it('usa claro y texto normal de forma segura', () => { sistemaOscuro(false); mostrar(); expect(screen.getByText('claro:normal')).toBeInTheDocument(); expect(document.documentElement.dataset.tema).toBe('claro') })
  it('respeta modo oscuro del sistema sin preferencia guardada', () => { sistemaOscuro(true); mostrar(); expect(screen.getByText('oscuro:normal')).toBeInTheDocument() })
  it('persiste tema y tamano seleccionados', async () => { sistemaOscuro(false); mostrar(); await userEvent.click(screen.getByRole('button', { name: 'tema' })); await userEvent.click(screen.getByRole('button', { name: 'texto' })); expect(localStorage.getItem('ivera-tema')).toBe('oscuro'); expect(localStorage.getItem('ivera-tamano-texto')).toBe('extra-grande'); expect(document.documentElement.dataset.tamanoTexto).toBe('extra-grande') })
  it('descarta valores almacenados invalidos', () => { localStorage.setItem('ivera-tema', 'violeta'); localStorage.setItem('ivera-tamano-texto', 'enorme'); sistemaOscuro(false); mostrar(); expect(screen.getByText('claro:normal')).toBeInTheDocument() })
})
