package com.ferreteria.dto.cotizaciones;
import com.ferreteria.entity.*;
import com.ferreteria.entity.enums.EstadoCotizacion;
import com.ferreteria.entity.enums.UnidadBase;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
public record CotizacionResponse(Long id, String codigo, Long ubicacionId, String ubicacionNombre, Long clienteId,
 String clienteNombre, String usuario, OffsetDateTime fecha, EstadoCotizacion estado, String moneda, String observacion,
 BigDecimal subtotal, BigDecimal igv, BigDecimal descuento, BigDecimal total, List<Detalle> detalles) {
 public record Detalle(Long productoId, Long presentacionId, String descripcion, BigDecimal cantidad, BigDecimal factor,
  BigDecimal cantidadBase, UnidadBase unidadBase, BigDecimal precioUnitario, BigDecimal descuento, BigDecimal ajustePorcentaje, BigDecimal subtotal) {}
 public static CotizacionResponse resumen(Cotizacion c) { return desde(c, List.of()); }
 public static CotizacionResponse completa(Cotizacion c) { return desde(c, c.getDetalles().stream().map(d -> new Detalle(d.getProducto().getId(), d.getPresentacion().getId(), d.getDescripcion(), d.getCantidad(), d.getFactor(), d.getCantidadBase(), d.getProducto().getUnidadBase(), d.getPrecioUnitario(), d.getDescuento(), d.getAjustePorcentaje(), d.getSubtotal())).toList()); }
 private static CotizacionResponse desde(Cotizacion c, List<Detalle> detalles) { return new CotizacionResponse(c.getId(), c.getCodigo(), c.getUbicacion().getId(), c.getUbicacion().getNombre(), c.getCliente().getId(), c.getCliente().getNombre(), c.getUsuario().getUsername(), c.getFecha(), c.getEstado(), c.getMoneda(), c.getObservacion(), c.getSubtotal(), c.getIgv(), c.getDescuento(), c.getTotal(), detalles); }
}
