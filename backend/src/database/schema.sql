-- ============================================================
-- Base de Datos: clinica_odontologica
-- Sistema de Farmacia Dental - Clínica Odontológica
-- ============================================================

CREATE DATABASE IF NOT EXISTS clinica_odontologica CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE clinica_odontologica;

-- ============================================================
-- TABLAS CATÁLOGO / LOOKUP
-- ============================================================

CREATE TABLE IF NOT EXISTS ESTADO_USUARIO (
  id_estado_usuario INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TIPO_NOTIFICACION (
  id_tipo_notificacion INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TIPO_DOCUMENTO (
  id_tipo_documento INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ESTADO_CITA (
  id_estado_cita INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ESTADO_INSUMO (
  id_estado_insumo INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- USUARIO
-- ============================================================

CREATE TABLE IF NOT EXISTS USUARIO (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL,
  id_estado_usuario INT NOT NULL,
  requiere_cambio_password TINYINT(1) DEFAULT 0,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_estado_usuario) REFERENCES ESTADO_USUARIO(id_estado_usuario)
);

-- ============================================================
-- NOTIFICACION
-- ============================================================

CREATE TABLE IF NOT EXISTS NOTIFICACION (
  id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  id_tipo_notificacion INT NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
  FOREIGN KEY (id_tipo_notificacion) REFERENCES TIPO_NOTIFICACION(id_tipo_notificacion)
);

-- ============================================================
-- PACIENTE
-- ============================================================

CREATE TABLE IF NOT EXISTS PACIENTE (
  id_paciente INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  documento_identidad VARCHAR(50),
  fecha_nacimiento DATE NOT NULL,
  sexo VARCHAR(10) NOT NULL,
  alergias VARCHAR(255),
  tipo_sangre VARCHAR(10),
  telefono VARCHAR(20),
  correo VARCHAR(150),
  direccion VARCHAR(255),
  contacto_emergencia_nombre VARCHAR(100),
  contacto_emergencia_telefono VARCHAR(20),
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- ============================================================
-- CITA (necesaria para CONSULTA_CLINICA y DOCUMENTO_PACIENTE)
-- ============================================================

CREATE TABLE IF NOT EXISTS CITA (
  id_cita INT PRIMARY KEY AUTO_INCREMENT,
  id_paciente INT NOT NULL,
  id_odontologo INT NOT NULL,
  id_estado_cita INT NOT NULL,
  fecha_cita DATETIME NOT NULL,
  motivo VARCHAR(255),
  notas VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente),
  FOREIGN KEY (id_estado_cita) REFERENCES ESTADO_CITA(id_estado_cita)
);

-- ============================================================
-- HISTORIAL_CLINICO
-- ============================================================

CREATE TABLE IF NOT EXISTS HISTORIAL_CLINICO (
  id_historial INT PRIMARY KEY AUTO_INCREMENT,
  id_paciente INT NOT NULL,
  observaciones VARCHAR(255),
  fecha_apertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente)
);

-- ============================================================
-- ODONTOLOGO
-- ============================================================

CREATE TABLE IF NOT EXISTS ODONTOLOGO (
  id_odontologo INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  especialidad VARCHAR(100),
  cedula_profesional VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- ============================================================
-- CONSULTA_CLINICA
-- ============================================================

CREATE TABLE IF NOT EXISTS CONSULTA_CLINICA (
  id_consulta INT PRIMARY KEY AUTO_INCREMENT,
  id_historial INT NOT NULL,
  id_cita INT,
  id_odontologo INT NOT NULL,
  fecha_consulta DATETIME NOT NULL,
  motivo_consulta VARCHAR(255) NOT NULL,
  diagnostico VARCHAR(255) NOT NULL,
  tratamiento VARCHAR(255) NOT NULL,
  notas VARCHAR(255),
  FOREIGN KEY (id_historial) REFERENCES HISTORIAL_CLINICO(id_historial),
  FOREIGN KEY (id_cita) REFERENCES CITA(id_cita),
  FOREIGN KEY (id_odontologo) REFERENCES ODONTOLOGO(id_odontologo)
);

-- ============================================================
-- DOCUMENTO_PACIENTE
-- ============================================================

CREATE TABLE IF NOT EXISTS DOCUMENTO_PACIENTE (
  id_documento INT PRIMARY KEY AUTO_INCREMENT,
  id_paciente INT NOT NULL,
  id_consulta INT,
  id_tipo_documento INT NOT NULL,
  nombre_archivo VARCHAR(150) NOT NULL,
  ruta_archivo VARCHAR(255) NOT NULL,
  fecha_subida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente),
  FOREIGN KEY (id_consulta) REFERENCES CONSULTA_CLINICA(id_consulta),
  FOREIGN KEY (id_tipo_documento) REFERENCES TIPO_DOCUMENTO(id_tipo_documento)
);

-- ============================================================
-- RECETA
-- ============================================================

CREATE TABLE IF NOT EXISTS RECETA (
  id_receta INT PRIMARY KEY AUTO_INCREMENT,
  id_consulta INT NOT NULL,
  fecha_receta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  indicaciones_generales VARCHAR(255),
  FOREIGN KEY (id_consulta) REFERENCES CONSULTA_CLINICA(id_consulta)
);

-- ============================================================
-- MEDICAMENTO
-- ============================================================

CREATE TABLE IF NOT EXISTS MEDICAMENTO (
  id_medicamento INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  presentacion VARCHAR(100),
  via_administracion VARCHAR(100),
  requiere_receta BOOLEAN NOT NULL DEFAULT FALSE,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- RECETA_DETALLE
-- ============================================================

CREATE TABLE IF NOT EXISTS RECETA_DETALLE (
  id_receta_detalle INT PRIMARY KEY AUTO_INCREMENT,
  id_receta INT NOT NULL,
  id_medicamento INT NOT NULL,
  dosis VARCHAR(50) NOT NULL,
  frecuencia VARCHAR(50) NOT NULL,
  duracion VARCHAR(50) NOT NULL,
  cantidad_indicada VARCHAR(50) NOT NULL,
  instrucciones VARCHAR(255),
  FOREIGN KEY (id_receta) REFERENCES RECETA(id_receta),
  FOREIGN KEY (id_medicamento) REFERENCES MEDICAMENTO(id_medicamento)
);

-- ============================================================
-- INSUMO_CLINICO
-- ============================================================

CREATE TABLE IF NOT EXISTS INSUMO_CLINICO (
  id_insumo INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  categoria VARCHAR(100) NOT NULL,
  unidad_medida VARCHAR(50) NOT NULL,
  stock_minimo INT NOT NULL DEFAULT 0,
  id_estado_insumo INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_estado_insumo) REFERENCES ESTADO_INSUMO(id_estado_insumo)
);

-- ============================================================
-- PROVEEDOR
-- ============================================================

CREATE TABLE IF NOT EXISTS PROVEEDOR (
  id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
  nombre_proveedor VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  correo VARCHAR(150),
  direccion VARCHAR(255),
  contacto VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- LOTE_INSUMO
-- ============================================================

CREATE TABLE IF NOT EXISTS LOTE_INSUMO (
  id_lote INT PRIMARY KEY AUTO_INCREMENT,
  id_insumo INT NOT NULL,
  id_proveedor INT NOT NULL,
  numero_lote VARCHAR(50) NOT NULL,
  fecha_ingreso DATETIME NOT NULL,
  fecha_vencimiento DATETIME NOT NULL,
  cantidad_inicial INT NOT NULL,
  cantidad_disponible INT NOT NULL,
  observaciones VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_insumo) REFERENCES INSUMO_CLINICO(id_insumo),
  FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor)
);

-- ============================================================
-- MOVIMIENTO_INVENTARIO
-- ============================================================

CREATE TABLE IF NOT EXISTS MOVIMIENTO_INVENTARIO (
  id_movimiento INT PRIMARY KEY AUTO_INCREMENT,
  id_lote INT NOT NULL,
  id_usuario INT NOT NULL,
  tipo_movimiento VARCHAR(50) NOT NULL,
  fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  motivo VARCHAR(255),
  observaciones VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_lote) REFERENCES LOTE_INSUMO(id_lote),
  FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- ============================================================
-- DATOS INICIALES (SEED DATA)
-- ============================================================

-- Estados de usuario
INSERT IGNORE INTO ESTADO_USUARIO (codigo, nombre, descripcion, activo) VALUES
  ('ACTIVO', 'Activo', 'Usuario activo en el sistema', TRUE),
  ('INACTIVO', 'Inactivo', 'Usuario inactivo en el sistema', TRUE),
  ('SUSPENDIDO', 'Suspendido', 'Usuario suspendido temporalmente', TRUE);

-- Tipos de notificación
INSERT IGNORE INTO TIPO_NOTIFICACION (codigo, nombre, descripcion, activo) VALUES
  ('CITA', 'Cita', 'Notificación relacionada con citas', TRUE),
  ('STOCK', 'Stock Bajo', 'Notificación de stock bajo de medicamentos', TRUE),
  ('SISTEMA', 'Sistema', 'Notificación del sistema', TRUE),
  ('RECETA', 'Receta', 'Notificación de nueva receta', TRUE);

-- Tipos de documento
INSERT IGNORE INTO TIPO_DOCUMENTO (codigo, nombre, descripcion, activo) VALUES
  ('RADIOGRAFIA', 'Radiografía', 'Imagen de radiografía dental', TRUE),
  ('CONSENTIMIENTO', 'Consentimiento', 'Formulario de consentimiento informado', TRUE),
  ('PRESUPUESTO', 'Presupuesto', 'Presupuesto de tratamiento', TRUE),
  ('OTRO', 'Otro', 'Otro tipo de documento', TRUE);

-- Estados de cita
INSERT IGNORE INTO ESTADO_CITA (codigo, nombre, descripcion, activo) VALUES
  ('PENDIENTE', 'Pendiente', 'Cita programada pendiente', TRUE),
  ('CONFIRMADA', 'Confirmada', 'Cita confirmada por el paciente', TRUE),
  ('COMPLETADA', 'Completada', 'Cita realizada', TRUE),
  ('CANCELADA', 'Cancelada', 'Cita cancelada', TRUE),
  ('NO_ASISTIO', 'No Asistió', 'El paciente no se presentó', TRUE);

-- Estados de insumo
INSERT IGNORE INTO ESTADO_INSUMO (codigo, nombre, descripcion, activo) VALUES
  ('DISPONIBLE', 'Disponible', 'Insumo disponible para uso', TRUE),
  ('AGOTADO', 'Agotado', 'Insumo sin stock', TRUE),
  ('DESCONTINUADO', 'Descontinuado', 'Insumo fuera de uso', TRUE);

-- Usuario administrador por defecto (password: Admin1234!)
-- bcrypt hash de "Admin1234!"
INSERT IGNORE INTO USUARIO (nombre, apellido, correo, password_hash, rol, id_estado_usuario) VALUES
  ('Admin', 'Sistema', 'admin@clinica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1),
  ('Doctor', 'Demo', 'doctor@clinica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dentista', 1),
  ('Asistente', 'Demo', 'asistente@clinica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'asistente', 1);

-- Medicamentos de ejemplo
INSERT IGNORE INTO MEDICAMENTO (nombre, descripcion, presentacion, via_administracion, requiere_receta, estado) VALUES
  ('Anestésico Local (Lidocaína)', 'Anestésico local para procedimientos dentales', 'Ampolla 2ml', 'Inyectable', TRUE, 'activo'),
  ('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 'Cápsula', 'Oral', TRUE, 'activo'),
  ('Ibuprofeno 400mg', 'Antiinflamatorio y analgésico', 'Tableta', 'Oral', FALSE, 'activo'),
  ('Paracetamol 500mg', 'Analgésico y antipirético', 'Tableta', 'Oral', FALSE, 'activo'),
  ('Clorhexidina 0.12%', 'Enjuague bucal antiséptico', 'Solución 250ml', 'Tópica', FALSE, 'activo');

-- Estado insumo y proveedor de ejemplo
INSERT IGNORE INTO PROVEEDOR (nombre_proveedor, telefono, correo, direccion, contacto) VALUES
  ('Distribuidora Dental El Salvador', '2222-3333', 'ventas@dentalsa.com', 'San Salvador, El Salvador', 'Juan Pérez'),
  ('Farmacéutica Nacional', '2444-5555', 'info@farmanacional.com', 'Santa Ana, El Salvador', 'María López');

-- ============================================================
-- VENTA (Facturación de medicamentos)
-- ============================================================

CREATE TABLE IF NOT EXISTS VENTA (
  id_venta INT PRIMARY KEY AUTO_INCREMENT,
  id_paciente INT,
  id_usuario INT NOT NULL,
  numero_factura VARCHAR(50) NOT NULL UNIQUE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  impuesto DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  metodo_pago VARCHAR(50) NOT NULL DEFAULT 'Efectivo',
  estado VARCHAR(20) NOT NULL DEFAULT 'pagado',
  notas TEXT,
  fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_paciente) REFERENCES PACIENTE(id_paciente) ON DELETE SET NULL,
  FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

CREATE TABLE IF NOT EXISTS VENTA_DETALLE (
  id_detalle INT PRIMARY KEY AUTO_INCREMENT,
  id_venta INT NOT NULL,
  id_medicamento INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal_item DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_venta) REFERENCES VENTA(id_venta) ON DELETE CASCADE,
  FOREIGN KEY (id_medicamento) REFERENCES MEDICAMENTO(id_medicamento)
);

