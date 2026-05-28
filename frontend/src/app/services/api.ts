// Configuración base de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Obtener token del localStorage dependiendo de la ruta
const getToken = () => {
  if (window.location.pathname.includes('/patient')) {
    return localStorage.getItem('patientToken') || localStorage.getItem('authToken');
  }
  return localStorage.getItem('authToken') || localStorage.getItem('patientToken');
};

// Headers con autenticación
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// Función genérica de fetch
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) },
  });

  if ((response.status === 401 || response.status === 403) && !endpoint.includes('/auth/login')) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientData');
    
    // Si estamos en una ruta de paciente, redirigimos al login de paciente
    if (window.location.pathname.includes('/patient')) {
      window.location.href = '/patient/login';
    } else {
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data;
};

// ============================================================
// AUTH
// ============================================================
export const authApi = {
  login: (correo: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, password }),
    }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  recuperarPassword: (correo: string) =>
    apiFetch('/auth/recuperar-password', {
      method: 'POST',
      body: JSON.stringify({ correo }),
    }),
  cambiarPasswordTemporal: (data: { correo: string; password_actual: string; password_nueva: string }) =>
    apiFetch('/auth/cambiar-password-temporal', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================================
// PACIENTES
// ============================================================
export const pacientesApi = {
  getAll: () => apiFetch('/pacientes'),
  getById: (id: number | string) => apiFetch(`/pacientes/${id}`),
  create: (data: object) =>
    apiFetch('/pacientes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number | string) =>
    apiFetch(`/pacientes/${id}`, { method: 'DELETE' }),
  getMiPerfil: () => apiFetch('/pacientes/perfil/me'),
  getMisCitas: () => apiFetch('/pacientes/perfil/me/citas'),
  getMiHistorial: () => apiFetch('/pacientes/perfil/me/historial'),
  getMisRecetas: () => apiFetch('/pacientes/perfil/me/recetas'),
  getHistorial: (id: number | string) => apiFetch(`/pacientes/${id}/historial`),
};

// ============================================================
// MEDICAMENTOS
// ============================================================
export const medicamentosApi = {
  getAll: () => apiFetch('/medicamentos'),
  getById: (id: number | string) => apiFetch(`/medicamentos/${id}`),
  create: (data: object) =>
    apiFetch('/medicamentos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/medicamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number | string) =>
    apiFetch(`/medicamentos/${id}`, { method: 'DELETE' }),
};

// ============================================================
// INSUMOS
// ============================================================
export const insumosApi = {
  getAll: () => apiFetch('/insumos'),
  getById: (id: number | string) => apiFetch(`/insumos/${id}`),
  create: (data: object) =>
    apiFetch('/insumos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/insumos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number | string) =>
    apiFetch(`/insumos/${id}`, { method: 'DELETE' }),
  getStock: (id: number | string) => apiFetch(`/insumos/${id}/stock`),
  addStock: (id: number | string, cantidad: number) =>
    apiFetch(`/insumos/${id}/stock`, { method: 'POST', body: JSON.stringify({ cantidad }) }),
};

// ============================================================
// PROVEEDORES
// ============================================================
export const proveedoresApi = {
  getAll: () => apiFetch('/proveedores'),
  create: (data: object) =>
    apiFetch('/proveedores', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/proveedores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number | string) =>
    apiFetch(`/proveedores/${id}`, { method: 'DELETE' }),
};

// ============================================================
// LOTES
// ============================================================
export const lotesApi = {
  getAll: () => apiFetch('/lotes'),
  getById: (id: number | string) => apiFetch(`/lotes/${id}`),
  create: (data: object) =>
    apiFetch('/lotes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/lotes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ============================================================
// MOVIMIENTOS DE INVENTARIO
// ============================================================
export const movimientosApi = {
  getAll: () => apiFetch('/movimientos'),
  create: (data: object) =>
    apiFetch('/movimientos', { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================================
// CONSULTAS CLÍNICAS
// ============================================================
export const consultasApi = {
  getAll: () => apiFetch('/consultas'),
  getById: (id: number | string) => apiFetch(`/consultas/${id}`),
  create: (data: object) =>
    apiFetch('/consultas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/consultas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ============================================================
// RECETAS
// ============================================================
export const recetasApi = {
  getAll: () => apiFetch('/recetas'),
  getById: (id: number | string) => apiFetch(`/recetas/${id}`),
  create: (data: object) =>
    apiFetch('/recetas', { method: 'POST', body: JSON.stringify(data) }),
  getByPaciente: (id: number | string) => apiFetch(`/recetas/paciente/${id}`),
};

// ============================================================
// NOTAS CLÍNICAS
// ============================================================
export const notasApi = {
  getByPaciente: (id: number | string) => apiFetch(`/notas/paciente/${id}`),
  create: (data: object) =>
    apiFetch('/notas', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number | string) =>
    apiFetch(`/notas/${id}`, { method: 'DELETE' }),
};


// ============================================================
// NOTIFICACIONES
// ============================================================
export const notificacionesApi = {
  getAll: () => apiFetch('/notificaciones'),
  marcarLeida: (id: number | string) =>
    apiFetch(`/notificaciones/${id}/leer`, { method: 'PATCH' }),
  marcarTodasLeidas: () =>
    apiFetch('/notificaciones/leer-todas', { method: 'PATCH' }),
  create: (data: object) =>
    apiFetch('/notificaciones', { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================================
// USUARIOS
// ============================================================
export const usuariosApi = {
  getAll: () => apiFetch('/usuarios'),
  getById: (id: number | string) => apiFetch(`/usuarios/${id}`),
  create: (data: object) =>
    apiFetch('/usuarios', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cambiarPassword: (id: number | string, data: object) =>
    apiFetch(`/usuarios/${id}/cambiar-password`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// ============================================================
// ODONTÓLOGOS
// ============================================================
export const odontologosApi = {
  getAll: () => apiFetch('/odontologos'),
  getById: (id: number | string) => apiFetch(`/odontologos/${id}`),
  create: (data: object) =>
    apiFetch('/odontologos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/odontologos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number | string) =>
    apiFetch(`/odontologos/${id}`, { method: 'DELETE' }),
};

// ============================================================
// STATS (Dashboard & Reportes)
// ============================================================
export const statsApi = {
  get: () => apiFetch('/stats'),
};

// ============================================================
// CITAS
// ============================================================
export const citasApi = {
  getAll: () => apiFetch('/citas'),
  getById: (id: number | string) => apiFetch(`/citas/${id}`),
  create: (data: object) =>
    apiFetch('/citas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number | string, data: object) =>
    apiFetch(`/citas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number | string) =>
    apiFetch(`/citas/${id}`, { method: 'DELETE' }),
};

// ============================================================
// ODONTOGRAMA
// ============================================================
export const odontogramaApi = {
  getByPaciente: (id: number | string) => apiFetch(`/odontograma/${id}`),
  save: (id: number | string, datos: object) =>
    apiFetch(`/odontograma/${id}`, { method: 'POST', body: JSON.stringify({ datos }) }),
};

// ============================================================
// AUDITORIA / LOGS
// ============================================================
export const logsApi = {
  getAll: () => apiFetch('/logs'),
};

export default {
  auth: authApi,
  pacientes: pacientesApi,
  medicamentos: medicamentosApi,
  insumos: insumosApi,
  proveedores: proveedoresApi,
  lotes: lotesApi,
  movimientos: movimientosApi,
  consultas: consultasApi,
  recetas: recetasApi,
  notificaciones: notificacionesApi,
  usuarios: usuariosApi,
  odontologos: odontologosApi,
  stats: statsApi,
  citas: citasApi,
  odontograma: odontogramaApi,
  logs: logsApi,
};
