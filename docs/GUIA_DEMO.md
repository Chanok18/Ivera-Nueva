# Guia de demostracion local de Ivera

## Objetivo y limites

Esta guia muestra flujos reales ya implementados sin usar datos de las
ferreterias. Utilice exclusivamente el entorno aislado del Sprint 16.1 para
operaciones que escriben datos. No ejecute reset, `TRUNCATE` ni limpieza durante
la reunion; no se necesitan para seguir este recorrido.

No incluya contrasenas, RUC reales, archivos Excel reales ni claves en la
presentacion. Los datos de muestra son sinteticos.

## Preparacion antes de la reunion

1. El responsable tecnico verifica que PostgreSQL aislado este saludable, el
   backend E2E ya autorizado escuche en `http://localhost:8081` y el frontend
   temporal abra en `http://localhost:5174`.
2. No reinicie esos servicios si ya estan funcionando.
3. Confirme que existen ADMIN, un vendedor asignado a una tienda y un almacen
   central en el entorno aislado. Las claves se consultan solo en la
   configuracion local autorizada, nunca en esta guia.
4. Antes de la reunion, mediante el modulo Productos y solo en la base aislada,
   prepare un producto de muestra con dos presentaciones activas y anote un
   codigo de barras para una de ellas. Ejemplo de configuracion: `Unidad` con
   factor 1 y `Ciento` con factor 100. El producto y codigos deben ser
   sinteticos y conocidos por quien presenta.
5. Verifique que el producto tiene stock en la tienda elegida y que el vendedor
   puede abrir caja. Si se va a mostrar un traslado, prepare stock adicional en
   el almacen central.

## Recorrido sugerido

### 1. Ingreso y estructura

1. Abra `http://localhost:5174/login` e inicie sesion con la cuenta ADMIN de
   demostracion.
2. En Inicio o Configuracion, explique que hay un almacen central y dos
   ubicaciones de tienda. Aclare que los nombres y RUC del entorno son
   sinteticos.
3. Explique los roles: ADMIN administra; VENDEDOR opera su tienda; ALMACENERO
   opera el almacen. El menu cambia por permisos.

Resultado esperado: se observa que el acceso no es igual para todos los
usuarios y que la ubicacion de trabajo determina la operacion.

### 2. Catalogo y presentaciones

1. Vaya a `Productos` (`/productos`).
2. Busque el producto preparado por codigo o nombre.
3. Abra su detalle y muestre las presentaciones activas, precio y factor.
4. Explique que solo se muestran unidad, docena, ciento, millar, metro, saco u
  otras formas si fueron configuradas para ese producto; Ivera no las inventa.

Resultado esperado: las presentaciones pertenecen al producto y convierten a
una unidad base para inventario y kardex.

### 3. Stock y kardex inicial

1. Vaya a `Inventario` (`/inventario`) y seleccione la ubicacion de la tienda.
2. Busque el producto y anote el stock en unidad base.
3. Vaya a `Movimientos` (`/movimientos`) y filtre por el producto o ubicacion.

Resultado esperado: se muestra stock por ubicacion y movimientos que explican
el saldo. El vendedor no ve ubicaciones que no tiene permitidas.

### 4. Venta y escaneo

1. Inicie sesion como vendedor de la tienda preparada.
2. Vaya a `Caja` (`/caja`) y abra una caja si no existe una abierta.
3. Vaya a `Ventas` (`/ventas`).
4. En `Escanear codigo de barras o buscar producto`, escriba el codigo de barras
   preparado y presione Enter. Esto simula un lector USB HID.
5. Muestre el aviso de presentacion, precio, factor y stock. Repita el codigo
   para mostrar que aumenta la cantidad en la misma linea.
6. Si hay lector fisico, pulse `Escanear` para recuperar foco y lea la etiqueta.
   El lector debe actuar como teclado y enviar Enter; no se asume otra
   integracion de hardware.
7. Complete un pago de demostracion y registre la venta. No use dinero ni datos
   reales.

Resultado esperado: el carrito acumula la presentacion correcta. El stock no
cambia al escanear; cambia al registrar la venta.

### 5. Confirmacion de stock y kardex

1. Regrese a `Inventario` y busque el mismo producto en la tienda.
2. Compare el saldo con la cifra anotada antes de la venta.
3. Regrese a `Movimientos` y ubique el movimiento de venta.

Resultado esperado: la disminucion se expresa en unidad base segun el factor
de la presentacion vendida y queda trazada en kardex.

### 6. Traslado desde almacen

1. Inicie sesion como ALMACENERO y abra `Movimientos`.
2. Cree un traslado en `/movimientos/traslados/nuevo` desde el almacen hacia
   una tienda, con una presentacion y cantidad disponibles.
3. Explique que al enviarlo la mercaderia queda en camino y no esta disponible
   para vender.
4. Inicie sesion como usuario de la tienda destino, abra `Movimientos` y reciba
   el traslado.
5. Vuelva a `Inventario` de la tienda para mostrar el nuevo saldo.

Resultado esperado: se entiende el envio, la recepcion y la trazabilidad entre
ubicaciones. La recepcion parcial no esta implementada.

### 7. Compras, caja y reportes

1. Como ALMACENERO, abra `Compras` (`/compras`) y muestre el registro de una
   compra y sus presentaciones. No es necesario crear otra compra si ya hay una
   adecuada para explicar el flujo.
2. Como VENDEDOR, abra `Caja` para mostrar apertura, efectivo esperado, pagos y
   cierre.
3. Como ADMIN, abra `Reportes` (`/reportes`) y muestre ventas por tienda,
   productos mas vendidos, traslados, compras, stock bajo y deudores segun los
   datos disponibles. Use filtros de fechas en hora de Lima.

Resultado esperado: los propietarios ven los modulos conectados sin afirmar que
la facturacion electronica, nube, impresion o exportacion ya existan.

## Mensajes clave para la reunion

- Ivera registra movimientos en unidad base aunque el operador venda por una
  presentacion distinta.
- Cada tienda mantiene operacion, caja y RUC separados; el almacen central se
  controla como otra ubicacion.
- Los datos de esta sesion son aislados y descartables. No son datos de Romel o
  TodoPernos.
- Las decisiones de negocio pendientes se anotan en
  `docs/REUNION_PROPIETARIOS.md`; no se cambian reglas durante la demostracion.

## Si algo no esta disponible

- Si no existe un codigo de barras preparado, muestre busqueda manual y explique
  que el escaneo requiere asociar el codigo a una presentacion activa.
- Si no hay lector fisico, la combinacion codigo + Enter es la simulacion valida.
- Si un modulo no tiene datos adecuados, muestre su pantalla y su alcance, sin
  inventar resultados ni crear operaciones improvisadas fuera del entorno
  aislado.
