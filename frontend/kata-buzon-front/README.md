Repositorio
Kata Junior Buzón - Sistema de Gestión de Aprobaciones
Sistema backend para la gestión de flujos de trabajo y procesos de aprobación en organizaciones, desarrollado con NestJS y arquitectura hexagonal.

Descripción
Kata Buzón es una plataforma robusta para automatizar procesos de aprobación, permitiendo a las organizaciones gestionar solicitudes, flujos de trabajo y notificaciones de manera eficiente.

Tecnologías
Backend
NestJS - Framework modular para Node.js

TypeScript - Lenguaje tipado para mayor robustez

Prisma ORM - Base de datos y gestión de modelos

SQLite - Base de datos para desarrollo

JWT - Autenticación y autorización

Passport - Estrategias de autenticación

Class Validator - Validación de DTOs

Frontend (Por implementar)
Angular - Interfaz de usuario

CSS - Estilos y diseño

Arquitectura
Patrones de Diseño Implementados
Arquitectura Hexagonal - Separación clara de responsabilidades

Domain-Driven Design (DDD) - Diseño centrado en el dominio

Repository Pattern - Abstracción del acceso a datos

Service Layer - Lógica de negocio centralizada

Strategy Pattern - Múltiples estrategias de notificación

Observer Pattern - Sistema de eventos y notificaciones

Estructura del Proyecto
text
src/
├── domain/           # Entidades y lógica de negocio
│   ├── entities/     # Approval, User, Workflow
│   ├── value-objects/# ApprovalStatus, Priority
│   └── events/       # Domain Events
├── application/      # Casos de uso y servicios
│   ├── services/     # ApprovalService, NotificationService
│   └── dto/          # Data Transfer Objects
├── infrastructure/   # Implementaciones concretas
│   ├── persistence/  # Repositories con Prisma
│   ├── external/     # APIs externas
│   └── config/       # Configuración
└── presentation/     # Controladores y endpoints
    ├── controllers/  # ApprovalController, UserController
    └── decorators/   # Validaciones personalizadas
Instalación y Configuración
Prerrequisitos
Node.js 18+

npm o yarn

SQLite (para desarrollo)

Instalación
bash
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
Desarrollo
bash
# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar con watch mode
npm run start:debug

# Ejecutar tests
npm test

# Ejecutar tests e2e
npm run test:e2e
Producción
bash
# Build del proyecto
npm run build

# Ejecutar en producción
npm run start:prod
API Endpoints
Autenticación
POST /auth/login - Iniciar sesión

POST /auth/register - Registrar usuario

GET /auth/profile - Perfil de usuario

POST /auth/refresh - Refresh token

Solicitudes
POST /requests - Crear solicitud

GET /requests - Listar solicitudes

GET /requests/:id - Obtener solicitud por ID

PATCH /requests/:id/status - Actualizar estado

GET /requests/my-requests - Mis solicitudes

GET /requests/pending-approvals - Aprobaciones pendientes

GET /requests/stats - Estadísticas

Ejemplo
GET /example/public - Endpoint público

GET /example/protected - Endpoint protegido

GET /example/profile - Perfil de usuario


Endpoints disponibles en producción:
GET /example/public

POST /auth/login

GET /requests

GET /health

🧪 Testing
bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
Características Principales
Módulos Implementados
Gestión de Usuarios - Autenticación y autorización

Sistema de Solicitudes - Creación y gestión

Flujos de Aprobación - Workflows configurables

Sistema de Notificaciones - Múltiples canales

Reporting - Estadísticas y métricas

Calidad de Código
100% TypeScript - Tipado estático

Testing - Unit tests e integration tests

ESLint + Prettier - Estándares de código

Validaciones - DTO validation

Contribución
Fork el proyecto

Crear una rama feature (git checkout -b feature/AmazingFeature)

Commit cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abrir un Pull Request

Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para detalles.

Autores
David Nieto - jniet15

Agradecimientos
NestJS team por el excelente framework

Prisma por el ORM moderno

Render por el hosting gratuito



This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
