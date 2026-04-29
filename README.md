# 🏋️ GymControl Dashboard

Una aplicación profesional de gestión integral para gimnasios, construida con **Vite + React + TypeScript** y **Tauri 2**. Diseñada para funcionar tanto en navegadores web como en aplicaciones de escritorio multiplataforma (Windows, macOS, Linux, iOS).

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Rápida](#-instalación-rápida)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Persistencia de Datos](#-persistencia-de-datos)
- [Arquitectura](#-arquitectura)
- [Guía de Desarrollo](#-guía-de-desarrollo)
- [Desarrollo Web](#-desarrollo-web)
- [Desarrollo Desktop con Tauri](#-desarrollo-desktop-con-tauri)
- [Compilación para Escritorio](#-compilación-para-escritorio)
- [Desarrollo iOS](#-desarrollo-ios)
- [Autenticación](#-autenticación)
- [Gestión de Base de Datos](#-gestión-de-base-de-datos)
- [Solución de Problemas](#-solución-de-problemas)

---

## ✨ Características

### Gestión Principal
- 👥 **Gestión de Estudiantes/Miembros**: CRUD completo con formularios validados
- 📅 **Gestión de Horarios**: Control de turnos y clases
- 💳 **Control de Suscripciones**: Seguimiento de fechas de vencimiento y renovación
- ⏰ **Sistema de Alertas**: Notificaciones de suscripciones próximas a vencer o vencidas

### Seguridad y Autenticación
- 🔐 **Autenticación segura** con persistencia de sesión
- 🛡️ **Rutas protegidas** por rol/autenticación
- 🔑 **Recuperación automática** de sesiones

### Interfaz de Usuario
- 🎨 **Tema claro/oscuro** personalizable
- 📱 **Diseño responsive** para cualquier dispositivo
- ⚡ **Componentes reutilizables** con Radix UI + Tailwind CSS
- 📦 **Más de 30 componentes UI** listos para usar

### Persistencia Inteligente
- 💾 **SQLite local** para aplicaciones de escritorio
- 💾 **localStorage** para desarrollo web
- 🔄 **Migración automática** de datos entre almacenamientos

### Multiplataforma
- 🖥️ **Windows, macOS, Linux** via Tauri
- 🌐 **Web** en cualquier navegador moderno
- 📱 **iOS** (preparado con Tauri 2)

---

## 🔧 Requisitos Previos

### Mínimos
- **Node.js** 16.0 o superior
- **npm** 8.0 o superior
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Para Tauri (Desarrollo Desktop)
- **Rust** 1.70 o superior
- **Visual Studio Build Tools** (Windows)
- **Xcode** (macOS)
- **Herramientas GTK** (Linux)

### Para iOS
- **macOS** (obligatorio)
- **Xcode** 14 o superior

---

## 🚀 Instalación Rápida

### 1. Clonar y preparar

```bash
cd GymControl/gym-dashboard
npm install
```

### 2. Configurar variables de entorno (opcional)

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Ejecutar

**Desarrollo Web:**
```bash
npm run dev
```

**Desarrollo Desktop (Tauri):**
```bash
npm run tauri:dev
```

---

## 🗂️ Estructura del Proyecto

```
gym-dashboard/
│
├── 📂 src/                           # Código fuente React + TypeScript
│   ├── 📂 components/               # Componentes reutilizables
│   │   ├── 📂 ui/                  # Componentes base (Radix UI)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (más de 30 componentes)
│   │   ├── 📂 figma/               # Componentes personalizados
│   │   │   └── ImageWithFallback.tsx
│   │   ├── Layout.tsx              # Layout principal con sidebar
│   │   ├── ProtectedRoute.tsx      # HOC para rutas protegidas
│   │   ├── AppSplash.tsx           # Pantalla de inicio
│   │   ├── StudentCard.tsx         # Tarjeta de estudiante
│   │   ├── StudentForm.tsx         # Formulario de estudiantes
│   │   ├── NotificationsPopover.tsx # Centro de notificaciones
│   │   └── RenewSubscriptionDialog.tsx # Diálogo de renovación
│   │
│   ├── 📂 pages/                    # Páginas principales (vistas)
│   │   ├── Login.tsx               # Página de autenticación
│   │   ├── Dashboard.tsx           # Dashboard principal (deprecated)
│   │   ├── Students.tsx            # Gestión de estudiantes (home)
│   │   ├── Schedule.tsx            # Gestión de horarios/turnos
│   │   ├── Settings.tsx            # Configuración de la app
│   │   └── About.tsx               # Información sobre la app
│   │
│   ├── 📂 contexts/                 # Contextos de React (estado global)
│   │   └── AuthContext.tsx         # Estado de autenticación y usuario
│   │
│   ├── 📂 hooks/                    # Custom Hooks
│   │   └── useStudents.ts          # Lógica para gestión de estudiantes
│   │
│   ├── 📂 lib/                      # Lógica de negocio y utilidades
│   │   ├── auth-repository.ts      # Capa de autenticación
│   │   ├── student-repository.ts   # Acceso a datos de estudiantes
│   │   ├── date-utils.ts           # Utilidades de fechas
│   │   └── platform.ts             # Detección de plataforma (Tauri/Web)
│   │
│   ├── 📂 types/                    # Definiciones TypeScript
│   │   └── student.ts              # Interfaces de estudiante
│   │
│   ├── 📂 styles/                   # Estilos globales
│   │   ├── index.css               # Importa todos los estilos
│   │   ├── tailwind.css            # Configuración Tailwind
│   │   ├── theme.css               # Variables de tema
│   │   ├── fonts.css               # Fuentes personalizadas
│   │   └── ...
│   │
│   ├── App.tsx                     # Componente raíz con proveedores
│   ├── main.tsx                    # Punto de entrada de React
│   ├── routes.tsx                  # Definición de rutas (React Router)
│   ├── vite-env.d.ts              # Tipos de Vite
│   └── index.css                   # Estilos globales iniciales
│
├── 📂 src-tauri/                    # Backend Rust (Tauri)
│   ├── src/
│   │   ├── main.rs                # Punto de entrada desktop
│   │   ├── lib.rs                 # Librería principal
│   │   ├── commands.rs            # Comandos Tauri (IPC backend)
│   │   └── db.rs                  # Lógica SQLite
│   │
│   ├── Cargo.toml                 # Dependencias Rust
│   ├── tauri.conf.json            # Configuración de Tauri
│   │   ├── Versión, nombre
│   │   ├── Ventana, icono
│   │   ├── Capacidades de seguridad
│   │   └── Plugins
│   │
│   ├── 📂 capabilities/           # Definición de permisos
│   │   └── default.json           # Capacidades por defecto
│   │
│   ├── 📂 icons/                  # Iconos de aplicación
│   ├── 📂 gen/                    # Esquemas generados
│   └── 📂 target/                 # Build output
│
├── 📂 public/                       # Activos estáticos
│
├── 📝 package.json                 # Dependencias y scripts npm
├── 🔧 vite.config.ts              # Configuración de Vite
├── 📋 tsconfig.json               # Configuración de TypeScript
├── 📋 tsconfig.app.json           # TypeScript para aplicación
├── 📋 tsconfig.node.json          # TypeScript para herramientas
├── 📖 README.md                    # Este archivo (documentación)
└── 📜 index.html                   # HTML principal
```

---

## 🎯 Scripts Disponibles

### Desarrollo Web
```bash
# Iniciar servidor de desarrollo (Vite en puerto 1420)
npm run dev

# Compilar producción
npm run build

# Previsualizar build
npm run preview

# Linting de código
npm run lint
```

### Tauri (Desktop)
```bash
# Desarrollo con Tauri (incluye recompilación de Rust)
npm run tauri:dev

# Compilar aplicación de escritorio (genera instalador)
npm run tauri:build

# Comando Tauri genérico
npm run tauri -- [args]
```

### iOS (en macOS)
```bash
# Inicializar proyecto iOS
npm run tauri:ios:init

# Desarrollo en iOS
npm run tauri:ios:dev
```

---

## 💾 Persistencia de Datos

### Sistema Multicapa

La aplicación usa una arquitectura inteligente de persistencia:

```
UI (React)
    ↓
Repository Layer (student-repository.ts)
    ↓
├─→ Tauri (Desktop) → SQLite (local)
├─→ Web → localStorage (desarrollo)
└─→ Web → Supabase API (producción)
```

### En Tauri (Desktop)

```rust
// Backend Rust almacena en SQLite
- students (ID, nombre, email, teléfono, etc.)
- payments (histórico de pagos)
- app_users (usuarios de la aplicación)
- gym_profile (configuración del gimnasio)
```

**Ventajas:**
- ✅ Datos offline disponibles siempre
- ✅ Sin latencia de red
- ✅ Sincronización futura con cloud
- ✅ Criptografía local nativa

### En Web (Desarrollo)

```typescript
// localStorage para desarrollo rápido
localStorage.setItem('students', JSON.stringify(data))
```

### Migración Automática

Si la app detecta datos en `localStorage` y corre en Tauri:

```typescript
// En AuthContext o useStudents
if (isTauriApp && hasLocalStorageData) {
  // Migrar automáticamente a SQLite
  migrateToSQLite(data)
}
```

### Tablas Preparadas para Futuro

La estructura inicial ya incluye tablas para:
- `students` - Miembros del gimnasio
- `payments` - Historial de pagos
- `app_users` - Usuarios de la aplicación
- `gym_profile` - Configuración del gimnasio

Esto permite evolucionar a **API REST** o **Supabase** sin cambios en la UI.

---

## 🏗️ Arquitectura

### Flujo de Autenticación

```
┌─────────────────────────────────────────────┐
│          Página de Login                    │
│  (formulario: username, password)           │
└──────────────┬──────────────────────────────┘
               │ submit
               ↓
┌─────────────────────────────────────────────┐
│      AuthRepository.login()                 │
│  - Valida credenciales                      │
│  - Obtiene token de Tauri/API               │
│  - Guarda sesión                            │
└──────────────┬──────────────────────────────┘
               │ success
               ↓
┌─────────────────────────────────────────────┐
│      AuthContext (estado global)            │
│  - user: { id, name, email, ... }          │
│  - accessToken: JWT                         │
│  - isAuthenticated: true                    │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│      ProtectedRoute Component               │
│  - Verifica isAuthenticated                 │
│  - Redirige a Login si no autenticado       │
└──────────────┬──────────────────────────────┘
               │ ✓ autenticado
               ↓
┌─────────────────────────────────────────────┐
│      Dashboard (Students.tsx)               │
│      Acceso a todas las funciones           │
└─────────────────────────────────────────────┘
```

### Estructura de Componentes React

```
<App>
  └─ <AuthProvider>              (Contexto global de auth)
      └─ <RouterProvider>        (React Router)
          ├─ <Login />           (Ruta pública)
          └─ <ProtectedRoute>
              └─ <Layout>        (Sidebar, navbar)
                  ├─ <Students />      (Dashboard)
                  ├─ <Schedule />      (Horarios)
                  ├─ <Settings />      (Config)
                  └─ <About />         (Info)
```

### Capas de Datos

```
Componentes UI (StudentCard, StudentForm, etc.)
        ↓ (consume)
Custom Hooks (useStudents)
        ↓ (consume)
Repositories (student-repository.ts, auth-repository.ts)
        ↓ (consume)
Backend (Tauri commands / API REST / Supabase)
        ↓
SQLite / Base de datos
```

---

## 💻 Guía de Desarrollo

### Crear un Nuevo Componente UI

```typescript
// src/components/MyComponent.tsx
import React from 'react'
import { Button } from './ui/button'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button onClick={onAction} className="mt-4">
        Ejecutar
      </Button>
    </div>
  )
}
```

### Usar el Hook useStudents

```typescript
// En cualquier componente
import { useStudents } from '../hooks/useStudents'

export function MyStudentList() {
  const { 
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    loading,
    error
  } = useStudents()

  if (loading) return <p>Cargando estudiantes...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <ul>
      {students.map(student => (
        <li key={student.id}>{student.name}</li>
      ))}
    </ul>
  )
}
```

### Acceder al Contexto de Autenticación

```typescript
// En cualquier componente
import { useAuth } from '../contexts/AuthContext'

export function UserProfile() {
  const { user, isAuthenticated, logout, login } = useAuth()

  if (!isAuthenticated) {
    return <p>No autenticado</p>
  }

  return (
    <div>
      <p>Bienvenido, {user?.name}</p>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}
```

### Crear una Nueva Página

1. Crear archivo en `src/pages/MyPage.tsx`:

```typescript
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Nueva Página</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Contenido aquí</p>
      </CardContent>
    </Card>
  )
}
```

2. Añadir ruta en `src/routes.tsx`:

```typescript
import { MyPage } from './pages/MyPage'

const routes: RouteObject[] = [
  // ... otras rutas
  {
    path: '/mi-pagina',
    element: (
      <ProtectedRoute>
        <Layout>
          <MyPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
]
```

### Usar Componentes UI de Radix

Ejemplos de componentes disponibles:

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { AlertDialog, AlertDialogContent } from './ui/alert-dialog'
```

Todos con **Tailwind CSS** preconfigurado.

---

## 🌐 Desarrollo Web

### Inicio rápido

```bash
npm install
npm run dev
```

La app estará en `http://localhost:1420`

### Características en modo web

- ✅ Desarrollo rápido con HMR (Hot Module Replacement)
- ✅ Datos en localStorage (desarrollo)
- ✅ Sin requerimientos de Rust
- ✅ Perfecto para diseño y frontend

### Consideraciones

- Los datos se guardan en `localStorage` del navegador
- Limitado a ~10MB de almacenamiento
- Se borran si se limpian datos del navegador
- Sincronización manual o con API necesaria para persistencia real

---

## 🖥️ Desarrollo Desktop con Tauri

### Requisitos adicionales

**Windows:**
```bash
# Instalar Visual Studio Build Tools
# O Visual Studio Community con soporte C++
```

**macOS:**
```bash
# Instalar Xcode
xcode-select --install
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  rsvg-convert
```

### Iniciar desarrollo

```bash
npm run tauri:dev
```

Esto:
1. Compila el backend Rust
2. Inicia el servidor Vite
3. Abre la ventana desktop

### Características en desktop

- ✅ Base de datos SQLite integrada
- ✅ Funciona offline completamente
- ✅ Mejor rendimiento que web
- ✅ Acceso a APIs del sistema operativo
- ✅ Icono en taskbar/dock

### Comandos útiles

```bash
# Limpiar caché de compilación
npm run tauri -- build --reset

# Generar capacidades
npm run tauri -- build --target x86_64-unknown-linux-gnu

# Ver logs de Tauri
npm run tauri:dev -- --verbose
```

---

## 📦 Compilación para Escritorio

### Windows

```bash
npm run tauri:build
```

Genera:
- **Ejecutable**: `src-tauri/target/release/gym_dashboard.exe`
- **Instalador NSIS**: `src-tauri/target/release/bundle/nsis/`

Requisitos:
- Visual Studio Build Tools
- Rust toolchain

### macOS

```bash
npm run tauri:build
```

Genera:
- **App Bundle**: `src-tauri/target/release/GymDashboard.app`
- **DMG Installer**: `src-tauri/target/release/bundle/dmg/`

Requisitos:
- Xcode
- Apple Developer Account (para notarización)

### Linux

```bash
npm run tauri:build
```

Genera:
- **AppImage**: `src-tauri/target/release/bundle/appimage/`
- **.deb**: `src-tauri/target/release/bundle/deb/`
- **.rpm**: `src-tauri/target/release/bundle/rpm/`

### Configuración de Build

Editar `src-tauri/tauri.conf.json`:

```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:1420",
    "frontendDist": "../dist"
  },
  "app": {
    "name": "Gym Dashboard",
    "version": "1.0.0",
    "windows": [
      {
        "title": "GymControl",
        "width": 1200,
        "height": 800,
        "minWidth": 1000,
        "minHeight": 600
      }
    ]
  }
}
```

---

## 📱 Desarrollo iOS

### Preparación (solo en macOS)

```bash
npm run tauri:ios:init
```

Esto crea la estructura de proyecto iOS.

### Desarrollo

```bash
npm run tauri:ios:dev
```

Se abrirá Xcode donde puedes compilar y ejecutar en simulador.

### Limitaciones

- ⚠️ Solo compilable desde macOS
- ⚠️ Requiere Xcode 14+
- ⚠️ Tauri 2 mobile aún en desarrollo
- ⚠️ Algunas APIs pueden no estar disponibles

---

## 🔐 Autenticación

### Sistema de Login

```typescript
// Credenciales por defecto (desarrollo)
Username: admin
Password: (según backend)

// En Tauri: lee credenciales del sistema
// En Web: conectar a API REST/Supabase
```

### Flujo de Sesión

1. **Login**: Se validan credenciales
2. **Token**: Se obtiene JWT o session token
3. **Persistencia**: Se guarda en sesión
4. **Autenticación**: Se restaura en reinicio

### Protección de Rutas

```typescript
// Ruta protegida
<ProtectedRoute>
  <Layout>
    <MyPage />
  </Layout>
</ProtectedRoute>

// Si no está autenticado → redirige a /login
```

---

## 🗄️ Gestión de Base de Datos

### SQLite en Tauri

```rust
// src-tauri/src/db.rs
use rusqlite::{Connection, params};

pub fn init_database() -> Result<Connection> {
    let conn = Connection::open("gym_control.db")?;
    
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS students (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            subscription_start DATE,
            subscription_end DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            student_id TEXT,
            amount REAL,
            paid_date DATE,
            FOREIGN KEY(student_id) REFERENCES students(id)
        );
        
        CREATE TABLE IF NOT EXISTS gym_profile (
            id TEXT PRIMARY KEY,
            name TEXT,
            address TEXT,
            phone TEXT
        );"
    )?;
    
    Ok(conn)
}
```

### Ejecutar Comandos desde Frontend

```typescript
// En React
import { invoke } from '@tauri-apps/api/core'

const students = await invoke('get_students')
const newStudent = await invoke('add_student', {
  name: 'Juan',
  email: 'juan@example.com'
})
```

### Servidor Supabase (Alternativa)

Para usar Supabase en producción:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

const { data: students } = await supabase
  .from('students')
  .select()
```

---

## 🐛 Solución de Problemas

### Error: "No se encuentra Rust"

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Agregar PATH
source $HOME/.cargo/env
```

### Error: "Puerto 1420 en uso"

```bash
# Cambiar puerto en vite.config.ts
server: {
  port: 3000,
  strictPort: true,
}
```

### Error: "Cannot find module @tauri-apps/api"

```bash
npm install @tauri-apps/api@^2.0.0
```

### Error al compilar en Windows

Instalar Visual Studio Build Tools:
1. Descargar desde https://visualstudio.microsoft.com/es/downloads/
2. Instalar con "Desktop development with C++"

### Tauri dev se congela

```bash
# Matar procesos existentes
pkill -f "cargo"
pkill -f "tauri"

# Limpiar caché
rm -rf src-tauri/target

# Intentar nuevamente
npm run tauri:dev
```

### Los datos no persisten

- ✅ Verificar que `isTauriApp` retorna true
- ✅ Revisar permisos en `capabilities/default.json`
- ✅ Comprobar base de datos en `~/.gym_control/`

### Logs de depuración

```bash
# Desarrollo con logs
npm run tauri:dev -- --verbose

# Logs en Rust
RUST_LOG=debug npm run tauri:dev
```

---

## 📦 Dependencias Principales

### Frontend
- **React 18**: UI
- **TypeScript**: Tipado
- **Vite**: Bundler
- **React Router v6**: Routing
- **Tailwind CSS**: Estilos
- **Radix UI**: Componentes accesibles
- **Lucide React**: Iconos
- **Supabase**: Backend opcional

### Backend (Rust)
- **Tauri 2**: Framework desktop
- **SQLite**: Base de datos
- **Serde**: Serialización
- **Chrono**: Fechas

---

## 📞 Contribuciones y Soporte

Para reportar bugs o sugerencias:
1. Crear un issue en el repositorio
2. Describir el problema detalladamente
3. Proporcionar pasos para reproducir

---

## 📄 Licencia

Propiedad de **RFGym**. Todos los derechos reservados.

---

## 📚 Recursos Útiles

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última actualización**: 29 de abril de 2026  
**Versión**: 1.0.0  
**Estado**: En desarrollo activo
