# Progreso de Ivera

## Sprint 16.2: Escaneo por presentacion

Estado: completado y validado el 18 de octubre de 2026.

### Entregado

- El POS busca una presentacion activa por su codigo de barras mediante
  `GET /api/productos/codigo-barras/{codigo}`.
- La respuesta de escaneo conserva la presentacion, el factor de unidades, el
  precio y el stock disponible antes de agregar la linea al carrito.
- Un codigo inexistente muestra un mensaje visible; una presentacion o producto
  inactivo es rechazado por la API.
- Los escaneos se serializan para evitar solicitudes concurrentes. Escanear o
  agregar al carrito no descuenta inventario: el descuento ocurre al registrar
  la venta mediante el flujo existente.
- Se agregaron regresiones backend, unitarias frontend y E2E para una
  presentacion `Caja x100` con factor `100`.

### Aislamiento de pruebas

- PostgreSQL E2E: contenedor `ivera-s16-test-postgres`, base
  `ivera_sprint16_1_test`, usuario `ivera_s16_test_app` y publicacion local
  `127.0.0.1:5545`.
- Backend E2E: `http://localhost:8081`, con `E2E_RESET_SCENARIO=true` requerido
  para reiniciar el escenario y validaciones de base, usuario, puerto y URL
  antes de cualquier limpieza.
- Frontend temporal de Playwright: `http://localhost:5174`. Playwright requiere
  `E2E_ALLOW_WRITE=true` y restringe las URLs autorizadas.
- No se usaron la base demo, produccion, Railway ni otros proyectos.

### Evidencia de validacion

| Comando | Resultado |
|---|---|
| `./mvnw.cmd test` | 133 pruebas backend aprobadas contra la base aislada. |
| `./mvnw.cmd -q -DskipTests test-compile` | Correcto. |
| `npm run lint` | Correcto. |
| `npm test` | 10 y 55 pruebas frontend aprobadas. |
| `npm run build` | Correcto. |
| `npm run e2e` | 16 aprobadas, 0 fallidas en Chromium. |

Durante la primera ejecucion E2E hubo una sola falla de asercion: la prueba
esperaba `codigo` sin tilde, pero la interfaz mostraba correctamente `código`.
Se corrigio la expectativa; la repeticion completa aprobo 16 de 16 pruebas.

### Archivos principales modificados

- `ferreteria-backend/backend/src/main/java/com/ferreteria/service/ProductoService.java`
- `ferreteria-backend/backend/src/test/java/com/ferreteria/integracion/CatalogoIntegrationTest.java`
- `ferreteria-frontend/src/logica/escaneo.ts`
- `ferreteria-frontend/src/logica/escaneo.test.ts`
- `ferreteria-frontend/src/paginas/ventas/PuntoVenta.tsx`
- `ferreteria-frontend/e2e/02-flujo-completo.spec.ts`

### Recomendacion al cierre del Sprint 16.2

Priorizar la integracion con escaner fisico: mantener foco en el campo de
escaneo, controlar lecturas repetidas y brindar retroalimentacion inmediata.
Agregar regresiones para codigos duplicados, conectividad y los requerimientos
de negocio pendientes que se definan fuera de los flujos actuales.

## Sprint 16.3: Integracion de escaner fisico

Estado: completado y validado el 18 de octubre de 2026.

### Entregado

- El campo del POS se identifica como `Escanear codigo de barras o buscar
  producto`, conserva la busqueda manual y recibe Enter de lectores USB HID.
- Se agrego un boton `Escanear` para recuperar el foco del campo sin depender
  del modelo de lector. Tras cada respuesta el foco vuelve al campo.
- Las lecturas se encolan y consultan una a la vez. Una lectura que llegue
  mientras la anterior consulta la API no se pierde; se procesa en orden.
- Dos lecturas de la misma presentacion incrementan la cantidad de la linea
  existente. Presentaciones distintas permanecen en lineas distintas; sus
  factores y unidades base los sigue calculando el carrito existente.
- La interfaz muestra estado de lectura, exito con presentacion/precio/stock y
  errores de codigo o red. El error de una lectura no bloquea la siguiente.
- No se modificaron contratos de API, reglas de stock ni de cobro: escanear no
  descuenta inventario y el boton de cobro queda deshabilitado durante la
  mutacion existente, evitando registros por doble clic.
- Se agregaron pruebas de cola serial y error de red; la regresion E2E verifica
  dos lecturas consecutivas, cantidad acumulada y stock actualizado despues de
  registrar la venta. La prueba de integracion backend cubre el intento de
  reutilizar un codigo de barras en otra presentacion.

### Como probar un lector USB

1. Abra una caja y vaya a `Ventas`.
2. Haga clic en `Escanear` si el cursor no esta en el campo de escaneo.
3. Configure el lector como teclado HID con sufijo Enter, si el dispositivo lo
   permite, y lea una etiqueta asociada a una presentacion activa.
4. Confirme el aviso verde, la presentacion y el incremento de cantidad al
   repetir la misma etiqueta. Use otra etiqueta para comprobar una segunda
   presentacion.
5. Registre la venta y consulte el inventario: solo entonces debe disminuir el
   stock en las unidades base correspondientes.

### Evidencia de validacion

| Comando | Resultado |
|---|---|
| `./mvnw.cmd -q -DskipTests test-compile` | Correcto; incluye la regresion backend de codigo de barras duplicado. |
| `npm test` | 10 archivos y 57 pruebas aprobadas. |
| `npm run lint` | Correcto. |
| `npm run build` | Correcto. |
| `npm run e2e` | 16 aprobadas, 0 fallidas en Chromium contra el entorno aislado. |

No se ejecuto la suite backend de integracion: su preparacion reinicia tablas y
el backend E2E existente debia permanecer sin reinicios ni limpieza. La prueba
nueva se compilo correctamente. No se usaron bases demo, produccion ni Railway.

### Limitaciones pendientes

- Falta validar con el modelo fisico real la configuracion de sufijo Enter,
  velocidad de lectura, caracteres regionales y comportamiento de foco del
  navegador usado en mostrador.
- No se agrego sonido porque no se definio una preferencia operativa ni una
  politica de accesibilidad para el local.

### Recomendacion al cierre del Sprint 16.3

Realizar una prueba piloto con los lectores USB reales y, con esa evidencia,
definir retroalimentacion sonora configurable, reglas para prefijos o sufijos
del dispositivo y metricas operativas de errores de lectura.

## Sprint 16.4: Preparacion de demostracion y validacion con el negocio

Estado: documentacion preparada el 18 de octubre de 2026. Pendiente de reunion
con propietarios y de la validacion funcional del negocio.

### Entregado

- Se audito el alcance demostrable desde las rutas, permisos y datos sinteticos
  configurados: catalogo, inventario, kardex, compras, traslados, caja, ventas,
  clientes, proveedores, reportes, usuarios y escaneo HID.
- Se creo `docs/REUNION_PROPIETARIOS.md` para explicar el sistema sin lenguaje
  tecnico, separar funcionalidades reales de decisiones pendientes y registrar
  preguntas necesarias antes de desplegar.
- Se creo `docs/GUIA_DEMO.md` con un recorrido local de acceso, catalogo,
  inventario, escaneo, venta, kardex, traslado, caja, compras y reportes.
- La guia exige usar el entorno aislado para operaciones de demostracion y
  aclara que los datos actuales son sinteticos. No se modificaron servicios,
  datos ni reglas de negocio durante este sprint.

### Estado real y limites comunicados

- La separacion entre dos empresas/RUC y el almacen central esta implementada;
  los nombres y RUC de los datos de muestra no corresponden a Romel ni
  TodoPernos.
- Facturacion electronica SUNAT, despliegue cloud, respaldos automaticos,
  exportacion Excel/PDF, Iverita y aplicacion movil no estan implementados.
- El lector USB se valida como teclado HID, pero falta una prueba con el modelo
  de hardware, impresora y conectividad reales del local.
- No se ejecutaron pruebas ni resets: el sprint solo agrego documentacion y se
  preservaron los servicios E2E existentes.

## Siguiente sprint recomendado

Realizar la reunion de validacion, convertir sus decisiones en un documento de
requisitos priorizado y preparar un piloto controlado con catalogo migrado,
lectores, impresora, conectividad y responsables de soporte definidos.

## Sprint 17.0: Auditoria y planificacion basada en reunion real

Estado: analisis y documentacion completados. No inicia implementacion de los
sprints 17.1 a 17.6 sin autorizacion explicita.

### Entregado

- Se auditaron requisitos de presentaciones, conversiones, venta, precios,
  cotizaciones, busqueda, disponibilidad, kits, diseno, roles y operacion contra
  el codigo actual de backend y frontend.
- Se creo `docs/REQUISITOS_REUNION_2026.md` con matriz de estado
  IMPLEMENTADA/PARCIAL/AUSENTE/PENDIENTE DE DECISION, evidencia, riesgos y
  preguntas de negocio.
- Se creo `docs/PLAN_MEJORAS_IVERA.md` con arquitectura reutilizable y los
  sprints propuestos 17.1 a 17.6, dependencias y criterios de aceptacion.

### Hallazgos principales

- Presentaciones, factores, stock por ubicacion, kardex transaccional, tres
  roles y separacion por empresa/RUC ya existen; unidades base configurables,
  cotizaciones, multimoneda, kits e historial de precios no.
- Los descuentos actuales son importes por linea; no hay porcentajes, incrementos
  ni descuentos globales de venta.
- La busqueda actual es parcial literal en codigo, nombre y marca; no resuelve
  abreviaturas ni palabras separadas. El POS solo muestra stock de su tienda.
- `DOCUMENTACION.md` conserva decisiones antiguas que contradicen roles,
  despliegue, diseno y alcance actuales. No se modifico por restriccion.

### Validacion del sprint

No se iniciaron servicios, no se ejecutaron pruebas, no se modificaron datos,
codigo fuente, migraciones ni configuracion. La auditoria fue de solo lectura.

## Sprint 17.1: Productos, presentaciones, conversiones y experiencia de venta

Estado: implementacion completada; validacion E2E pendiente por servicios
aislados no disponibles.

### Entregado

- El carrito permite cambiar directamente a otra presentacion activa del mismo
  producto. La accion requiere confirmacion, conserva la cantidad comercial
  escrita, actualiza precio/factor y muestra el nuevo equivalente en unidad base.
- Para evitar duplicados, una presentacion ya agregada como otra linea no se
  puede seleccionar desde el cambio de presentacion.
- Las cantidades comerciales con unidad base `UNIDAD` ahora aceptan fracciones
  solo cuando `cantidad x factor` termina en una cantidad entera de unidades.
  Ejemplo valido: `0.5` millar = `500` unidades; una fraccion que no cumple esa
  regla se rechaza antes del cobro.
- No se modificaron tablas, migraciones, API ni reglas de inventario. La venta
  sigue enviando solo presentacion, cantidad y descuento; `VentaService` vuelve
  a tomar precio/factor y `MovimientoStockService` es el unico escritor de
  stock y kardex.

### Validacion

| Comando | Resultado |
|---|---|
| `npm test` | 10 archivos y 58 pruebas aprobadas. |
| `npm run lint` | Correcto. |
| `npm run build` | Correcto. |
| `./mvnw.cmd -q -DskipTests test-compile` | Correcto. |
| `npm run e2e` | Pendiente: backend E2E no escuchaba en `8081` y Docker Desktop no estaba disponible; no se reiniciaron servicios. |

### Validacion final pendiente

La comprobacion final confirmo que Docker Desktop sigue sin exponer
`dockerDesktopLinuxEngine`; no fue posible inspeccionar
`ivera-s16-test-postgres`. Los puertos `5545`, `8081` y `5174` estaban libres,
por lo que tampoco habia PostgreSQL aislado ni backend E2E reutilizable. Aunque
las guardias de Playwright y el perfil E2E apuntan exclusivamente a
`5174`/`8081` y `ivera_sprint16_1_test`, no se pudo validar la identidad real
de la base. Por seguridad no se ejecuto `npm run e2e` ni se iniciaron,
reiniciaron o limpiaron servicios.

### Decisiones pendientes

- La cantidad escrita se conserva al cambiar presentacion, pero la politica de
  descuento monetario al hacerlo debe confirmarse. Por ahora se conserva y se
  informa en la confirmacion.
- No se agregaron unidades base configurables ni se dedujeron factores desde
  precios o fotografias. Los nombres comerciales de presentacion ya son libres
  por producto; nuevas unidades base requieren la definicion de precision y
  conversion del negocio.

## Sprint 17.2: Busqueda inteligente y disponibilidad por ubicacion

Estado: implementacion y validacion no destructiva completadas. Integracion y
E2E pendientes por Docker Desktop inaccesible, igual que la regresion de 17.1.

### Entregado

- La busqueda de productos e inventario divide el texto en palabras, ignora
  mayusculas y tildes, y exige que cada palabra coincida en codigo, nombre o
  marca. Ejemplos soportados: `pe gal`, `tor hex` y `aran pes`.
- Los resultados de catalogo con texto priorizan codigo exacto, luego nombre que
  empieza con el primer termino y finalmente nombre alfabetico.
- El debounce existente se conserva; React Query ahora entrega `AbortSignal` a
  las consultas de catalogo/stock para cancelar solicitudes obsoletas.
- El POS mantiene stock de la tienda de la caja. Si el usuario es ADMIN, muestra
  stock fisico positivo de otras ubicaciones y avisa que una falta local requiere
  traslado o reposicion. No hay reserva, venta cruzada ni traslado automatico.
- VENDEDOR y ALMACENERO no reciben datos externos: se reutiliza la proteccion de
  `AccesoUbicacionService` del endpoint existente `/api/inventario/stock`.

### Base de datos y seguridad

- No se crearon migraciones ni extensiones PostgreSQL. La normalizacion de
  tildes usa `translate` nativo de PostgreSQL, por lo que no requiere `unaccent`.
- No se modificaron `MovimientoStockService`, ventas, caja, kardex, roles ni
  permisos. Consultar disponibilidad no escribe stock.

### Validacion

| Comando | Resultado |
|---|---|
| `./mvnw.cmd -q -Dtest=BusquedaTextoTest test` | Correcto. |
| `./mvnw.cmd -q -DskipTests test-compile` | Correcto; incluye regresiones HTTP de busqueda. |
| `npm test` | 10 archivos y 58 pruebas aprobadas. |
| `npm run lint` | Correcto. |
| `npm run build` | Correcto. |
| Integracion/Playwright | Pendiente: Docker Desktop y entorno aislado no disponibles; no se iniciaron servicios. |

### Limitaciones

- La busqueda no incluye descripcion, categoria ni sinonimos administrables; no
  se implemento IA ni servicios externos.
- El modelo actual solo representa stock fisico. No hay columnas ni reglas para
  reservado/disponible.
- La visibilidad de stock externo para VENDEDOR/ALMACENERO permanece restringida
  hasta que el negocio autorice una politica distinta.

## Sprint 17.3: Historial de precios y ajustes porcentuales auditables

Estado: implementacion parcial segura y validacion no destructiva completadas.
La migracion V4 fue creada pero no aplicada; integracion y E2E siguen pendientes
por Docker Desktop inaccesible y no se iniciaron servicios.

### Entregado

- `historial_precio_presentacion` registra un cambio efectivo de precio con
  producto, presentacion, precio anterior/nuevo, fecha y usuario. No se registra
  si el precio no cambia ni se generan datos historicos retroactivos.
- `GET /api/productos/{id}/historial-precios` y el formulario de producto
  permiten consultar los cambios registrados. Los permisos existentes conservan
  consulta autenticada de catalogo y modificacion solo ADMIN.
- Cada linea de venta admite descuento porcentual (negativo en API) o incremento
  porcentual (positivo). El backend obtiene el precio vigente, calcula y guarda
  el porcentaje junto al snapshot de precio, cantidad, factor, descuento y
  subtotal. No modifica stock fuera de la venta normal ni cambia
  `MovimientoStockService`.
- El POS muestra precio original, importe, descuento monetario, descuento %,
  incremento % y subtotal; cambiar presentacion conserva el ajuste. Al editar un
  campo de ajuste limpia los otros para impedir combinaciones ambiguas.

### Reglas exactas

- `importe = ROUND(cantidad x precioVenta, 2, HALF_UP)`.
- Descuento monetario y ajuste porcentual son excluyentes.
- Para porcentaje `p`: `subtotal = ROUND(importe + importe x p / 100, 2,
  HALF_UP)`. `p < 0` descuenta, `p > 0` incrementa y `p >= -100`.
- `venta.descuento` conserva la suma de descuentos como monto positivo; un
  incremento no aumenta ese campo. IGV se separa desde el total final como antes.
- Precio, cantidad, factor, porcentaje y subtotal quedan congelados en
  `venta_detalle`; las ventas anteriores mantienen `ajuste_porcentaje = NULL`.

### Pendiente por decision de negocio

- Ajuste general al total: existe solo `calcularAjusteGeneral` aislado y el POS
  lo muestra como no disponible. No se envia, persiste ni registra una venta.
- Faltan orden de ajustes generales frente a lineas, IGV, redondeos de documento,
  reportes, caja, autorizaciones y coexistencia con descuentos monetarios.
- Margen no se implementa: el costo de compra no se expone a ADMIN/VENDEDOR en
  POS y no existe politica de ultimo costo, promedio o lote.
- No hay multimoneda en el modelo; por ello el historial no inventa moneda.

### Validacion

| Comando | Resultado |
|---|---|
| `./mvnw.cmd -q -Dtest=VentaServiceTest,ProductoServiceTest test` | Correcto; Mockito muestra advertencias de agente dinamico de JDK. |
| `./mvnw.cmd -q -DskipTests test-compile` | Correcto. |
| `npm test` | Correcto: 10 archivos y 66 pruebas. |
| `npm run lint` | Correcto. |
| `npm run build` | Correcto. |
| Integracion/Playwright | Pendiente: Docker Desktop no esta disponible; no se inicio infraestructura. |

## Siguiente sprint recomendado

Ejecutar las regresiones aisladas pendientes de Sprints 17.1 a 17.3 cuando
Docker este disponible. Antes de habilitar un ajuste general o margen, obtener
las decisiones comerciales documentadas. Luego continuar con Sprint 17.4 solo
si se aprueban cotizaciones y multimoneda.
