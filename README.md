# Motor de promociones — RK Palanca Fontestad

Esqueleto real (no una maqueta) de lo que hablamos: **Next.js + Firestore**,
con Sagunto Fusión 1 como promoción de ejemplo. Una plantilla pública por
promoción, y un panel de administración donde el equipo marca cada vivienda
como disponible / reservada / vendida — el cambio se refleja en la web
pública al momento, sin volver a desplegar nada.

Probado de punta a punta antes de entregarlo: seed de datos → login admin →
cambiar el estado de una vivienda → la página pública se actualiza sola.

## Qué hay aquí

- **`/`** — índice de todas las promociones (hoy solo Sagunto Fusión 1; añadir
  la siguiente es escribir sus datos, no programar una página nueva).
- **`/promociones/[slug]`** — página pública de una promoción, con un panel
  de **disponibilidad en directo** (el elemento central de la demo: cuenta
  real de disponibles/reservadas/vendidas y el listado de cada vivienda).
- **`/admin`** — panel protegido con login (Firebase Auth). Desde aquí se
  cambia el estado de cada vivienda.

## Arrancar en 5 minutos, sin cuenta de Firebase todavía

Para que puedas verlo funcionando (y enseñarlo) antes de montar el proyecto
de Firebase real, todo está preparado para correr contra el **emulador
local** de Firebase — datos de mentira, en tu máquina, cero configuración.

```bash
npm install

# Terminal 1: arranca Firestore + Auth en local
npm run emulators

# Terminal 2: carga Sagunto Fusión 1 con datos de ejemplo
npm run seed

# Terminal 2: crea tu usuario para entrar en /admin
npm run create-admin:emulator -- tu@correo.com "unaContraseña"

# Terminal 2: arranca la web apuntando al emulador
npm run dev:emulators
```

Abre `http://localhost:3000`. Entra en `/admin` con el correo/contraseña que
acabas de crear, cambia el estado de una vivienda, y comprueba que la página
pública (`/promociones/sagunto-fusion-1`) lo refleja al instante.

El archivo `.env.local` ya incluido tiene valores de relleno que solo
funcionan contra el emulador — no son credenciales reales, no hace falta
tocarlos para este modo de prueba.

## Pasar a un proyecto de Firebase real

1. Crea un proyecto en [console.firebase.google.com](https://console.firebase.google.com).
2. Activa **Firestore** (modo producción) y **Authentication → Email/contraseña**.
3. **Configuración del proyecto → General**: copia la config del SDK web a
   las variables `NEXT_PUBLIC_FIREBASE_*` de tu `.env.local` (mira
   `.env.local.example`).
4. **Configuración del proyecto → Cuentas de servicio → Generar nueva clave
   privada**: descarga el JSON y rellena `FIREBASE_ADMIN_PROJECT_ID`,
   `FIREBASE_ADMIN_CLIENT_EMAIL` y `FIREBASE_ADMIN_PRIVATE_KEY` con sus
   valores (la clave privada lleva `\n` literales, tal cual vienen en el JSON).
5. Publica las reglas de seguridad: `firebase deploy --only firestore:rules`
   (o pégalas a mano en la consola de Firestore — están en `firestore.rules`).
6. Siembra los datos reales: `npm run seed:prod`.
7. Da de alta a tu equipo: `npm run create-admin -- correo@rkpalanca.com "contraseña"`.
8. `npm run dev` (ya sin `:emulators`) para probarlo contra el proyecto real.

## Desplegar en GitHub + Vercel

Funciona igual que tus otras PWA (push a GitHub → Vercel lo despliega solo),
con dos matices que ya hablamos y que aquí importan de verdad porque hay un
backend real detrás:

- **Plan de Vercel**: esto es una herramienta de negocio (gestiona inventario
  real de la agencia), y el plan Hobby de Vercel es solo para uso personal/no
  comercial. Usa Pro (20$/mes) para este proyecto.
- **Variables de entorno**: en el proyecto de Vercel → *Settings →
  Environment Variables*, añade las mismas variables de tu `.env.local` real
  (nunca subas ese archivo a git — ya está en `.gitignore`). Las
  `NEXT_PUBLIC_*` son públicas por diseño; `FIREBASE_ADMIN_*` son secretas de
  verdad.

## Cómo está montada la seguridad (para que no te la juegues sin saberlo)

Dos capas, no una:

1. **Firestore Rules** (`firestore.rules`): deniegan **toda** escritura desde
   el cliente. La lectura de promociones/viviendas es pública a propósito
   (es información de disponibilidad, no hay nada sensible).
2. **Server Actions** (`lib/actions/`): son el único camino para escribir.
   Cada una verifica el token de sesión de Firebase (`verifyIdToken`) del
   lado del servidor antes de tocar Firestore — nunca se fían de lo que
   llega del navegador.

El resultado: aunque alguien abra las herramientas de desarrollador e intente
escribir directamente en Firestore desde el navegador, las Rules lo cortan.
Y aunque alguien intente llamar a la Server Action sin sesión, la
verificación del token la corta también. `/admin` en sí (el `AuthGuard`) es
solo una capa de experiencia de usuario — no la única defensa.

## Estructura

```
app/
├── page.js                          índice de promociones
├── promociones/[slug]/page.js       página pública (Server Component)
├── admin/
│   ├── layout.js + AuthGuard        protege todo /admin
│   ├── login/page.js
│   ├── page.js                      lista de promociones a gestionar
│   └── promociones/[slug]/page.js   tabla de viviendas editable
lib/
├── firebase/client.js               SDK cliente (público, para el navegador)
├── firebase/admin.js                SDK admin (SOLO servidor, credenciales reales)
├── data/promociones.js              lecturas (Server Components)
└── actions/
    ├── viviendas.js                 escribir estado de una vivienda (requiere sesión)
    └── leads.js                     guardar un lead del formulario VIP (público)
components/                          UI, tema claro con acentos de marca
scripts/
├── seed.mjs                         carga Sagunto Fusión 1 con datos de ejemplo
└── create-admin-user.mjs            da de alta un usuario del equipo
```

## Añadir la siguiente promoción

Todavía no hay una pantalla para "crear promoción" desde el navegador — con
una sola promoción de ejemplo no tenía sentido construirla todavía. Por
ahora, la vía es duplicar el bloque de `scripts/seed.mjs` con los datos de la
nueva promoción y su propio slug, y ejecutar el seed. Si el motor demuestra
su valor con las primeras promociones, el siguiente paso natural es construir
esa pantalla de alta dentro de `/admin` — dímelo cuando llegues ahí.
