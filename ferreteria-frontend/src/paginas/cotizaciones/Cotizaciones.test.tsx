import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { cotizacionesApi } from '@/api/ventas'
import Cotizaciones from './Cotizaciones'

vi.mock('@/api/ventas', () => ({ cotizacionesApi: { listar: vi.fn() } }))
vi.mock('@/contexto/ubicacion', () => ({ useUbicacion: () => ({ seleccionadaId: 1 }) }))
const base = { ubicacionId: 1, ubicacionNombre: 'Tienda', clienteId: 1, clienteNombre: 'Cliente', usuario: 'vendedor', fecha: '2026-01-01T10:00:00Z', moneda: 'PEN', observacion: null, subtotal: 10, igv: 1.8, descuento: 0, total: 11.8, detalles: [] }
describe('Cotizaciones: trazabilidad', () => {
  it('distingue convertida, emitida pendiente, borrador y anulada sin acciones de conversion', async () => {
    vi.mocked(cotizacionesApi.listar).mockResolvedValue({ contenido: [
      { ...base, id: 1, codigo: 'COT-CONV', estado: 'EMITIDA', venta: { id: 9, numeroDocumento: 'NV01-9', fecha: base.fecha, total: 11.8 } },
      { ...base, id: 2, codigo: 'COT-PEND', estado: 'EMITIDA', venta: null }, { ...base, id: 3, codigo: 'COT-BOR', estado: 'BORRADOR', venta: null }, { ...base, id: 4, codigo: 'COT-ANU', estado: 'ANULADA', venta: null }], pagina: 0, tamano: 50, totalElementos: 4, totalPaginas: 1 } as never)
    render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><Cotizaciones /></MemoryRouter></QueryClientProvider>)
    expect(await screen.findByText(/Convertida en venta/)).toBeInTheDocument()
    expect(screen.getByText(/EMITIDA/)).toBeInTheDocument()
    expect(screen.getByText(/BORRADOR/)).toBeInTheDocument()
    expect(screen.getByText(/ANULADA/)).toBeInTheDocument()
    expect(screen.queryByText('Pasar al POS')).toBeNull()
  })
})
