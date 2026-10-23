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
