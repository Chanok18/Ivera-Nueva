# Plan tecnico de mejoras Ivera: Sprints 17.1 a 17.6

## Arquitectura actual reutilizable

Ivera ya separa catalogo, ubicaciones, ventas y stock de forma apropiada para
crecer sin reemplazar el nucleo:

- `Producto` tiene una `UnidadBase` y varias `Presentacion` con factor, precio y
  codigo de barras opcional.
- `MovimientoStockService` es el unico escritor de stock: agrupa productos,
  bloquea filas ordenadas, impide negativos y registra kardex en la misma
  transaccion que la compra, venta, ajuste o traslado.
- `VentaService` toma precio/factor desde la presentacion y almacena snapshots
  de descripcion, factor, cantidad base, precio y descuento en `venta_detalle`.
- `Empresa` y `Ubicacion` separan RUC y operacion; `AccesoUbicacionService`
  mantiene el alcance por rol y ubicacion.
- React usa contratos tipados, React Query y logica de carrito en centimos para
  anticipar el calculo del servidor.

La propuesta conserva estos limites. Las extensiones de precio, moneda, kit o
cotizacion nunca deben actualizar `stock` directamente ni recalcular documentos
historicos con datos actuales.

## Principios de diseno propuestos

1. Mantener stock y kardex solo en unidad base y aplicar conversiones con
   `BigDecimal`/precision acordada en servidor.
2. Versionar datos comerciales que puedan cambiar: precio, regla aplicada,
   moneda y tipo de cambio deben quedar congelados en cada documento.
3. Separar disponibilidad informativa de reserva, traslado y venta. Una consulta
   de otra ubicacion no autoriza descontar su stock.
4. Reutilizar los tres roles actuales y acordar permisos por accion antes de
   abrir descuentos, recargos, cotizaciones o costos.
5. Hacer migraciones aditivas, con compatibilidad de lectura y plan de datos;
   no reutilizar o reinterpretar columnas historicas.
6. Priorizar catalogo y venta. El escaner HID queda como consumidor del mismo
   flujo de busqueda y presentaciones, sin extender hardware hasta estabilizar
   esos contratos.

## Modelo objetivo, sujeto a aprobacion

| Necesidad | Extension propuesta | Invariantes |
|---|---|---|
| Unidades configurables | Catalogo de unidades y referencia de unidad base, o una extension controlada del enum despues de acordar alcance. | Cada producto tiene una sola unidad base; factores positivos y conversion a base con precision definida. |
| Historial de precios | Version de precio de presentacion con vigencia, autor, motivo y estado. | La venta conserva su snapshot aunque cambie la lista. |
| Ajustes comerciales | Regla explicita por linea/venta: porcentaje o monto, tipo descuento/recargo y autorizacion. | El subtotal se calcula una vez, se redondea con politica acordada y se audita. |
| Cotizacion | Cabecera/detalle con estado, vigencia, moneda, tipo de cambio y snapshot comercial. | No mueve stock salvo una futura reserva aprobada; conversion a venta es transaccional y trazable. |
| Moneda | Moneda de documento/pago y tipo de cambio con fuente, fecha y tasa fijadas. | Caja, deuda, vuelto y reportes conservan moneda y equivalencia; no hay conversion implicita. |
| Kits | Kit y componentes; la venta expande componentes antes de invocar stock. | El kit no descuenta una fila ficticia; todos los componentes se validan/bloquean juntos. |
| Busqueda | Indice de texto/acento y estrategia de tokens/sinonimos aprobados. | Coincidencia exacta de codigo y barras sigue siendo determinista; resultados explicables y paginados. |
| Tema/accesibilidad | Tokens semanticos claro/oscuro, preferencia y escala de texto. | Contraste probado; logo/fuente se incorporan solo con archivo, licencia y especificacion oficial. |

## Sprints propuestos

### Sprint 17.1: Contratos de catalogo y unidades

**Estado al 18 de octubre de 2026:** implementado parcialmente dentro del
alcance confirmado. Se incorporo el cambio confirmado de presentacion en el
carrito y la validacion de fracciones comerciales que convierten exactamente a
unidades base enteras. La ampliacion de unidades base configurables se mantiene
pendiente de decisiones de negocio y no requirio migracion en este sprint.

**Dependencia:** aprobacion de unidades, fracciones, precision y politica para
factor de presentacion historica.

**Alcance propuesto:** documentar contrato final y, tras autorizacion, ampliar el
modelo de unidades de forma aditiva; conservar productos actuales y sus factores;
mejorar el selector de presentacion dentro del carrito sin alterar stock.

**Criterios de aceptacion:**

- Cada producto tiene unidad base valida y presentaciones con factor positivo.
- Las conversiones de unidad, kilo, metro y nuevas unidades aprobadas dan el
  mismo resultado en frontend, backend, compra, traslado y venta.
- Cambiar presentacion en el carrito es explicito y conserva o recalcula reglas
  comerciales conforme a la decision aprobada.
- Hay migracion ensayada, pruebas de redondeo/limites y regresion de kardex.

### Sprint 17.2: Busqueda y disponibilidad segura

**Estado al 18 de octubre de 2026:** implementado sin migraciones. La busqueda
usa tokens sin mayusculas ni tildes y disponibilidad externa solo para ADMIN,
reutilizando los contratos actuales. Las pruebas de integracion y E2E quedan
pendientes hasta recuperar Docker Desktop y el entorno aislado.

**Dependencia:** contrato de catalogo del Sprint 17.1 y decision de visibilidad
por rol.

**Alcance propuesto:** busqueda tokenizada/tolerante a abreviaturas aprobadas,
con soporte de acentos; resultado de producto orientado a venta con imagen,
presentaciones, precio y disponibilidad de la tienda actual; consulta controlada
de otras ubicaciones.

**Criterios de aceptacion:**

- Codigo y barra exactos conservan prioridad y comportamiento actual.
- Casos acordados como `pe gal` encuentran candidatos esperados sin resultados
  masivos o ambiguos sin explicar.
- El POS distingue stock local y disponibilidad externa informativa.
- Ninguna ruta permite vender o descontar stock de otra ubicacion sin traslado
  autorizado; permisos y pruebas de aislamiento lo demuestran.

### Sprint 17.3: Precios, descuentos e incrementos auditables

**Estado al 25 de octubre de 2026:** implementacion parcial segura. El historial
de precios por presentacion y los ajustes porcentuales por linea estan listos en
codigo y migracion no aplicada. El ajuste general, autorizaciones comerciales y
margen quedan deshabilitados hasta contar con sus reglas.

**Dependencia:** politica de precios, limites/roles y criterio de margen.

**Alcance propuesto:** historial de precios por presentacion; reglas de
descuento/recargo porcentual y monto por linea y por venta; visualizacion de
margen segun costo acordado, sin convertirlo en precio automaticamente.

**Criterios de aceptacion:**

- Se consulta precio anterior con vigencia, usuario y motivo.
- Toda venta conserva precio base, ajuste, regla aplicada y total final.
- Limites, autorizaciones, combinacion y orden de redondeo se validan en el
  backend, no solo en UI.
- Pruebas cubren anulacion, caja, fiado, concurrencia y totales con ajustes.

**Decision implementada:** un descuento porcentual se expresa negativo y un
incremento positivo; se calcula sobre `ROUND(cantidad x precio, 2)` y luego se
redondea a dos decimales HALF_UP. No se puede combinar con el descuento monetario
existente. El backend conserva precio, porcentaje, descuento resultante y subtotal
en el detalle de la venta.

### Sprint 17.4: Cotizaciones y funcionalidades posteriores

#### Sprint 17.4A: Cotizaciones en soles

**Estado al 26 de octubre de 2026:** implementado y validado con pruebas
unitarias/backend y frontend. Se crearon `V4` y `V5`, pero no se aplicaron;
PostgreSQL, integración y Playwright siguen pendientes.

La cotización es independiente de venta: ADMIN y VENDEDOR crean, consultan y
editan borradores, y el backend controla `BORRADOR`, `EMITIDA` y `ANULADA`.
No reserva ni descuenta stock. Sus detalles congelan precio, factor, cantidad
base y ajustes; editar la misma presentación conserva snapshots y una nueva usa
catálogo vigente. La UI muestra error y reintento de catálogo sin perder cambios
locales ni repetir consultas de inicialización.

**Pendiente:** conversión trazable a venta, vigencia/aprobaciones comerciales,
validación PostgreSQL de V4/V5, integración backend, E2E y multimoneda.

#### Sprint 17.4B: Conversion a venta y multimoneda, sujeto a aprobacion

**Dependencia:** Sprint 17.3 y respuestas sobre vigencia, reserva, moneda, tasa,
caja y reportes.

**Alcance propuesto:** cotizacion con detalles versionados y conversion trazable
a venta; soporte multimoneda solo si se define su alcance contable/operativo.

**Criterios de aceptacion:**

- Una cotizacion no altera stock sin una regla de reserva aprobada.
- La conversion a venta conserva referencias y evita duplicar cantidades por
  reintentos.
- Moneda y tipo de cambio quedan congelados por documento/pago y se reflejan en
  caja, deuda, vuelto, anulacion y reportes según la politica aprobada.
- Si la multimoneda no se aprueba, este sprint se limita a cotizaciones en soles
  y el requisito queda documentado como diferido.

### Sprint 17.5: Kits y conjuntos vendibles

**Dependencia:** definicion comercial del kit y contratos de precio del Sprint
17.3; si aplica, cotizacion del Sprint 17.4.

**Alcance propuesto:** catalogo de kits, componentes, precio aprobado y
expansion en venta para descontar componentes reales.

**Criterios de aceptacion:**

- El sistema calcula disponibilidad como minimo de componentes segun sus
  cantidades base.
- Venta, anulacion y kardex trazan cada componente del kit en una transaccion.
- Faltantes, componentes inactivos y concurrencia no dejan stock negativo ni
  documentos parciales.
- El precio de kit y el precio de componentes usados quedan identificables en el
  documento segun la politica aprobada.

### Sprint 17.6: Identidad visual, accesibilidad y piloto funcional

**Dependencia:** logo, paleta amarilla, fuente autorizada y definicion de
preferencia de tema; flujos 17.1 a 17.5 aprobados.

**Alcance propuesto:** sustituir tokens de marca de forma centralizada, tema
claro/oscuro, escala de texto, contraste y aplicacion del logo oficial; prueba
integrada de catalogo, busqueda, precio, cotizacion/kits aprobados y venta.

**Criterios de aceptacion:**

- No se instala una fuente ni logo sin activos y licencia aprobados.
- Claro/oscuro y escala de texto son utilizables por teclado y cumplen contraste
acordado en pantallas de POS, tablas y errores.
- E2E aislado valida conversiones, descuentos/recargos, disponibilidad local,
precio historico y las funciones aprobadas de cotizacion/kits.
- El escaner HID sigue funcionando en el POS; no se amplian integraciones de
hardware sin prueba piloto del dispositivo real.

## Secuencia y puntos de control

`17.1 -> 17.2 -> 17.3 -> 17.4 -> 17.5 -> 17.6` es la secuencia propuesta.
Los Sprints 17.4 y 17.5 no comienzan sin sus decisiones de negocio; si una se
difere, se conserva el orden de dependencias y se adelantan solo tareas que no
alteren contratos comerciales. Cada sprint debe iniciar con migracion revisada,
contratos API, matriz de permisos y casos de concurrencia antes de editar UI.

## Riesgos arquitectonicos prioritarios

1. **Historico comercial:** actualizar el precio actual no debe cambiar ventas,
   cotizaciones ni margen ya emitidos.
2. **Precision:** el limite actual de tres decimales debe validarse antes de
   admitir unidades nuevas o conversiones encadenadas.
3. **Concurrencia:** kits, conversion de cotizacion y venta deben reutilizar el
   orden de bloqueo de `MovimientoStockService`.
4. **Caja y moneda:** mezclar monedas sin una regla de conversion/cierre vuelve
   ambiguos efectivo esperado, vuelto, fiado y reportes.
5. **Seguridad de ubicacion:** exponer stock no autoriza venta cruzada,
   transferencia automatica ni reserva.
6. **Documentacion contradictoria:** `DOCUMENTACION.md` debe reconciliarse en un
   sprint editorial autorizado antes de usarla como especificacion unica.
