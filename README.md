# 🚀 IVERA — Guía para iniciar el proyecto en Windows

## 1. Descripción del proyecto

**Ivera (TodoPernos)** es un sistema de gestión para ferreterías que permite administrar productos, inventario, compras, ventas, traslados, caja, clientes, fiados y reportes.

El sistema trabaja con dos tiendas y un almacén central.

### Tecnologías

| Componente | Tecnología |
|---|---|
| Backend | Java 21 + Spring Boot 4.1 |
| Frontend | React 19 + TypeScript 6 + Vite 8 |
| Base de datos | PostgreSQL 16 |
| Contenedores | Docker Desktop + Docker Compose |
| Seguridad | Spring Security + JWT |
| Migraciones | Flyway |
| Pruebas | JUnit, Vitest y Playwright |
| Editor | Visual Studio Code |

---

## 2. Estructura del proyecto

La carpeta principal se encuentra en:

`C:\Users\user\Dev\Ivera-Nueva`

```text
Ivera-Nueva/
│
├── ferreteria-backend/
│   ├── backend/
│   │   ├── src/
│   │   ├── .env
│   │   ├── docker-compose.yml
│   │   ├── pom.xml
│   │   └── mvnw.cmd
│   ├── docs/
│   └── README.md
│
├── ferreteria-frontend/
│   ├── src/
│   ├── public/
│   ├── e2e/
│   ├── package.json
│   └── README.md
│
├── usuario_backup.sql
└── README_ARRANQUE_IVERA.md
```

Los dos repositorios son independientes:

**Backend:** https://github.com/juniorcueva-star/ferreteria-backend

**Frontend:** https://github.com/juniorcueva-star/ferreteria-frontend

---

## 3. Requisitos previos

Antes de ejecutar el proyecto, debemos tener instalados:

- Git
- Java JDK 21
- Node.js 22.12 o superior
- npm
- Docker Desktop
- Visual Studio Code

Para comprobar las versiones:

```powershell
git --version
java -version
node -v
npm -v
docker --version
docker compose version
```

**Importante:** no es necesario instalar Maven globalmente porque el backend incluye Maven Wrapper.

---

# 4. Cómo iniciar Ivera cada día

Este es el procedimiento habitual después de encender la computadora.

## PASO 1 — Abrir Docker Desktop

1. Abrir Docker Desktop desde el menú de Windows.
2. Esperar a que el motor de Docker termine de iniciar.
3. Comprobar su funcionamiento desde PowerShell:

```powershell
docker info
```

Si aparece información de `Client` y `Server`, Docker está funcionando.

Si aparece un error relacionado con `dockerDesktopLinuxEngine`, verificar que Docker Desktop esté abierto y que el motor haya terminado de iniciar.

## PASO 2 — Abrir el proyecto en VS Code

Abrir Visual Studio Code y seleccionar:

**File → Open Folder**

Elegir:

```text
C:\Users\user\Dev\Ivera-Nueva
```

Abrir una terminal integrada mediante:

**Terminal → New Terminal**

## PASO 3 — Iniciar PostgreSQL

En la primera terminal:

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-backend\backend

docker compose up -d
```

Verificar el estado:

```powershell
docker compose ps
```

Resultado esperado:

```text
NAME                  STATUS
ferreteria-postgres   Up (healthy)
```

### Configuración de PostgreSQL

| Parámetro | Valor |
|---|---|
| Motor | PostgreSQL 16 |
| Contenedor | ferreteria-postgres |
| Host | localhost |
| Puerto | 5434 |
| Base de datos | ferreteria |
| Usuario | ferreteria |
| Contraseña | Configurada localmente |

La base de datos utiliza un volumen Docker llamado `ferreteria_postgres_data`.

**No ejecutar `docker compose down -v`**, ya que la opción `-v` elimina los volúmenes asociados y puede ocasionar pérdida de datos.

## PASO 4 — Iniciar el backend Spring Boot

Abrir una segunda terminal en VS Code.

Ejecutar:

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-backend\backend

.\mvnw.cmd spring-boot:run
```

Esperar hasta que Spring Boot termine de iniciar.

El backend estará disponible en:

**API:** http://localhost:8080

**Swagger:** http://localhost:8080/swagger-ui.html

**Importante:** mantener abierta esta terminal mientras se utiliza el proyecto.

Si aparece un error de conexión a PostgreSQL, revisar el archivo `.env` y la configuración de carga de variables del backend.

## PASO 5 — Iniciar el frontend React

Abrir una tercera terminal en VS Code.

Ejecutar:

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-frontend

npm run dev
```

Esperar a que Vite indique que el servidor está disponible.

Abrir en el navegador:

**http://localhost:5173**

El frontend debe comunicarse con el backend en `http://localhost:8080`.

La variable de configuración del frontend es `VITE_API_URL`, según el README del repositorio.

## PASO 6 — Iniciar sesión

Con el backend configurado con usuarios de demostración, se pueden utilizar:

| Usuario | Rol |
|---|---|
| admin | Administrador |
| vendedor1 | Vendedor |
| vendedor2 | Vendedor |
| almacen1 | Almacenero |

Las contraseñas dependen de `ADMIN_PASSWORD` y `DEMO_PASSWORD`, configuradas en el entorno local del backend.

No almacenar ni publicar las contraseñas en este README.

---

# 5. Resumen rápido de arranque

Cada vez que queramos trabajar en Ivera:

**Primero:** abrir Docker Desktop y esperar a que inicie.

**Terminal 1 — Base de datos**

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-backend\backend
docker compose up -d
docker compose ps
```

**Terminal 2 — Backend**

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-backend\backend
.\mvnw.cmd spring-boot:run
```

**Terminal 3 — Frontend**

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-frontend
npm run dev
```

**Abrir Ivera:**

http://localhost:5173

---

# 6. Cómo detener el proyecto correctamente

## Detener frontend

En la terminal donde se ejecuta Vite:

```text
Ctrl + C
```

## Detener backend

En la terminal donde se ejecuta Spring Boot:

```text
Ctrl + C
```

## Detener PostgreSQL

Desde la carpeta del backend:

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-backend\backend

docker compose stop
```

Este comando detiene el contenedor sin eliminar sus datos.

Para volver a iniciarlo:

```powershell
docker compose up -d
```

Finalmente, se puede cerrar Docker Desktop.

---

# 7. Instalación de dependencias

Estos comandos normalmente solo son necesarios al instalar el proyecto o cuando cambian sus dependencias.

## Backend

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-backend\backend

.\mvnw.cmd verify
```

El comando ejecuta la compilación y las verificaciones configuradas por Maven.

## Frontend

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-frontend

npm install
```

Para verificar el frontend:

```powershell
npm run lint
npm test
npm run build
```

Las pruebas E2E requieren su propia configuración y un backend de pruebas preparado. No ejecutarlas contra datos importantes sin revisar previamente su configuración.

---

# 8. Problemas frecuentes

## Error: Docker no está funcionando

Mensaje habitual:

```text
failed to connect to the docker API
```

Solución:

1. Abrir Docker Desktop.
2. Esperar a que termine de iniciar.
3. Ejecutar `docker info`.
4. Reintentar `docker compose up -d`.

## Error: el puerto 8080 está ocupado

Puede existir otro backend ejecutándose.

Comprobar:

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
```

Identificar el proceso antes de detenerlo:

```powershell
Get-Process -Id <PID>
```

Reemplazar `<PID>` por el identificador real obtenido.

No detener procesos sin verificar a qué aplicación pertenecen.

## Error: PostgreSQL no conecta

Comprobar:

```powershell
docker compose ps
```

Si el contenedor no está activo:

```powershell
docker compose up -d
```

También verificar:

- Que el puerto configurado sea 5434.
- Que la base de datos sea la correcta.
- Que las credenciales coincidan.
- Que las variables de entorno sean cargadas correctamente por Spring Boot.

## Error: frontend no conecta con backend

Comprobar:

1. Que Spring Boot esté iniciado.
2. Que el backend escuche en el puerto 8080.
3. Que `VITE_API_URL` apunte a la API correcta.
4. Que no existan errores CORS.
5. Que las solicitudes se puedan inspeccionar en las herramientas de desarrollador del navegador.

## Error: Maven o npm falla

Ejecutar los comandos desde la carpeta correspondiente.

Backend:

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-backend\backend
```

Frontend:

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-frontend
```

No borrar dependencias ni configuraciones sin identificar primero el error.

---

# 9. Git y trabajo colaborativo

El proyecto tiene dos repositorios independientes, por lo que sus cambios deben gestionarse por separado.

## Consultar cambios locales

Backend:

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-backend
git status
```

Frontend:

```powershell
cd C:\Users\user\Dev\Ivera-Nueva\ferreteria-frontend
git status
```

## Consultar actualizaciones disponibles

```powershell
git fetch origin
```

Antes de usar `git pull`, revisar si existen cambios locales y coordinar con el otro desarrollador.

No ejecutar `git reset --hard`, `git clean -fd` ni sobrescribir archivos sin revisar qué trabajo podría perderse.

---

# 10. Seguridad y respaldos

El proyecto contiene configuraciones y datos que deben protegerse.

### Archivo `.env`

- Contiene variables privadas.
- No debe publicarse en GitHub.
- No debe compartirse por capturas.
- No debe copiarse a documentación pública.

### Archivo `usuario_backup.sql`

En la carpeta principal existe un archivo llamado `usuario_backup.sql`, que parece ser un respaldo PostgreSQL.

Antes de utilizarlo, es necesario confirmar su contenido, procedencia y base de datos de destino.

No ejecutar ni importar el archivo automáticamente.

Podría contener información de usuarios, contraseñas cifradas u otros datos privados.

### Bases de datos

La nueva versión utiliza PostgreSQL en Docker, publicado en el puerto 5434.

La versión anterior de Ivera utiliza otra configuración local.

No mezclar conexiones, migraciones ni respaldos entre ambas versiones sin comprobar su compatibilidad.

---

# 11. Enlaces importantes

| Servicio | Dirección |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger-ui.html |
| PostgreSQL | localhost:5434 |
| Repositorio backend | https://github.com/juniorcueva-star/ferreteria-backend |
| Repositorio frontend | https://github.com/juniorcueva-star/ferreteria-frontend |

---

# 12. Checklist diario

Antes de empezar a desarrollar:

- [ ] Docker Desktop está iniciado.
- [ ] PostgreSQL está `healthy`.
- [ ] Spring Boot está ejecutándose en el puerto 8080.
- [ ] React/Vite está ejecutándose en el puerto 5173.
- [ ] La aplicación abre en el navegador.
- [ ] El inicio de sesión funciona.
- [ ] El frontend se comunica con el backend.
- [ ] Los repositorios no tienen cambios inesperados.

Al terminar:

- [ ] Guardar el trabajo.
- [ ] Detener Vite con `Ctrl + C`.
- [ ] Detener Spring Boot con `Ctrl + C`.
- [ ] Detener PostgreSQL con `docker compose stop` si ya no se necesita.
- [ ] Cerrar Docker Desktop si corresponde.

---

**IVERA — Desarrollo colaborativo de un sistema de gestión de ferreterías.**

*Guía de ejecución local para Windows 11, PowerShell, Docker, Spring Boot y React.*

---

# 13. Estado e historial de sprints

Ivera gestiona catálogo, inventario por ubicación, compras, traslados, caja,
ventas, clientes, ventas al crédito, abonos y reportes para dos tiendas y un
almacén central. La aplicación conserva la separación entre frontend React,
API Spring Boot y PostgreSQL con migraciones Flyway.

| Sprint | Avance real |
|---|---|
| 16.1 | Se creó un entorno de pruebas E2E aislado: PostgreSQL propio en el puerto `5545`, backend E2E en `8081`, frontend temporal en `5174` y validaciones que impiden limpiar una base distinta de la autorizada. |
| 16.2 | Se integró el escaneo de código de barras por presentación en el punto de venta. El código identifica una presentación concreta, respeta su factor de unidades y precio, muestra stock antes de agregar al carrito y no descuenta existencias hasta registrar la venta. |
| 16.3 | El POS admite lectores USB tipo teclado (HID): el campo de escaneo tiene foco recuperable, las lecturas consecutivas se encolan, una misma presentación acumula cantidad y los errores de lectura no bloquean la siguiente. |
| 16.4 | Se preparó la demostración local y la validación con propietarios: recorrido operativo, estado verificable, limitaciones, decisiones previas al despliegue y guía de lector USB. |

La validación técnica más reciente del Sprint 16.3 aprobó compilación de pruebas
backend, lint y build frontend, 57 pruebas Vitest y 16 de 16 pruebas Playwright
contra el entorno aislado. El Sprint 16.4 solo incorporó documentación y no
ejecutó servicios, resets ni pruebas que escriban datos. El procedimiento y la
evidencia se mantienen en `PROGRESO.md`; el material para la reunión está en
`docs/REUNION_PROPIETARIOS.md` y `docs/GUIA_DEMO.md`.

## Siguiente trabajo recomendado

El siguiente sprint debe convertir las decisiones de los propietarios en
requisitos priorizados y preparar un piloto controlado con catalogo migrado,
lectores, impresora, conectividad y responsables de soporte definidos. También
quedan por priorizar los requerimientos de negocio que no formen parte de los
flujos actuales de catálogo, inventario, compras, traslados, caja, ventas,
clientes y reportes.
