# Requisitos de reunion 2026: auditoria de Ivera

## Alcance de esta auditoria

Este documento contrasta los acuerdos de la reunion con el codigo actual. Los
estados describen evidencia tecnica, no aprobacion del negocio:

- **IMPLEMENTADA**: existe en modelo, API y flujo utilizable.
- **PARCIAL**: existe una parte, pero no cubre el requisito completo.
- **AUSENTE**: no existe entidad, endpoint o flujo identificado.
- **PENDIENTE DE DECISION**: no debe construirse hasta acordar una regla de
  negocio, aunque pueda requerir desarrollo posterior.

No se modificaron codigo, migraciones, datos ni servicios durante Sprint 17.0.

## Matriz de requisitos y estado real

| Area | Requisito | Estado | Evidencia actual | Brecha o decision |
|---|---|---|---|---|
| Productos | Presentaciones por unidad, docena, ciento, millar, caja, kilo, metro u otro nombre | PARCIAL | `presentacion.nombre`, `factor` y precio propio; el formulario permite varias presentaciones. | Los nombres son libres, pero la unidad base solo admite `UNIDAD`, `KILO` o `METRO`; no es un catalogo configurable de unidades. |
| Productos | Unidad base coherente y conversion exacta | PARCIAL | Stock en unidad base; factor y cantidades `NUMERIC(14,3)`; validacion de enteros para `UNIDAD`. | Tres decimales pueden no bastar para todos los materiales; faltan reglas por nueva unidad configurable. |
| Ventas | Cambiar presentacion durante la venta | IMPLEMENTADA | El carrito permite seleccionar otra presentacion activa del mismo producto, confirma el cambio y conserva la cantidad escrita. | El descuento monetario actual se conserva con confirmacion; su politica comercial definitiva sigue pendiente. |
| Ventas | Conversion y stock consistentes | IMPLEMENTADA | `VentaService`, `MovimientoStockService`, `venta_detalle.factor/cantidad_base` y kardex. | Debe mantenerse como invariante al ampliar unidades, kits y cotizaciones. |
| Ventas | Vendedor busca, elige cantidad y presentacion | IMPLEMENTADA | `PuntoVenta.tsx`, `GET /api/productos`, carrito y `POST /api/ventas`. | El precio de venta lo toma el servidor; no se permite editarlo directamente. |
| Precios | Descuento porcentual por linea y venta | PARCIAL | La linea admite descuento porcentual y conserva su porcentaje en el snapshot de venta; el descuento monetario no se combina con porcentajes. | Ajuste general de venta deshabilitado hasta definir orden, IGV, redondeos, persistencia y autorizaciones. |
| Precios | Incremento porcentual y margen de ganancia | PARCIAL | La linea admite incremento porcentual comercial y guarda el snapshot; el costo no se expone en POS. | Falta acordar margen (ultimo costo, promedio o lote), visibilidad y si condiciona autorizaciones. |
| Cotizaciones | Cotizaciones y conversion a venta | PARCIAL | Cotizaciones en soles con borradores, emision, anulacion, presentaciones, ajustes y snapshots; ADMIN/VENDEDOR. | Pendientes: conversion a venta, vigencia y aprobaciones comerciales, integracion backend y E2E. No reserva ni descuenta stock. |
| Moneda | Soles y dolares con tipo de cambio | PENDIENTE DE DECISION | Todos los montos actuales son monetarios sin moneda; UI usa `S/`. | Confirmar moneda de catalogo, cotizacion, venta, pago, caja, tipo de cambio, fuente y fecha de fijacion. |
| Busqueda | Nombre, codigo y palabras parciales | IMPLEMENTADA | `GET /api/productos` divide tokens, ignora mayusculas/tildes y exige que cada palabra coincida en codigo, nombre o marca; prioriza codigo exacto y prefijo de nombre. | No busca descripcion/categoria ni usa sinonimos fuera de las abreviaturas que coinciden con texto real. |
| Disponibilidad | Nombre, imagen, presentacion, precio y disponibilidad | IMPLEMENTADA | POS muestra nombre, codigo, imagen, presentaciones, precio y stock local; ADMIN ve existencias fisicas positivas de otras ubicaciones. | El modelo no tiene stock reservado ni disponible separado. |
| Disponibilidad | Stock de otras ubicaciones sin venta cruzada | IMPLEMENTADA | `GET /api/inventario/stock` limita no-ADMIN a su ubicacion; el POS solo consulta otras ubicaciones para ADMIN y no envia ventas ni traslados. | La visibilidad externa de VENDEDOR/ALMACENERO sigue siendo una regla de negocio no aprobada. |
| Precios | Historial y consulta de precios anteriores | IMPLEMENTADA | `historial_precio_presentacion` registra precio anterior/nuevo, producto, presentacion, fecha y usuario; el formulario de producto lo consulta. | Empieza con la migracion 17.3; no inventa cambios anteriores ni incluye motivo/fecha efectiva comercial. |
| Kits | Venta de conjuntos con calculo y stock de componentes | AUSENTE | No hay `kit`, detalle ni flujo de explosion de componentes. | Definir si el kit es vendible, armado previo o receta virtual, su precio y politica de faltantes. |
| Diseno | Amarillo, logo oficial, legibilidad y control de fuente | PARCIAL | Tokens CSS centralizados y tipografia Inter/JetBrains Mono. | La marca actual es naranja, logo textual TodoPernos, sin logo oficial ni control de tamano. |
| Diseno | Modo claro y oscuro | AUSENTE | Un unico tema claro en `src/index.css`; no hay preferencia persistida. | Definir paleta, contraste, valor inicial y alcance por usuario/dispositivo. |
| Roles | ADMIN, VENDEDOR y ALMACENERO | IMPLEMENTADA | Enum, restricciones DB y permisos frontend/backend. | `DOCUMENTACION.md` aun menciona dos roles: es una contradiccion documental que debe resolverse sin cambiar roles. |
| Arquitectura | Base central, empresas/RUC y ubicaciones separadas | IMPLEMENTADA | `empresa`, `ubicacion`, permisos por ubicacion, compra/venta asociadas a empresa. | No hay despliegue cloud u operacion offline validados. |
| Escaner | Priorizar productos y ventas; escaner despues | IMPLEMENTADA | HID y cola ya existen en POS. | No ampliar hardware o conteos por escaner hasta estabilizar catalogo, precios y ventas. |
| Operacion | No confundir respaldo con modo offline | PENDIENTE DE DECISION | No hay modo offline ni respaldos automaticos implementados. | Definir RPO/RTO, responsable de respaldo y proceso separado para cortes de internet. |

## Componentes, servicios y pruebas involucrados

| Dominio | Backend actual | Frontend actual | Cobertura o restriccion relevante |
|---|---|---|---|
| Catalogo/presentaciones | `Producto`, `Presentacion`, `ProductoService`, `ProductoController` | `Productos.tsx`, `FormularioProducto.tsx`, `api/catalogo.ts` | `ProductoServiceTest`, `CatalogoIntegrationTest`; codigo de barras unico por presentacion. |
| Ventas/precios | `VentaService`, `Venta`, `VentaDetalle`, `VentaController` | `PuntoVenta.tsx`, `logica/carrito.ts`, `DetalleVenta.tsx` | `VentaServiceTest`, `VentaIntegrationTest`, E2E de flujo completo. |
| Cotizaciones | `CotizacionService`, `Cotizacion`, `CotizacionDetalle`, `CotizacionController` | `FormularioCotizacion.tsx`, `DetalleCotizacion.tsx`, `Cotizaciones.tsx` | `CotizacionServiceTest` (8); frontend (3) para error/reintento. V5 creada, no aplicada; sin integración ni E2E. |
| Stock/conversion | `MovimientoStockService`, `Stock`, `MovimientoInventario` | `Inventario.tsx`, `Movimientos.tsx`, `EditorLineas.tsx` | Bloqueo pesimista, chequeo de no negativo, `MovimientoStockServiceTest`, pruebas de concurrencia. |
| Disponibilidad | `InventarioController`/`InventarioService` | `Productos.tsx`, `PuntoVenta.tsx`, `api/inventario.ts` | Los permisos de ubicacion impiden operar fuera de la ubicacion propia. |
| Escaneo | `GET /api/productos/codigo-barras/{codigoBarras}` | `PuntoVenta.tsx`, `logica/escaneo.ts` | Vitest de cola/escaneo y Playwright; no integra hardware propietario. |
| Roles/empresas | `SecurityConfig`, `AccesoUbicacionService`, `Empresa`, `Ubicacion` | `auth/permisos.ts`, selector de ubicacion | Tres roles actuales son la fuente de verdad. |
| Diseno | No aplica | `src/index.css`, `Logo.tsx`, componentes UI | Tokens de color centralizados; no hay tema oscuro ni preferencias. |

## Preguntas pendientes de negocio

### Unidades, conversiones y stock

1. Cuales son todas las unidades base admitidas y cuales permiten fracciones?
2. Cual es la precision maxima aceptable por unidad y como se redondea en
   compra, venta, traslado y kardex?
3. Puede una presentacion cambiar de factor despues de haber tenido movimientos,
   o debe versionarse/desactivarse y crear otra?
4. Al cambiar una presentacion en el carrito, se conserva el descuento y precio
   comercial o se recalculan desde la lista vigente?

### Precios, descuentos y cotizaciones

1. Quien puede aplicar descuento o incremento y cuales son los limites por rol,
   producto, cliente y monto?
2. Se puede combinar descuento monetario, porcentual, incremento y descuento de
   venta? Que orden de calculo y redondeo se aplican?
3. El margen debe calcularse con ultimo costo, costo promedio, costo por lote u
   otro criterio? Es solo visible o condiciona autorizaciones?
4. Una cotizacion reserva stock? Puede vencer, editarse, aprobarse, convertirse
   parcialmente o usarse varias veces?

### Monedas y operaciones entre ubicaciones

1. Que documentos, precios y pagos pueden usar dolares? La caja se cuadra por
   moneda o se convierte a soles?
2. De donde proviene el tipo de cambio, quien lo registra y en que instante se
   congela para cotizacion, venta, pago y reporte?
3. Que usuarios pueden consultar stock de otras ubicaciones? Debe mostrarse solo
   disponibilidad o tambien solicitar un traslado?
4. Como se autoriza una venta cuando el producto esta solo en otra ubicacion?
   No se debe descontar ese stock sin traslado u operacion aprobada.

### Kits, diseno y operacion

1. Un kit tiene stock propio, se arma al vender o solo descuenta sus componentes?
   Puede incluir cantidades fraccionarias y productos alternativos?
2. Cual es el precio de un kit: suma de componentes, lista propia o promocion?
3. Cual es el amarillo oficial, que variantes de logo se entregaran y que
   contraste minimo se acepta? La fuente tipo "Henry" debe ser identificada y
   licenciada antes de instalarla.
4. El modo oscuro y el tamano de fuente se guardan por usuario o dispositivo?
5. Que respaldo se requiere, con que frecuencia, donde se custodia y quien
   autoriza una restauracion? Esto no habilita funcionamiento offline.

## Riesgos a controlar antes de implementar

- Cambiar factores o unidades base sin versionado puede reinterpretar historico,
  inventario y precio de ventas anteriores.
- Descuentos, incrementos y tipo de cambio deben quedar en snapshots de
  documento; recalcularlos desde precios vigentes alteraria historia y caja.
- Un ajuste general no debe registrarse mientras no se acuerden su orden frente a
  ajustes de linea, su tratamiento de IGV, redondeo, caja, reportes y permisos.
- Los kits requieren descontar componentes dentro de la misma transaccion y en
  el mismo orden de bloqueo que las ventas, para no sobregirar stock ni crear
  deadlocks.
- La disponibilidad de otra tienda es informativa; no debe convertirse en venta
  cruzada ni reserva implícita.
- La busqueda tolerante puede devolver falsos positivos. Debe ser explicable,
  medible y no sustituir codigo exacto ni codigo de barras.
- El alcance multimoneda afecta ventas, pagos, caja, reportes, deudas y
  anulaciones; no debe agregarse como solo un simbolo en pantalla.
- `DOCUMENTACION.md` conserva alcance, roles, nube, IA y diseno anteriores;
  seguirlo literalmente contradice codigo y acuerdos recientes. No se modifico
  por restriccion, pero requiere una decision editorial posterior.
