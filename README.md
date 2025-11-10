
# 📬 Kata Junior Buzón - Sistema de Gestión de Aprobaciones

Sistema **fullstack** para la gestión de flujos de trabajo y procesos de aprobación en organizaciones, desarrollado con **NestJS y Angular** usando **arquitectura hexagonal**.

---

## 🧩 Descripción

**Buzón de solicitudes** es una plataforma robusta diseñada para automatizar procesos de aprobación, permitiendo a las organizaciones gestionar solicitudes, flujos de trabajo y notificaciones de manera eficiente.

---

## ⚙️ Tecnologías

### 🖥️ Backend
- **NestJS** – Framework modular para Node.js  
- **TypeScript** – Lenguaje tipado para mayor robustez  
- **Prisma ORM** – Gestión de base de datos y modelos  
- **SQLite** – Base de datos para desarrollo  
- **JWT** – Autenticación y autorización  
- **Passport** – Estrategias de autenticación  
- **Class Validator** – Validación de DTOs  

### 💻 Frontend
- **Angular** – Interfaz de usuario  
- **CSS** – Estilos y diseño  

---

## 🧱 Arquitectura

### 🧩 Patrones de diseño implementados
- **Arquitectura Hexagonal** – Separación clara de responsabilidades  
- **Domain-Driven Design (DDD)** – Diseño centrado en el dominio  
- **Repository Pattern** – Abstracción del acceso a datos  
- **Service Layer** – Lógica de negocio centralizada  
- **Strategy Pattern** – Múltiples estrategias de notificación  
- **Observer Pattern** – Sistema de eventos y notificaciones  

---

## 🚀 Instalación y Configuración

### 🔧 Prerrequisitos

* Node.js 18+
* npm o yarn
* SQLite (para entorno de desarrollo)

### 📥 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jniet15/kata-junior-buzon.git

# Navegar al directorio del backend
cd kata-junior-buzon/backend/kata-buzon

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Poblar base de datos con datos de prueba
npx prisma db seed
```

---

## 💻 Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar con watch mode
npm run start:debug

# Ejecutar tests unitarios
npm test

# Ejecutar tests end-to-end
npm run test:e2e
```

---

## 🏭 Producción

```bash
# Build del proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

---

## 📡 API Endpoints

### 🔐 Autenticación

| Método | Endpoint         | Descripción               |
| ------ | ---------------- | ------------------------- |
| POST   | `/auth/login`    | Iniciar sesión            |
| POST   | `/auth/register` | Registrar usuario         |
| GET    | `/auth/profile`  | Obtener perfil de usuario |
| POST   | `/auth/refresh`  | Refrescar token           |

### 📨 Solicitudes

| Método | Endpoint                      | Descripción              |
| ------ | ----------------------------- | ------------------------ |
| POST   | `/requests`                   | Crear solicitud          |
| GET    | `/requests`                   | Listar solicitudes       |
| GET    | `/requests/:id`               | Obtener solicitud por ID |
| PATCH  | `/requests/:id/status`        | Actualizar estado        |
| GET    | `/requests/my-requests`       | Mis solicitudes          |
| GET    | `/requests/pending-approvals` | Aprobaciones pendientes  |
| GET    | `/requests/stats`             | Estadísticas             |

### 🧪 Ejemplos

| Método | Endpoint             | Descripción        |
| ------ | -------------------- | ------------------ |
| GET    | `/example/public`    | Endpoint público   |
| GET    | `/example/protected` | Endpoint protegido |
| GET    | `/example/profile`   | Perfil de usuario  |

**Endpoints disponibles en producción:**

* `GET /example/public`
* `POST /auth/login`
* `GET /requests`
* `GET /health`

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 🌟 Características Principales

### 🔧 Módulos Implementados

* **Gestión de Usuarios** – Autenticación y autorización
* **Sistema de Solicitudes** – Creación y gestión
* **Flujos de Aprobación** – Workflows configurables
* **Sistema de Notificaciones** – Múltiples canales
* **Reporting** – Estadísticas y métricas

### ✅ Calidad de Código

* **100% TypeScript** – Tipado estático
* **Testing** – Unit e integration tests
* **ESLint + Prettier** – Estándares de código
* **Validaciones** – DTO validation

---

## 🤝 Contribución

1. Haz un **fork** del proyecto
2. Crea una rama de característica

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Realiza tus cambios y haz commit

   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Haz push de la rama

   ```bash
   git push origin feature/AmazingFeature
   ```
5. Abre un **Pull Request**

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** – consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

* **David Nieto** – [jniet15](https://github.com/jniet15)
