# 🦷 Clínica Odontológica - Sistema de Farmacia Dental

 `clinica-odontologica`.

```
clinica-odontologica/
├── frontend/    → React + Vite + TypeScript (Dashboard UI)
└── backend/     → Node.js + Express + MySQL (REST API)
```

---

## Inicio Rápido

### 1. Configurar la Base de Datos

Asegúrate de tener MySQL instalado y corriendo. Luego edita `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=clinica_odontologica
JWT_SECRET=clinica_odontologica_secret_2026_muy_seguro
FRONTEND_URL=http://localhost:5173
```

### 2. Inicializar la Base de Datos

```bash
cd backend
npm install
npm run db:init
```

### 3. Iniciar el Backend

```bash
cd backend
npm run dev   # con nodemon (hot reload)
# o
npm start     # producción
```

El servidor corre en: **http://localhost:3001**

### 4. Iniciar el Frontend

```bash
cd frontend
npm install   # si no tiene node_modules
npm run dev
```

El frontend corre en: **http://localhost:5173**

---

##  Usuarios de Prueba

| Correo | Password | Rol |
|--------|----------|-----|
| admin@clinica.com | password | Admin |
| doctor@clinica.com | password | Dentista |
| asistente@clinica.com | password | Asistente |

---


