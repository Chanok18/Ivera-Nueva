# Reunion con propietarios: Ivera

## Proposito

Ivera es el sistema de gestion propuesto para las ferreterias Romel y
TodoPernos, con un almacen central compartido. Reune catalogo, existencias,
compras, traslados, ventas, caja y reportes en un mismo sistema para que cada
movimiento deje trazabilidad.

Esta reunion no es una aprobacion de despliegue. Su objetivo es validar que las
reglas configuradas representan la operacion real y acordar lo que falta antes
de usar el sistema con datos del negocio.

## Problemas que busca resolver

- Conocer el stock de cada tienda y del almacen central sin llevar saldos por
  separado en hojas distintas.
- Evitar ventas por encima de las existencias y dejar el movimiento visible en
  kardex.
- Registrar una misma mercaderia por unidad, ciento, millar, metro, kilo u otra
  presentacion, sin perder su equivalencia en unidad base.
- Separar la operacion y caja de cada tienda cuando pertenecen a RUC distintos.
- Dar seguimiento a compras, traslados, ventas al credito, cobros y stock bajo.

## Estado implementado para mostrar

| Modulo | Estado verificable | Alcance para la demostracion |
|---|---|---|
| Acceso y usuarios | Implementado con roles ADMIN, VENDEDOR y ALMACENERO, y permisos por ubicacion. | Mostrar que cada rol ve solo las acciones permitidas. |
| Catalogo y presentaciones | Implementado. Producto con presentaciones activas, precio, factor, foto y codigo de barras opcional por presentacion. | Mostrar solo las presentaciones configuradas para el producto elegido. |
| Inventario y kardex | Implementado por ubicacion, con stock minimo, ajustes con motivo y movimientos trazables. | Mostrar saldo y kardex antes/despues de una venta o traslado. |
| Compras y proveedores | Implementado con comprobante, presentaciones y entrada a una ubicacion. | Mostrar el flujo y una compra de ejemplo si ya existe en el entorno aislado. |
| Traslados | Implementado en dos pasos: envio desde origen y recepcion en destino. | Explicar que la mercaderia queda en camino hasta recibirla. |
| Ventas, caja y clientes | Implementado: contado, credito, pagos, vuelto, cierre de caja, deudas y abonos. | Registrar una venta en el entorno aislado. |
| Reportes | Implementado: ventas, productos mas vendidos, traslados, compras, stock bajo y deudores, segun rol. | Mostrar datos de ejemplo y filtros de fecha. |
| Escaner USB | Implementado para lectores que actuan como teclado y envian Enter. | Usar ingreso manual como simulacion o un lector HID disponible. |

## Flujo de venta con escaner

1. El vendedor abre su caja en la tienda asignada.
2. El lector USB escribe el codigo de barras y envia Enter en el campo de
   escaneo del POS.
3. Ivera identifica la presentacion activa asociada: por ejemplo, unidad,
   ciento o rollo, segun lo configurado en ese producto.
4. El carrito agrega esa presentacion con su precio y factor. Una lectura
   repetida incrementa la cantidad de la misma linea.
5. Escanear no descuenta stock. El stock se descuenta cuando la venta se
   registra correctamente y queda un movimiento en kardex.
6. Un codigo no registrado, una presentacion inactiva o un error de red se
   muestra al operador; la siguiente lectura puede continuar.

## Dos tiendas, RUC y almacen compartido

- Cada tienda esta asociada a una empresa y por ello opera con su propio RUC,
  caja y serie de nota de venta.
- El almacen central es una ubicacion compartida desde la que se reciben
  compras y se envian traslados a las tiendas.
- Un traslado descuenta el origen al enviarse y suma el destino al recibirse.
  Mientras esta en camino no se puede vender en ninguna ubicacion.
- Los datos actuales de demostracion usan nombres y RUC sinteticos
  (`Ferreteria El Constructor` y `Ferreteria La Llave`). Sirven para explicar
  la separacion tecnica, pero no deben presentarse como datos reales de Romel o
  TodoPernos. La carga definitiva requiere aprobacion y migracion controlada.

El sistema hoy funciona localmente. El acceso compartido por internet o nube no
esta desplegado ni validado; por tanto, no debe presentarse como una capacidad
operativa actual.

## Pendientes conocidos

- Facturacion electronica, envio a SUNAT, certificado digital, clave SOL y
  proveedor OSE/PSE no estan integrados. La Fase 1 emite notas de venta.
- No hay despliegue cloud, respaldo automatico, exportacion de reportes a Excel
  o PDF, auditoria completa de cambios de precios ni recepcion parcial de
  traslados.
- Devoluciones con caja cerrada requeriran nota de credito en una fase futura.
- El comportamiento con un modelo fisico concreto de escaner e impresora aun
  debe probarse en el local.
- Iverita y la aplicacion movil no forman parte del alcance actual.

## Preguntas para decidir con los propietarios

### Operacion y permisos

- Que acciones puede realizar cada rol: descuentos, anulaciones, ajustes,
  creacion de productos, precios y cierres de caja?
- Quien aprueba un traslado, un ajuste de inventario y una anulacion? Se
  necesita una segunda aprobacion o basta el rol actual?
- Los vendedores deben ver solo su tienda, o tambien stock consultable del
  almacen y de la otra tienda?

### Catalogo, presentaciones y stock

- Cuales son las presentaciones reales por familia: unidad, docena, ciento,
  millar, metro, rollo, kilo, saco, galon u otras?
- Cuales son sus equivalencias y precios? Quien autoriza cambiar precio o
  desactivar una presentacion?
- Se venderan fracciones de kilo o metro, y con que precision?
- Que politica se aplicara para mercaderia perdida, rota, vencida o diferencias
  al recibir un traslado?

### Equipos e integraciones

- Que modelos de lectores USB se usaran y si envian Enter, tabulador, prefijo o
  sufijo despues del codigo?
- Que impresora y formato de comprobante se necesitan? Requiere ticket,
  etiqueta, hoja A4 o todos?
- Como se migrara el Excel: responsable, archivo fuente, limpieza de codigos,
  precios, stock inicial y fecha de corte?
- Que comprobantes electronicos se requieren por RUC y en que fecha? Quien
  entregara clave SOL, certificado y contrato OSE/PSE?

### Continuidad y futuro

- Que conexion a internet existe en cada local? Como se debe operar ante un
  corte y quien conciliara las operaciones pendientes?
- Quien sera responsable de usuarios, permisos, respaldo, restauracion y
  soporte del sistema?
- Que informacion debe ver una futura aplicacion movil y que operaciones nunca
  debe permitir?
- Que tareas concretas esperan de Iverita? Esas ideas se recopilaran, pero no
  estan implementadas ni comprometidas en esta etapa.

## Decisiones necesarias antes de desplegar

1. Validar roles, aprobaciones, visibilidad entre ubicaciones y politica de
   descuentos/anulaciones.
2. Aprobar catalogo inicial, equivalencias, precios, stock inicial y responsable
   de migrar los datos desde Excel.
3. Definir RUC, series, tipos de comprobante e integracion electronica requerida
   por cada tienda.
4. Confirmar lectores, impresoras, conectividad, equipos y procedimiento ante
   corte de internet.
5. Designar responsables de administracion, respaldo, soporte y autorizacion de
   cambios.
6. Acordar el alcance y fecha de un piloto local antes de cualquier despliegue.
