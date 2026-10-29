import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ventasApi } from '@/api/ventas'
import DetalleVenta from './DetalleVenta'

vi.mock('@/api/ventas', () => ({ ventasApi: { obtener: vi.fn(), anular: vi.fn() } }))
vi.mock('@/auth/contexto', () => ({ usePermiso: () => false }))
vi.mock('@/componentes/ui/notificaciones', () => ({ useAvisos: () => ({ avisar: vi.fn() }) }))

const venta = { id: 9, tipoDocumento: 'NOTA_VENTA', numeroDocumento: 'NV01-000009', fecha: '2026-01-01T10:00:00Z', ubicacionId: 1, ubicacionNombre: 'Tienda', empresaRuc: '20123456789', empresaRazonSocial: 'Ivera', vendedor: 'vendedor', cajaId: 1, clienteId: null, clienteNombre: null, condicion: 'CONTADO', fechaVencimiento: null, subtotal: 100, igv: 18, descuento: 0, total: 118, saldoPendiente: 0, estado: 'EMITIDA', motivoAnulacion: null, vuelto: 0, detalles: [], pagos: [] }
function Ruta() { return <p data-testid="ruta">{useLocation().pathname}</p> }
function mostrar() { render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter initialEntries={['/ventas/9']}><Routes><Route path="/ventas/:id" element={<DetalleVenta />} /><Route path="/cotizaciones/:id" element={<Ruta />} /></Routes></MemoryRouter></QueryClientProvider>) }

describe('DetalleVenta: cotizacion de origen', () => {
  beforeEach(() => vi.clearAllMocks())
  it('muestra y enlaza la cotizacion de origen', async () => {
    vi.mocked(ventasApi.obtener).mockResolvedValue({ ...venta, cotizacionId: 42, cotizacionCodigo: 'COT-0042' } as never)
    mostrar()
    expect(await screen.findByText('COT-0042')).toHaveAttribute('href', '/cotizaciones/42')
  })
  it('no muestra referencia en una venta normal', async () => {
    vi.mocked(ventasApi.obtener).mockResolvedValue({ ...venta, cotizacionId: null, cotizacionCodigo: null } as never)
    mostrar()
    await screen.findByRole('heading', { name: 'Venta NV01-000009' })
    expect(screen.queryByText('Cotización de origen')).toBeNull()
  })
})
