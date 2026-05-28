-- ============================================================
-- Base de Datos: clinica_odontologica
-- Sistema de Gestión - Clínica Odontológica
-- ============================================================
-- INSTRUCCIONES DE IMPORTACIÓN:
--
--   Opción 1 (línea de comandos):
--     mysql -u root -p < clinica_odontologica.sql
--
--   Opción 2 (phpMyAdmin / DBeaver / MySQL Workbench):
--     Importar este archivo directamente desde la interfaz.
--
-- La base de datos se crea automáticamente si no existe.
-- ============================================================

/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.6-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: clinica_odontologica
-- ------------------------------------------------------
-- Server version	11.8.6-MariaDB-0+deb13u1 from Debian

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `CITA`
--

DROP TABLE IF EXISTS `CITA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CITA` (
  `id_cita` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `id_odontologo` int(11) NOT NULL,
  `id_estado_cita` int(11) NOT NULL,
  `fecha_cita` datetime NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `notas` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_cita`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_estado_cita` (`id_estado_cita`),
  CONSTRAINT `CITA_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `PACIENTE` (`id_paciente`),
  CONSTRAINT `CITA_ibfk_2` FOREIGN KEY (`id_estado_cita`) REFERENCES `ESTADO_CITA` (`id_estado_cita`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CITA`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `CITA` WRITE;
/*!40000 ALTER TABLE `CITA` DISABLE KEYS */;
INSERT INTO `CITA` VALUES
(2,2,1,3,'2026-05-17 15:00:00','Consulta',NULL,'2026-05-16 12:13:38'),
(3,2,1,3,'2026-05-18 17:45:00','consulta',NULL,'2026-05-18 18:41:58'),
(4,3,1,3,'2026-05-20 10:00:00','Limpieza','el paciente presenta ','2026-05-18 19:32:25'),
(7,4,1,4,'2026-05-19 09:00:00','Limpieza Dental',NULL,'2026-05-18 22:07:43'),
(8,4,1,3,'2026-05-19 09:00:00','Ortodoncia','asdasd','2026-05-18 22:08:42'),
(9,4,1,3,'2026-05-20 12:00:00','Ortodoncia','asaaasdasddasd','2026-05-20 12:13:16'),
(10,4,1,3,'2026-05-21 09:00:00','Extracción',NULL,'2026-05-20 12:25:32'),
(11,4,1,3,'2026-05-21 09:30:00','Extracción',NULL,'2026-05-20 13:02:48'),
(12,4,1,3,'2026-05-20 17:30:00','Ortodoncia',NULL,'2026-05-20 13:18:55'),
(13,4,1,4,'2026-05-21 11:30:00','Limpieza Dental','Rechazada: Lo sentimos, no hay disponibilidad en este horario. Por favor, intente con otra fecha u horario.','2026-05-20 13:23:26'),
(14,4,1,1,'2026-05-21 12:00:00','Emergencia',NULL,'2026-05-20 13:24:26'),
(15,3,1,2,'2026-05-22 10:00:00','Extracción',NULL,'2026-05-20 13:32:12'),
(17,4,1,4,'2026-05-24 09:30:00','Ortodoncia',NULL,'2026-05-23 22:16:16'),
(18,3,1,3,'2026-05-31 11:30:00','Limpieza Dental',NULL,'2026-05-23 22:17:34'),
(19,4,1,4,'2026-05-25 10:00:00','Ortodoncia','Cancelada: buenos dias esa fecha me surge un imprevisto','2026-05-23 22:23:29'),
(22,3,1,2,'2026-05-31 09:00:00','as',NULL,'2026-05-23 22:32:09'),
(23,4,1,4,'2026-05-31 09:00:00','asdas','Derivado por Dr/a. admin. Motivo: asdas','2026-05-23 22:34:58'),
(24,4,1,2,'2026-05-24 11:30:00','Limpieza Dental',NULL,'2026-05-23 22:44:53'),
(25,4,1,1,'2026-05-25 11:00:00','Consulta',NULL,'2026-05-23 23:55:21'),
(26,5,1,4,'2026-05-28 09:30:00','Limpieza Dental','limpieza | Rechazada: Lo sentimos, no hay disponibilidad en este horario. Por favor, intente con otra fecha u horario.','2026-05-27 18:31:02'),
(27,5,1,3,'2026-05-28 10:30:00','Limpieza Dental','asdasd','2026-05-27 18:32:37'),
(28,6,1,3,'2026-06-12 10:00:00','Consulta General','el paciente presenta caries en el molar superiror','2026-05-27 19:51:13'),
(29,6,1,1,'2026-06-04 09:00:00','cirugia','Derivado por Dr/a. chepe flores. Motivo: realizar cirjuia','2026-05-27 20:05:20');
/*!40000 ALTER TABLE `CITA` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `CONSULTA_CLINICA`
--

DROP TABLE IF EXISTS `CONSULTA_CLINICA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONSULTA_CLINICA` (
  `id_consulta` int(11) NOT NULL AUTO_INCREMENT,
  `id_historial` int(11) NOT NULL,
  `id_cita` int(11) DEFAULT NULL,
  `id_odontologo` int(11) NOT NULL,
  `fecha_consulta` datetime NOT NULL,
  `motivo_consulta` varchar(255) NOT NULL,
  `diagnostico` text NOT NULL,
  `tratamiento` text NOT NULL,
  `notas` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_consulta`),
  KEY `id_historial` (`id_historial`),
  KEY `id_cita` (`id_cita`),
  KEY `id_odontologo` (`id_odontologo`),
  CONSTRAINT `CONSULTA_CLINICA_ibfk_1` FOREIGN KEY (`id_historial`) REFERENCES `HISTORIAL_CLINICO` (`id_historial`),
  CONSTRAINT `CONSULTA_CLINICA_ibfk_2` FOREIGN KEY (`id_cita`) REFERENCES `CITA` (`id_cita`),
  CONSTRAINT `CONSULTA_CLINICA_ibfk_3` FOREIGN KEY (`id_odontologo`) REFERENCES `ODONTOLOGO` (`id_odontologo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CONSULTA_CLINICA`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `CONSULTA_CLINICA` WRITE;
/*!40000 ALTER TABLE `CONSULTA_CLINICA` DISABLE KEYS */;
INSERT INTO `CONSULTA_CLINICA` VALUES
(1,2,NULL,1,'2026-05-20 10:00:00','Limpieza','caries pre nosque','zdsdsjfjsajksflqiwasdaz','asdasdfdsfmsdfdsfdmfsa,sfdashdkas'),
(2,2,NULL,1,'2026-05-20 10:00:00','Limpieza','1.caries\n2.caries2 en primer molar superior','quitar muela \nrelleno','el paciente presenta '),
(3,3,NULL,1,'2026-05-19 09:00:00','Ortodoncia','1 caries\n2 quebradura','limpieza y posterieor mente implante ','asdasd'),
(4,3,NULL,1,'2026-05-20 12:00:00','Ortodoncia','1. asdasdas','asdasd','asaaasdasddasd'),
(5,3,NULL,1,'2026-05-20 17:30:00','Ortodoncia','No especificado','No especificado',NULL),
(7,4,NULL,1,'2026-05-28 10:30:00','Limpieza Dental','caaries ','limpieza ','asdasd'),
(8,5,NULL,1,'2026-06-12 10:00:00','Consulta General','caries en el molar superior','resina epoxica','el paciente presenta caries en el molar superiror'),
(9,2,NULL,1,'2026-05-31 11:30:00','Limpieza Dental','qwe','qewqe',NULL);
/*!40000 ALTER TABLE `CONSULTA_CLINICA` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `DOCUMENTO_PACIENTE`
--

DROP TABLE IF EXISTS `DOCUMENTO_PACIENTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DOCUMENTO_PACIENTE` (
  `id_documento` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `id_consulta` int(11) DEFAULT NULL,
  `id_tipo_documento` int(11) NOT NULL,
  `nombre_archivo` varchar(150) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `fecha_subida` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_documento`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_consulta` (`id_consulta`),
  KEY `id_tipo_documento` (`id_tipo_documento`),
  CONSTRAINT `DOCUMENTO_PACIENTE_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `PACIENTE` (`id_paciente`),
  CONSTRAINT `DOCUMENTO_PACIENTE_ibfk_2` FOREIGN KEY (`id_consulta`) REFERENCES `CONSULTA_CLINICA` (`id_consulta`),
  CONSTRAINT `DOCUMENTO_PACIENTE_ibfk_3` FOREIGN KEY (`id_tipo_documento`) REFERENCES `TIPO_DOCUMENTO` (`id_tipo_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DOCUMENTO_PACIENTE`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `DOCUMENTO_PACIENTE` WRITE;
/*!40000 ALTER TABLE `DOCUMENTO_PACIENTE` DISABLE KEYS */;
/*!40000 ALTER TABLE `DOCUMENTO_PACIENTE` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ESTADO_CITA`
--

DROP TABLE IF EXISTS `ESTADO_CITA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ESTADO_CITA` (
  `id_estado_cita` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_estado_cita`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ESTADO_CITA`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ESTADO_CITA` WRITE;
/*!40000 ALTER TABLE `ESTADO_CITA` DISABLE KEYS */;
INSERT INTO `ESTADO_CITA` VALUES
(1,'PENDIENTE','Pendiente','Cita programada pendiente',1,'2026-05-15 22:58:28'),
(2,'CONFIRMADA','Confirmada','Cita confirmada por el paciente',1,'2026-05-15 22:58:28'),
(3,'COMPLETADA','Completada','Cita realizada',1,'2026-05-15 22:58:28'),
(4,'CANCELADA','Cancelada','Cita cancelada',1,'2026-05-15 22:58:28'),
(5,'NO_ASISTIO','No Asistió','El paciente no se presentó',1,'2026-05-15 22:58:28');
/*!40000 ALTER TABLE `ESTADO_CITA` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ESTADO_INSUMO`
--

DROP TABLE IF EXISTS `ESTADO_INSUMO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ESTADO_INSUMO` (
  `id_estado_insumo` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_estado_insumo`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ESTADO_INSUMO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ESTADO_INSUMO` WRITE;
/*!40000 ALTER TABLE `ESTADO_INSUMO` DISABLE KEYS */;
INSERT INTO `ESTADO_INSUMO` VALUES
(1,'DISPONIBLE','Disponible','Insumo disponible para uso',1,'2026-05-15 22:58:28'),
(2,'AGOTADO','Agotado','Insumo sin stock',1,'2026-05-15 22:58:28'),
(3,'DESCONTINUADO','Descontinuado','Insumo fuera de uso',1,'2026-05-15 22:58:28');
/*!40000 ALTER TABLE `ESTADO_INSUMO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ESTADO_USUARIO`
--

DROP TABLE IF EXISTS `ESTADO_USUARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ESTADO_USUARIO` (
  `id_estado_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_estado_usuario`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ESTADO_USUARIO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ESTADO_USUARIO` WRITE;
/*!40000 ALTER TABLE `ESTADO_USUARIO` DISABLE KEYS */;
INSERT INTO `ESTADO_USUARIO` VALUES
(1,'ACTIVO','Activo','Usuario activo en el sistema',1,'2026-05-15 22:58:28'),
(2,'INACTIVO','Inactivo','Usuario inactivo en el sistema',1,'2026-05-15 22:58:28'),
(3,'SUSPENDIDO','Suspendido','Usuario suspendido temporalmente',1,'2026-05-15 22:58:28');
/*!40000 ALTER TABLE `ESTADO_USUARIO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `HISTORIAL_CLINICO`
--

DROP TABLE IF EXISTS `HISTORIAL_CLINICO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `HISTORIAL_CLINICO` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `fecha_apertura` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historial`),
  KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `HISTORIAL_CLINICO_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `PACIENTE` (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HISTORIAL_CLINICO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `HISTORIAL_CLINICO` WRITE;
/*!40000 ALTER TABLE `HISTORIAL_CLINICO` DISABLE KEYS */;
INSERT INTO `HISTORIAL_CLINICO` VALUES
(1,2,NULL,'2026-05-16 11:07:42'),
(2,3,'Historial creado automáticamente en primera consulta','2026-05-18 19:56:00'),
(3,4,NULL,'2026-05-18 21:39:42'),
(4,5,NULL,'2026-05-27 18:29:12'),
(5,6,'Historial creado automáticamente en primera consulta','2026-05-27 19:58:52');
/*!40000 ALTER TABLE `HISTORIAL_CLINICO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `INSUMO_CLINICO`
--

DROP TABLE IF EXISTS `INSUMO_CLINICO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `INSUMO_CLINICO` (
  `id_insumo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `categoria` varchar(100) NOT NULL,
  `unidad_medida` varchar(50) NOT NULL,
  `stock_minimo` int(11) NOT NULL DEFAULT 0,
  `id_estado_insumo` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_insumo`),
  KEY `id_estado_insumo` (`id_estado_insumo`),
  CONSTRAINT `INSUMO_CLINICO_ibfk_1` FOREIGN KEY (`id_estado_insumo`) REFERENCES `ESTADO_INSUMO` (`id_estado_insumo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `INSUMO_CLINICO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `INSUMO_CLINICO` WRITE;
/*!40000 ALTER TABLE `INSUMO_CLINICO` DISABLE KEYS */;
INSERT INTO `INSUMO_CLINICO` VALUES
(1,'gasas','gasas 10 cm','descartables','unidad',10,1,'2026-05-18 17:36:46'),
(2,'Masilla Epoxica - Denton','Masilla Epoxica - Denton','Masilla','500mg',10,1,'2026-05-23 22:41:05'),
(3,'anestesia','anestesias descartables','descartables','5ml',10,1,'2026-05-27 20:11:00');
/*!40000 ALTER TABLE `INSUMO_CLINICO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `LOG_ACTIVIDAD`
--

DROP TABLE IF EXISTS `LOG_ACTIVIDAD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `LOG_ACTIVIDAD` (
  `id_log` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `metodo` varchar(10) NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `detalles` text DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_log`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `LOG_ACTIVIDAD_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=482 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOG_ACTIVIDAD`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `LOG_ACTIVIDAD` WRITE;
/*!40000 ALTER TABLE `LOG_ACTIVIDAD` DISABLE KEYS */;
INSERT INTO `LOG_ACTIVIDAD` VALUES
(1,2,'GET','/api/pacientes/4','::ffff:192.168.0.27','{}','2026-05-23 23:22:26'),
(2,2,'GET','/api/citas','::ffff:192.168.0.27','{}','2026-05-23 23:22:27'),
(3,2,'GET','/api/pacientes/4/historial','::ffff:192.168.0.27','{}','2026-05-23 23:22:27'),
(4,2,'GET','/api/notas/paciente/4','::ffff:192.168.0.27','{}','2026-05-23 23:22:27'),
(5,2,'GET','/api/recetas/paciente/4','::ffff:192.168.0.27','{}','2026-05-23 23:22:27'),
(6,2,'GET','/api/insumos','::ffff:192.168.0.27','{}','2026-05-23 23:22:27'),
(7,2,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:22:27'),
(8,2,'GET','/api/medicamentos','::ffff:192.168.0.27','{}','2026-05-23 23:22:27'),
(9,2,'GET','/api/pacientes/4','::ffff:192.168.0.27','{}','2026-05-23 23:22:33'),
(10,2,'GET','/api/citas','::ffff:192.168.0.27','{}','2026-05-23 23:22:33'),
(11,2,'GET','/api/pacientes/4/historial','::ffff:192.168.0.27','{}','2026-05-23 23:22:33'),
(12,2,'GET','/api/notas/paciente/4','::ffff:192.168.0.27','{}','2026-05-23 23:22:33'),
(13,2,'GET','/api/recetas/paciente/4','::ffff:192.168.0.27','{}','2026-05-23 23:22:33'),
(14,2,'GET','/api/insumos','::ffff:192.168.0.27','{}','2026-05-23 23:22:33'),
(15,2,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:22:33'),
(16,2,'GET','/api/medicamentos','::ffff:192.168.0.27','{}','2026-05-23 23:22:33'),
(17,7,'GET','/api/pacientes/perfil/me','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(18,7,'GET','/api/pacientes/perfil/me/historial','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(19,7,'GET','/api/pacientes/perfil/me/citas','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(20,2,'GET','/api/pacientes/4','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(21,7,'GET','/api/pacientes/perfil/me/recetas','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(22,7,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(23,2,'GET','/api/citas','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(24,2,'GET','/api/pacientes/4/historial','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(25,2,'GET','/api/notas/paciente/4','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(26,2,'GET','/api/recetas/paciente/4','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(27,2,'GET','/api/insumos','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(28,2,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(29,2,'GET','/api/medicamentos','::ffff:192.168.0.27','{}','2026-05-23 23:23:04'),
(30,NULL,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-23 23:25:08'),
(31,1,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:25:09'),
(32,1,'GET','/api/logs','::ffff:192.168.0.27','{}','2026-05-23 23:25:10'),
(33,1,'GET','/api/logs','::ffff:192.168.0.27','{}','2026-05-23 23:25:33'),
(34,1,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:25:45'),
(35,1,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:25:45'),
(36,1,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:25:47'),
(37,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:25:52'),
(38,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:27:09'),
(39,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:28:00'),
(40,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:29:25'),
(41,1,'GET','/api/insumos','::ffff:192.168.0.27','{}','2026-05-23 23:30:39'),
(42,1,'GET','/api/citas','::ffff:192.168.0.27','{}','2026-05-23 23:30:49'),
(43,1,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:30:49'),
(44,1,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:30:49'),
(45,1,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:31:07'),
(46,1,'GET','/api/logs','::ffff:192.168.0.27','{}','2026-05-23 23:31:08'),
(47,1,'GET','/api/logs','::ffff:192.168.0.27','{}','2026-05-23 23:32:12'),
(48,1,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:34:37'),
(49,1,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:34:48'),
(50,1,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:34:55'),
(51,1,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:35:09'),
(52,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:35:15'),
(53,1,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:35:22'),
(54,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:35:23'),
(55,1,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:35:26'),
(56,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:35:28'),
(57,1,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:35:31'),
(58,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:38:43'),
(59,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:39:35'),
(60,1,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:39:42'),
(61,1,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:39:47'),
(62,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:39:56'),
(63,7,'GET','/api/pacientes/perfil/me','::ffff:192.168.0.27','{}','2026-05-23 23:47:10'),
(64,7,'GET','/api/pacientes/perfil/me/historial','::ffff:192.168.0.27','{}','2026-05-23 23:47:10'),
(65,7,'GET','/api/pacientes/perfil/me/recetas','::ffff:192.168.0.27','{}','2026-05-23 23:47:10'),
(66,7,'GET','/api/pacientes/perfil/me/citas','::ffff:192.168.0.27','{}','2026-05-23 23:47:10'),
(67,7,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:47:10'),
(68,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:47:10'),
(69,7,'GET','/api/pacientes/perfil/me','::ffff:192.168.0.27','{}','2026-05-23 23:47:46'),
(70,7,'GET','/api/pacientes/perfil/me/citas','::ffff:192.168.0.27','{}','2026-05-23 23:47:46'),
(71,7,'GET','/api/pacientes/perfil/me/historial','::ffff:192.168.0.27','{}','2026-05-23 23:47:46'),
(72,7,'GET','/api/pacientes/perfil/me/recetas','::ffff:192.168.0.27','{}','2026-05-23 23:47:46'),
(73,7,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:47:46'),
(74,7,'GET','/api/pacientes/perfil/me','::ffff:192.168.0.27','{}','2026-05-23 23:47:53'),
(75,7,'GET','/api/pacientes/perfil/me/citas','::ffff:192.168.0.27','{}','2026-05-23 23:47:53'),
(76,7,'GET','/api/pacientes/perfil/me/historial','::ffff:192.168.0.27','{}','2026-05-23 23:47:53'),
(77,7,'GET','/api/pacientes/perfil/me/recetas','::ffff:192.168.0.27','{}','2026-05-23 23:47:53'),
(78,7,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:47:53'),
(79,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:48:28'),
(80,NULL,'POST','/api/auth/recuperar-password','::ffff:192.168.0.27','{\"body\":{\"correo\":\"drchepe@gmail.com\"}}','2026-05-23 23:50:19'),
(81,NULL,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password\":\"***\"}}','2026-05-23 23:50:29'),
(82,NULL,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password\":\"***\"}}','2026-05-23 23:50:33'),
(83,NULL,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password\":\"***\"}}','2026-05-23 23:50:39'),
(84,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:50:39'),
(85,4,'POST','/api/auth/cambiar-password-temporal','::ffff:192.168.0.27','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password_actual\":\"LRQ8A9YK\",\"password_nueva\":\"chepe123\"}}','2026-05-23 23:50:55'),
(86,4,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:50:57'),
(87,4,'GET','/api/insumos','::ffff:192.168.0.27','{}','2026-05-23 23:50:59'),
(88,4,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:51:00'),
(89,4,'GET','/api/citas','::ffff:192.168.0.27','{}','2026-05-23 23:51:00'),
(90,4,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:51:00'),
(91,4,'GET','/api/insumos','::ffff:192.168.0.27','{}','2026-05-23 23:51:01'),
(92,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:51:04'),
(93,4,'GET','/api/citas','::ffff:192.168.0.27','{}','2026-05-23 23:51:24'),
(94,4,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:51:24'),
(95,4,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:51:24'),
(96,4,'GET','/api/insumos','::ffff:192.168.0.27','{}','2026-05-23 23:51:33'),
(97,4,'GET','/api/insumos','::ffff:192.168.0.27','{}','2026-05-23 23:51:36'),
(98,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:51:37'),
(99,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:52:36'),
(100,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:52:36'),
(101,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:52:57'),
(102,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:53:08'),
(103,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:53:47'),
(104,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:53:48'),
(105,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:54:10'),
(106,1,'GET','/api/usuarios','::ffff:192.168.0.27','{}','2026-05-23 23:54:15'),
(107,NULL,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password\":\"***\"}}','2026-05-23 23:54:52'),
(108,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:54:52'),
(109,4,'GET','/api/citas','::ffff:192.168.0.27','{}','2026-05-23 23:54:57'),
(110,4,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:54:57'),
(111,4,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:54:57'),
(112,7,'GET','/api/pacientes/perfil/me/citas','::ffff:192.168.0.20','{}','2026-05-23 23:55:04'),
(113,7,'GET','/api/pacientes/perfil/me','::ffff:192.168.0.20','{}','2026-05-23 23:55:04'),
(114,7,'GET','/api/pacientes/perfil/me/historial','::ffff:192.168.0.20','{}','2026-05-23 23:55:04'),
(115,7,'GET','/api/odontologos','::ffff:192.168.0.20','{}','2026-05-23 23:55:04'),
(116,7,'GET','/api/pacientes/perfil/me/recetas','::ffff:192.168.0.20','{}','2026-05-23 23:55:04'),
(117,7,'GET','/api/pacientes/perfil/me','::ffff:192.168.0.20','{}','2026-05-23 23:55:07'),
(118,7,'GET','/api/pacientes/perfil/me/citas','::ffff:192.168.0.20','{}','2026-05-23 23:55:07'),
(119,7,'GET','/api/pacientes/perfil/me/historial','::ffff:192.168.0.20','{}','2026-05-23 23:55:07'),
(120,7,'GET','/api/pacientes/perfil/me/recetas','::ffff:192.168.0.20','{}','2026-05-23 23:55:07'),
(121,7,'GET','/api/odontologos','::ffff:192.168.0.20','{}','2026-05-23 23:55:07'),
(122,7,'POST','/api/citas','::ffff:192.168.0.20','{\"body\":{\"id_odontologo\":\"1\",\"id_estado_cita\":1,\"fecha_cita\":\"2026-05-25 11:00:00\",\"motivo\":\"Consulta\",\"notas\":\"\"}}','2026-05-23 23:55:21'),
(123,7,'GET','/api/pacientes/perfil/me','::ffff:192.168.0.20','{}','2026-05-23 23:55:22'),
(124,7,'GET','/api/pacientes/perfil/me/citas','::ffff:192.168.0.20','{}','2026-05-23 23:55:22'),
(125,7,'GET','/api/pacientes/perfil/me/historial','::ffff:192.168.0.20','{}','2026-05-23 23:55:22'),
(126,7,'GET','/api/pacientes/perfil/me/recetas','::ffff:192.168.0.20','{}','2026-05-23 23:55:22'),
(127,7,'GET','/api/odontologos','::ffff:192.168.0.20','{}','2026-05-23 23:55:22'),
(128,4,'GET','/api/citas','::ffff:192.168.0.27','{}','2026-05-23 23:55:28'),
(129,4,'GET','/api/pacientes','::ffff:192.168.0.27','{}','2026-05-23 23:55:28'),
(130,4,'GET','/api/odontologos','::ffff:192.168.0.27','{}','2026-05-23 23:55:28'),
(131,4,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-23 23:56:15'),
(132,NULL,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-23 23:56:35'),
(133,1,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:56:36'),
(134,4,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-23 23:56:48'),
(135,4,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-23 23:57:12'),
(136,7,'GET','/api/pacientes/perfil/me','::ffff:192.168.0.20','{}','2026-05-23 23:57:20'),
(137,7,'GET','/api/pacientes/perfil/me/citas','::ffff:192.168.0.20','{}','2026-05-23 23:57:20'),
(138,7,'GET','/api/pacientes/perfil/me/historial','::ffff:192.168.0.20','{}','2026-05-23 23:57:20'),
(139,7,'GET','/api/pacientes/perfil/me/recetas','::ffff:192.168.0.20','{}','2026-05-23 23:57:20'),
(140,7,'GET','/api/odontologos','::ffff:192.168.0.20','{}','2026-05-23 23:57:20'),
(141,4,'POST','/api/auth/login','::ffff:192.168.0.27','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-23 23:57:39'),
(142,4,'GET','/api/stats','::ffff:192.168.0.27','{}','2026-05-23 23:58:09'),
(143,NULL,'GET','/','::ffff:127.0.0.1','{}','2026-05-27 18:23:27'),
(144,NULL,'GET','/favicon.ico','::ffff:127.0.0.1','{}','2026-05-27 18:23:27'),
(145,NULL,'GET','/','::ffff:127.0.0.1','{}','2026-05-27 18:23:43'),
(146,NULL,'GET','/favicon.ico','::ffff:127.0.0.1','{}','2026-05-27 18:23:44'),
(147,NULL,'POST','//api/auth/login','::ffff:127.0.0.1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 18:24:16'),
(148,NULL,'POST','//api/auth/login','::ffff:127.0.0.1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 18:24:17'),
(149,NULL,'POST','//api/auth/login','::ffff:127.0.0.1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 18:24:20'),
(150,NULL,'POST','//api/auth/login','::ffff:127.0.0.1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 18:26:02'),
(151,NULL,'POST','/api/auth/login','::ffff:127.0.0.1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 18:26:50'),
(152,1,'GET','/api/stats','::ffff:127.0.0.1','{}','2026-05-27 18:26:50'),
(153,1,'GET','/api/pacientes','::ffff:127.0.0.1','{}','2026-05-27 18:26:58'),
(154,1,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 18:27:03'),
(155,1,'GET','/api/usuarios','::ffff:127.0.0.1','{}','2026-05-27 18:27:09'),
(156,1,'GET','/api/pacientes','::ffff:127.0.0.1','{}','2026-05-27 18:27:22'),
(157,1,'POST','/api/pacientes','::ffff:127.0.0.1','{\"body\":{\"nombres\":\"Luis Fernando\",\"apellidos\":\"Gil Portales\",\"documento_identidad\":\"050505059\",\"fecha_nacimiento\":\"2000-11-19\",\"sexo\":\"Masculino\",\"tipo_sangre\":\"B+\",\"alergias\":null,\"telefono\":\"79732028\",\"correo\":\"luisportales@gmail.com\",\"direccion\":\"colonia la heroica , calle principal , casa 20\",\"contacto_emergencia_nombre\":\"Luisa Portales\",\"contacto_emergencia_telefono\":\"75757575\"}}','2026-05-27 18:29:12'),
(158,1,'GET','/api/usuarios','::ffff:127.0.0.1','{}','2026-05-27 18:29:20'),
(159,1,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 18:29:21'),
(160,1,'GET','/api/usuarios','::ffff:127.0.0.1','{}','2026-05-27 18:29:24'),
(161,1,'GET','/api/pacientes','::ffff:127.0.0.1','{}','2026-05-27 18:29:28'),
(162,1,'POST','/api/pacientes/5/crear-acceso','::ffff:127.0.0.1','{\"body\":{\"correo\":\"luisportales@gmail.com\",\"password\":\"\"}}','2026-05-27 18:29:45'),
(163,1,'GET','/api/pacientes','::ffff:127.0.0.1','{}','2026-05-27 18:29:45'),
(164,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"luisportales@gmail.com\",\"password\":\"***\"}}','2026-05-27 18:30:22'),
(165,8,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 18:30:22'),
(166,8,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 18:30:22'),
(167,8,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 18:30:22'),
(168,8,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 18:30:22'),
(169,8,'GET','/api/odontologos','::1','{}','2026-05-27 18:30:22'),
(170,8,'POST','/api/auth/cambiar-password-temporal','::1','{\"body\":{\"correo\":\"luisportales@gmail.com\",\"password_actual\":\"8hXc2CtX\",\"password_nueva\":\"luis123\"}}','2026-05-27 18:30:38'),
(171,8,'POST','/api/citas','::1','{\"body\":{\"id_odontologo\":\"1\",\"id_estado_cita\":1,\"fecha_cita\":\"2026-05-28 09:30:00\",\"motivo\":\"Limpieza Dental\",\"notas\":\"limpieza\"}}','2026-05-27 18:31:02'),
(172,8,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 18:31:02'),
(173,8,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 18:31:02'),
(174,8,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 18:31:02'),
(175,8,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 18:31:02'),
(176,8,'GET','/api/odontologos','::1','{}','2026-05-27 18:31:02'),
(177,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:31:18'),
(178,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:31:26'),
(179,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:31:27'),
(180,4,'GET','/api/citas','::1','{}','2026-05-27 18:31:27'),
(181,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:31:27'),
(182,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"chepeflores@gmail.com\",\"password\":\"***\"}}','2026-05-27 18:31:43'),
(183,1,'GET','/api/usuarios','::ffff:127.0.0.1','{}','2026-05-27 18:31:47'),
(184,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password\":\"***\"}}','2026-05-27 18:31:59'),
(185,4,'GET','/api/stats','::1','{}','2026-05-27 18:31:59'),
(186,4,'GET','/api/citas','::1','{}','2026-05-27 18:32:01'),
(187,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:32:01'),
(188,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:32:01'),
(189,4,'PUT','/api/citas/26','::1','{\"body\":{\"id_odontologo\":1,\"id_estado_cita\":4,\"fecha_cita\":\"2026-05-28 09:30:00\",\"motivo\":\"Limpieza Dental\",\"notas\":\"limpieza | Rechazada: Lo sentimos, no hay disponibilidad en este horario. Por favor, intente con otra fecha u horario.\"}}','2026-05-27 18:32:12'),
(190,4,'GET','/api/citas','::1','{}','2026-05-27 18:32:12'),
(191,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:32:12'),
(192,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:32:12'),
(193,8,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 18:32:21'),
(194,8,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 18:32:21'),
(195,8,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 18:32:21'),
(196,8,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 18:32:21'),
(197,8,'GET','/api/odontologos','::1','{}','2026-05-27 18:32:21'),
(198,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"test@test.com\",\"password\":\"***\"}}','2026-05-27 18:32:34'),
(199,8,'POST','/api/citas','::1','{\"body\":{\"id_odontologo\":\"1\",\"id_estado_cita\":1,\"fecha_cita\":\"2026-05-28 10:30:00\",\"motivo\":\"Limpieza Dental\",\"notas\":\"limpieza\"}}','2026-05-27 18:32:37'),
(200,8,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 18:32:38'),
(201,8,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 18:32:38'),
(202,8,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 18:32:38'),
(203,8,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 18:32:38'),
(204,8,'GET','/api/odontologos','::1','{}','2026-05-27 18:32:38'),
(205,4,'GET','/api/citas','::1','{}','2026-05-27 18:32:48'),
(206,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:32:48'),
(207,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:32:48'),
(208,1,'GET','/api/usuarios','::ffff:127.0.0.1','{}','2026-05-27 18:32:48'),
(209,8,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 18:32:51'),
(210,8,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 18:32:51'),
(211,8,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 18:32:51'),
(212,8,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 18:32:51'),
(213,8,'GET','/api/odontologos','::1','{}','2026-05-27 18:32:51'),
(214,4,'GET','/api/citas','::1','{}','2026-05-27 18:32:54'),
(215,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:32:54'),
(216,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:32:54'),
(217,4,'PUT','/api/citas/27','::1','{\"body\":{\"id_odontologo\":1,\"id_estado_cita\":2,\"fecha_cita\":\"2026-05-28 10:30:00\",\"motivo\":\"Limpieza Dental\",\"notas\":\"limpieza\"}}','2026-05-27 18:32:57'),
(218,4,'GET','/api/citas','::1','{}','2026-05-27 18:32:57'),
(219,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:32:57'),
(220,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:32:57'),
(221,8,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 18:33:03'),
(222,8,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 18:33:03'),
(223,8,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 18:33:03'),
(224,8,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 18:33:03'),
(225,8,'GET','/api/odontologos','::1','{}','2026-05-27 18:33:03'),
(226,4,'GET','/api/pacientes/5','::1','{}','2026-05-27 18:33:15'),
(227,4,'GET','/api/citas','::1','{}','2026-05-27 18:33:15'),
(228,4,'GET','/api/pacientes/5/historial','::1','{}','2026-05-27 18:33:15'),
(229,4,'GET','/api/notas/paciente/5','::1','{}','2026-05-27 18:33:15'),
(230,4,'GET','/api/recetas/paciente/5','::1','{}','2026-05-27 18:33:15'),
(231,4,'GET','/api/insumos','::1','{}','2026-05-27 18:33:15'),
(232,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:33:15'),
(233,4,'GET','/api/medicamentos','::1','{}','2026-05-27 18:33:15'),
(234,4,'GET','/api/odontograma/5','::1','{}','2026-05-27 18:33:20'),
(235,4,'GET','/api/odontograma/5','::1','{}','2026-05-27 18:33:32'),
(236,4,'POST','/api/odontograma/5','::1','{\"body\":{\"datos\":{\"11\":{\"number\":11,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"root_canal\",\"right\":\"root_canal\",\"bottom\":\"healthy\"}},\"12\":{\"number\":12,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"13\":{\"number\":13,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"14\":{\"number\":14,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"15\":{\"number\":15,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"16\":{\"number\":16,\"surfaces\":{\"top\":\"caries\",\"left\":\"caries\",\"center\":\"caries\",\"right\":\"caries\",\"bottom\":\"caries\"}},\"17\":{\"number\":17,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"18\":{\"number\":18,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"21\":{\"number\":21,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"22\":{\"number\":22,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"23\":{\"number\":23,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"24\":{\"number\":24,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"25\":{\"number\":25,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"26\":{\"number\":26,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"27\":{\"number\":27,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"root_canal\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"28\":{\"number\":28,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"31\":{\"number\":31,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"32\":{\"number\":32,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"33\":{\"number\":33,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"34\":{\"number\":34,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"35\":{\"number\":35,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"36\":{\"number\":36,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"37\":{\"number\":37,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"38\":{\"number\":38,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"41\":{\"number\":41,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"42\":{\"number\":42,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"43\":{\"number\":43,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"44\":{\"number\":44,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"45\":{\"number\":45,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"46\":{\"number\":46,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"47\":{\"number\":47,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"48\":{\"number\":48,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}}}}}','2026-05-27 18:34:05'),
(237,4,'POST','/api/consultas','::1','{\"body\":{\"id_paciente\":\"5\",\"id_odontologo\":\"1\",\"fecha_consulta\":\"2026-05-28 10:30:00\",\"motivo_consulta\":\"Limpieza Dental\",\"diagnostico\":\"caaries \",\"tratamiento\":\"limpieza \",\"notas\":\"asdasd\",\"insumos_utilizados\":[{\"id_insumo\":2,\"nombre\":\"Masilla Epoxica - Denton\",\"cantidad\":1}]}}','2026-05-27 18:34:32'),
(238,4,'POST','/api/consultas','::1','{\"body\":{\"id_paciente\":\"5\",\"id_odontologo\":\"1\",\"fecha_consulta\":\"2026-05-28 10:30:00\",\"motivo_consulta\":\"Limpieza Dental\",\"diagnostico\":\"caaries \",\"tratamiento\":\"limpieza \",\"notas\":\"asdasd\",\"insumos_utilizados\":[{\"id_insumo\":1,\"nombre\":\"gasas\",\"cantidad\":1}]}}','2026-05-27 18:34:39'),
(239,4,'PUT','/api/citas/27','::1','{\"body\":{\"id_odontologo\":\"1\",\"id_estado_cita\":3,\"fecha_cita\":\"2026-05-28 10:30:00\",\"motivo\":\"Limpieza Dental\",\"notas\":\"asdasd\"}}','2026-05-27 18:34:39'),
(240,4,'GET','/api/pacientes/5','::1','{}','2026-05-27 18:34:39'),
(241,4,'GET','/api/citas','::1','{}','2026-05-27 18:34:39'),
(242,4,'GET','/api/pacientes/5/historial','::1','{}','2026-05-27 18:34:39'),
(243,4,'GET','/api/notas/paciente/5','::1','{}','2026-05-27 18:34:39'),
(244,4,'GET','/api/recetas/paciente/5','::1','{}','2026-05-27 18:34:39'),
(245,4,'GET','/api/insumos','::1','{}','2026-05-27 18:34:39'),
(246,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:34:39'),
(247,4,'GET','/api/medicamentos','::1','{}','2026-05-27 18:34:39'),
(248,4,'GET','/api/insumos','::1','{}','2026-05-27 18:34:53'),
(249,4,'GET','/api/stats','::1','{}','2026-05-27 18:35:10'),
(250,4,'GET','/api/citas','::1','{}','2026-05-27 18:35:10'),
(251,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:35:10'),
(252,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:35:10'),
(253,4,'GET','/api/stats','::1','{}','2026-05-27 18:35:11'),
(254,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:36:11'),
(255,4,'GET','/api/insumos','::1','{}','2026-05-27 18:36:11'),
(256,4,'GET','/api/citas','::1','{}','2026-05-27 18:36:12'),
(257,4,'GET','/api/pacientes','::1','{}','2026-05-27 18:36:12'),
(258,4,'GET','/api/odontologos','::1','{}','2026-05-27 18:36:12'),
(259,4,'GET','/api/stats','::1','{}','2026-05-27 18:36:13'),
(260,NULL,'POST','/api/auth/login','::ffff:127.0.0.1','{\"body\":{\"correo\":\"luisportales@gmail.com\",\"password\":\"***\"}}','2026-05-27 19:04:22'),
(261,8,'GET','/api/pacientes/perfil/me','::ffff:127.0.0.1','{}','2026-05-27 19:04:23'),
(262,8,'GET','/api/pacientes/perfil/me/historial','::ffff:127.0.0.1','{}','2026-05-27 19:04:23'),
(263,8,'GET','/api/pacientes/perfil/me/recetas','::ffff:127.0.0.1','{}','2026-05-27 19:04:23'),
(264,8,'GET','/api/pacientes/perfil/me/citas','::ffff:127.0.0.1','{}','2026-05-27 19:04:23'),
(265,8,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 19:04:23'),
(266,8,'PUT','/api/pacientes/5','::ffff:127.0.0.1','{\"body\":{\"nombres\":\"Luis Fernando\",\"apellidos\":\"Gil Portales\",\"documento_identidad\":\"099555951\",\"fecha_nacimiento\":\"2000-11-19\",\"sexo\":\"Masculino\",\"alergias\":\"ninguna\",\"tipo_sangre\":\"\",\"telefono\":\"79732028\",\"correo\":\"luisportales@gmail.com\",\"direccion\":\"colonia la heroica , calle principal , casa 20\",\"contacto_emergencia_nombre\":\"Luisa Portales\",\"contacto_emergencia_telefono\":\"75757575\"}}','2026-05-27 19:04:50'),
(267,8,'GET','/api/pacientes/perfil/me','::ffff:127.0.0.1','{}','2026-05-27 19:04:50'),
(268,8,'GET','/api/pacientes/perfil/me/citas','::ffff:127.0.0.1','{}','2026-05-27 19:04:50'),
(269,8,'GET','/api/pacientes/perfil/me/recetas','::ffff:127.0.0.1','{}','2026-05-27 19:04:50'),
(270,8,'GET','/api/pacientes/perfil/me/historial','::ffff:127.0.0.1','{}','2026-05-27 19:04:50'),
(271,8,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 19:04:50'),
(272,8,'PUT','/api/pacientes/5','::ffff:127.0.0.1','{\"body\":{\"nombres\":\"Luis Fernando\",\"apellidos\":\"Gil Portales\",\"documento_identidad\":\"099555951\",\"fecha_nacimiento\":\"2000-11-19\",\"sexo\":\"Masculino\",\"alergias\":\"ninguna\",\"tipo_sangre\":\"B+\",\"telefono\":\"79732028\",\"correo\":\"luisportales@gmail.com\",\"direccion\":\"colonia la heroica , calle principal , casa 20\",\"contacto_emergencia_nombre\":\"Luisa Portales\",\"contacto_emergencia_telefono\":\"75757575\"}}','2026-05-27 19:05:00'),
(273,8,'GET','/api/pacientes/perfil/me','::ffff:127.0.0.1','{}','2026-05-27 19:05:01'),
(274,8,'GET','/api/pacientes/perfil/me/historial','::ffff:127.0.0.1','{}','2026-05-27 19:05:01'),
(275,8,'GET','/api/pacientes/perfil/me/citas','::ffff:127.0.0.1','{}','2026-05-27 19:05:01'),
(276,8,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 19:05:01'),
(277,8,'GET','/api/pacientes/perfil/me/recetas','::ffff:127.0.0.1','{}','2026-05-27 19:05:01'),
(278,8,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 19:05:20'),
(279,8,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 19:05:20'),
(280,8,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 19:05:20'),
(281,8,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 19:05:20'),
(282,8,'GET','/api/odontologos','::1','{}','2026-05-27 19:05:20'),
(283,8,'GET','/api/pacientes/perfil/me','::ffff:127.0.0.1','{}','2026-05-27 19:06:04'),
(284,8,'GET','/api/pacientes/perfil/me/citas','::ffff:127.0.0.1','{}','2026-05-27 19:06:04'),
(285,8,'GET','/api/pacientes/perfil/me/historial','::ffff:127.0.0.1','{}','2026-05-27 19:06:04'),
(286,8,'GET','/api/pacientes/perfil/me/recetas','::ffff:127.0.0.1','{}','2026-05-27 19:06:04'),
(287,8,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 19:06:04'),
(288,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"joseluis@gmail.com\",\"password\":\"***\"}}','2026-05-27 19:16:39'),
(289,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"joseluis@gmail.com\",\"password\":\"***\"}}','2026-05-27 19:16:52'),
(290,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"luisportales@gmail.com\",\"password\":\"***\"}}','2026-05-27 19:17:16'),
(291,8,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 19:17:16'),
(292,8,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 19:17:16'),
(293,8,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 19:17:16'),
(294,8,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 19:17:16'),
(295,8,'GET','/api/odontologos','::1','{}','2026-05-27 19:17:16'),
(296,1,'GET','/api/pacientes','::ffff:127.0.0.1','{}','2026-05-27 19:17:42'),
(297,1,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 19:17:43'),
(298,1,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 19:17:45'),
(299,NULL,'GET','/favicon.ico','::ffff:127.0.0.1','{}','2026-05-27 19:17:51'),
(300,NULL,'GET','/favicon.ico','::ffff:127.0.0.1','{}','2026-05-27 19:17:52'),
(301,4,'GET','/api/citas','::1','{}','2026-05-27 19:20:15'),
(302,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:20:15'),
(303,4,'GET','/api/odontologos','::1','{}','2026-05-27 19:20:15'),
(304,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:20:20'),
(305,4,'GET','/api/insumos','::1','{}','2026-05-27 19:20:22'),
(306,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:20:22'),
(307,4,'GET','/api/citas','::1','{}','2026-05-27 19:20:22'),
(308,4,'GET','/api/odontologos','::1','{}','2026-05-27 19:20:22'),
(309,NULL,'POST','/api/auth/register','::1','{\"body\":{\"nombre\":\"15151225158525\",\"apellido\":\"1655151515252\",\"correo\":\"JuanPerez@gmail.com\",\"password\":\"***\",\"telefono\":\"gsrgrsgrsgr15551515\",\"fecha_nacimiento\":\"2012-02-15\",\"sexo\":\"Masculino\",\"direccion\":\"Residencial Cadiz\",\"documento_identidad\":\"nfjnzdfjndsjfnjesnfnjde\",\"tipo_sangre\":\"A+\",\"alergias\":\"ninguna\"}}','2026-05-27 19:45:17'),
(310,9,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 19:45:17'),
(311,9,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 19:45:17'),
(312,9,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 19:45:17'),
(313,9,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 19:45:17'),
(314,9,'GET','/api/odontologos','::1','{}','2026-05-27 19:45:17'),
(315,9,'POST','/api/citas','::1','{\"body\":{\"id_odontologo\":\"1\",\"id_estado_cita\":1,\"fecha_cita\":\"2026-06-12 10:00:00\",\"motivo\":\"Consulta General\",\"notas\":\"endodoncia\"}}','2026-05-27 19:51:13'),
(316,9,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 19:51:14'),
(317,9,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 19:51:14'),
(318,9,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 19:51:14'),
(319,9,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 19:51:14'),
(320,9,'GET','/api/odontologos','::1','{}','2026-05-27 19:51:14'),
(321,4,'GET','/api/citas','::1','{}','2026-05-27 19:52:07'),
(322,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:52:07'),
(323,4,'GET','/api/odontologos','::1','{}','2026-05-27 19:52:07'),
(324,4,'GET','/api/insumos','::1','{}','2026-05-27 19:52:07'),
(325,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:52:08'),
(326,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password\":\"***\"}}','2026-05-27 19:52:26'),
(327,4,'GET','/api/stats','::1','{}','2026-05-27 19:52:26'),
(328,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:52:33'),
(329,4,'GET','/api/citas','::1','{}','2026-05-27 19:52:45'),
(330,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:52:45'),
(331,4,'GET','/api/odontologos','::1','{}','2026-05-27 19:52:45'),
(332,4,'PUT','/api/citas/28','::1','{\"body\":{\"id_odontologo\":1,\"id_estado_cita\":2,\"fecha_cita\":\"2026-06-12 10:00:00\",\"motivo\":\"Consulta General\",\"notas\":\"endodoncia\"}}','2026-05-27 19:53:53'),
(333,4,'GET','/api/citas','::1','{}','2026-05-27 19:53:53'),
(334,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:53:53'),
(335,4,'GET','/api/odontologos','::1','{}','2026-05-27 19:53:53'),
(336,9,'GET','/api/pacientes/perfil/me','::1','{}','2026-05-27 19:54:00'),
(337,9,'GET','/api/pacientes/perfil/me/citas','::1','{}','2026-05-27 19:54:00'),
(338,9,'GET','/api/pacientes/perfil/me/historial','::1','{}','2026-05-27 19:54:00'),
(339,9,'GET','/api/pacientes/perfil/me/recetas','::1','{}','2026-05-27 19:54:00'),
(340,9,'GET','/api/odontologos','::1','{}','2026-05-27 19:54:00'),
(341,4,'GET','/api/insumos','::1','{}','2026-05-27 19:54:34'),
(342,4,'GET','/api/stats','::1','{}','2026-05-27 19:54:37'),
(343,4,'GET','/api/citas','::1','{}','2026-05-27 19:54:38'),
(344,4,'GET','/api/pacientes','::1','{}','2026-05-27 19:54:38'),
(345,4,'GET','/api/odontologos','::1','{}','2026-05-27 19:54:38'),
(346,4,'GET','/api/pacientes/6','::1','{}','2026-05-27 19:54:54'),
(347,4,'GET','/api/citas','::1','{}','2026-05-27 19:54:54'),
(348,4,'GET','/api/pacientes/6/historial','::1','{}','2026-05-27 19:54:54'),
(349,4,'GET','/api/notas/paciente/6','::1','{}','2026-05-27 19:54:54'),
(350,4,'GET','/api/recetas/paciente/6','::1','{}','2026-05-27 19:54:54'),
(351,4,'GET','/api/insumos','::1','{}','2026-05-27 19:54:54'),
(352,4,'GET','/api/odontologos','::1','{}','2026-05-27 19:54:54'),
(353,4,'GET','/api/medicamentos','::1','{}','2026-05-27 19:54:54'),
(354,4,'GET','/api/odontograma/6','::1','{}','2026-05-27 19:56:06'),
(355,4,'POST','/api/odontograma/6','::1','{\"body\":{\"datos\":{\"11\":{\"number\":11,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"12\":{\"number\":12,\"surfaces\":{\"top\":\"restored\",\"left\":\"healthy\",\"center\":\"implant\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"13\":{\"number\":13,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"caries\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"14\":{\"number\":14,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"15\":{\"number\":15,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"16\":{\"number\":16,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"17\":{\"number\":17,\"surfaces\":{\"top\":\"healthy\",\"left\":\"caries\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"18\":{\"number\":18,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"21\":{\"number\":21,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"22\":{\"number\":22,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"23\":{\"number\":23,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"root_canal\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"24\":{\"number\":24,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"25\":{\"number\":25,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"26\":{\"number\":26,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"27\":{\"number\":27,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"28\":{\"number\":28,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"31\":{\"number\":31,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"32\":{\"number\":32,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"33\":{\"number\":33,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"34\":{\"number\":34,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"35\":{\"number\":35,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"36\":{\"number\":36,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"37\":{\"number\":37,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"38\":{\"number\":38,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"41\":{\"number\":41,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"42\":{\"number\":42,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"43\":{\"number\":43,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"44\":{\"number\":44,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"45\":{\"number\":45,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"46\":{\"number\":46,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"47\":{\"number\":47,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"48\":{\"number\":48,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}}}}}','2026-05-27 19:56:33'),
(356,4,'POST','/api/consultas','::1','{\"body\":{\"id_paciente\":\"6\",\"id_odontologo\":\"1\",\"fecha_consulta\":\"2026-06-12 10:00:00\",\"motivo_consulta\":\"Consulta General\",\"diagnostico\":\"caries en el molar superior\",\"tratamiento\":\"resina epoxica\",\"notas\":\"el paciente presenta caries en el molar superiror\",\"insumos_utilizados\":[{\"id_insumo\":1,\"nombre\":\"gasas\",\"cantidad\":1}]}}','2026-05-27 19:58:52'),
(357,4,'PUT','/api/citas/28','::1','{\"body\":{\"id_odontologo\":\"1\",\"id_estado_cita\":3,\"fecha_cita\":\"2026-06-12 10:00:00\",\"motivo\":\"Consulta General\",\"notas\":\"el paciente presenta caries en el molar superiror\"}}','2026-05-27 19:58:52'),
(358,4,'GET','/api/pacientes/6','::1','{}','2026-05-27 19:58:52'),
(359,4,'GET','/api/citas','::1','{}','2026-05-27 19:58:52'),
(360,4,'GET','/api/pacientes/6/historial','::1','{}','2026-05-27 19:58:52'),
(361,4,'GET','/api/notas/paciente/6','::1','{}','2026-05-27 19:58:52'),
(362,4,'GET','/api/recetas/paciente/6','::1','{}','2026-05-27 19:58:52'),
(363,4,'GET','/api/insumos','::1','{}','2026-05-27 19:58:52'),
(364,4,'GET','/api/odontologos','::1','{}','2026-05-27 19:58:52'),
(365,4,'GET','/api/medicamentos','::1','{}','2026-05-27 19:58:52'),
(366,4,'POST','/api/recetas','::1','{\"body\":{\"id_consulta\":\"8\",\"indicaciones_generales\":\"acetamifen cada 8 horas por 7 dias\",\"detalles\":[{\"id_medicamento\":0,\"dosis\":\"500mg\",\"frecuencia\":\"cada 8 horas \",\"duracion\":\"7 \",\"cantidad_indicada\":\"20\",\"instrucciones\":\"\"}]}}','2026-05-27 19:59:45'),
(367,4,'POST','/api/recetas','::1','{\"body\":{\"id_consulta\":\"8\",\"indicaciones_generales\":\"acetamifen cada 8 horas por 7 dias\",\"detalles\":[{\"id_medicamento\":0,\"dosis\":\"500mg\",\"frecuencia\":\"cada 8 horas \",\"duracion\":\"7 \",\"cantidad_indicada\":\"20\",\"instrucciones\":\"\"}]}}','2026-05-27 19:59:47'),
(368,4,'POST','/api/recetas','::1','{\"body\":{\"id_consulta\":\"8\",\"indicaciones_generales\":\"acetamifen cada 8 horas por 7 dias\",\"detalles\":[{\"id_medicamento\":0,\"dosis\":\"500mg\",\"frecuencia\":\"cada 8 horas \",\"duracion\":\"7 \",\"cantidad_indicada\":\"20\",\"instrucciones\":\"\"}]}}','2026-05-27 19:59:55'),
(369,4,'POST','/api/recetas','::1','{\"body\":{\"id_consulta\":\"8\",\"indicaciones_generales\":\"acetamifen \",\"detalles\":[{\"id_medicamento\":0,\"dosis\":\"500 mg\",\"frecuencia\":\"cada 8 horas \",\"duracion\":\"7 dias \",\"cantidad_indicada\":\"1\",\"instrucciones\":\"\"}]}}','2026-05-27 20:00:26'),
(370,4,'GET','/api/citas','::1','{}','2026-05-27 20:01:02'),
(371,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:01:02'),
(372,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:01:02'),
(373,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:01:11'),
(374,4,'GET','/api/pacientes/6','::1','{}','2026-05-27 20:01:13'),
(375,4,'GET','/api/citas','::1','{}','2026-05-27 20:01:13'),
(376,4,'GET','/api/pacientes/6/historial','::1','{}','2026-05-27 20:01:13'),
(377,4,'GET','/api/notas/paciente/6','::1','{}','2026-05-27 20:01:13'),
(378,4,'GET','/api/recetas/paciente/6','::1','{}','2026-05-27 20:01:13'),
(379,4,'GET','/api/insumos','::1','{}','2026-05-27 20:01:13'),
(380,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:01:13'),
(381,4,'GET','/api/medicamentos','::1','{}','2026-05-27 20:01:13'),
(382,4,'POST','/api/recetas','::1','{\"body\":{\"id_consulta\":\"8\",\"indicaciones_generales\":\"acetaminofen\",\"detalles\":[{\"id_medicamento\":0,\"dosis\":\"500\",\"frecuencia\":\"8\",\"duracion\":\"7\",\"cantidad_indicada\":\"21\",\"instrucciones\":\"\"}]}}','2026-05-27 20:01:37'),
(383,4,'POST','/api/notas','::1','{\"body\":{\"id_paciente\":\"6\",\"titulo\":\"evaluacion post cita\",\"contenido\":\"siguiente semana intervencion quirurjica\",\"categoria\":\"followup\"}}','2026-05-27 20:03:40'),
(384,4,'GET','/api/notas/paciente/6','::1','{}','2026-05-27 20:03:40'),
(385,4,'GET','/api/citas','::1','{}','2026-05-27 20:04:09'),
(386,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:04:09'),
(387,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:04:09'),
(388,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:04:43'),
(389,4,'GET','/api/pacientes/6','::1','{}','2026-05-27 20:04:44'),
(390,4,'GET','/api/citas','::1','{}','2026-05-27 20:04:44'),
(391,4,'GET','/api/pacientes/6/historial','::1','{}','2026-05-27 20:04:44'),
(392,4,'GET','/api/notas/paciente/6','::1','{}','2026-05-27 20:04:44'),
(393,4,'GET','/api/recetas/paciente/6','::1','{}','2026-05-27 20:04:44'),
(394,4,'GET','/api/insumos','::1','{}','2026-05-27 20:04:44'),
(395,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:04:44'),
(396,4,'GET','/api/medicamentos','::1','{}','2026-05-27 20:04:44'),
(397,4,'POST','/api/notas','::1','{\"body\":{\"id_paciente\":\"6\",\"titulo\":\"Derivación a Dr/a. chepe flores\",\"contenido\":\"DERIVACIÓN A ESPECIALISTA\\n──────────────────────────\\nDoctor Referente: Dr/a. chepe flores\\nDoctor Destino: Dr/a. chepe flores (cirugia)\\nUrgencia: Normal\\nMotivo de Derivación:\\nrealizar cirjuia\",\"categoria\":\"followup\"}}','2026-05-27 20:05:20'),
(398,4,'POST','/api/citas','::1','{\"body\":{\"id_paciente\":\"6\",\"id_odontologo\":1,\"id_estado_cita\":1,\"fecha_cita\":\"2026-06-04 09:00:00\",\"motivo\":\"cirugia\",\"notas\":\"Derivado por Dr/a. chepe flores. Motivo: realizar cirjuia\"}}','2026-05-27 20:05:20'),
(399,4,'GET','/api/pacientes/6','::1','{}','2026-05-27 20:05:20'),
(400,4,'GET','/api/citas','::1','{}','2026-05-27 20:05:20'),
(401,4,'GET','/api/pacientes/6/historial','::1','{}','2026-05-27 20:05:20'),
(402,4,'GET','/api/notas/paciente/6','::1','{}','2026-05-27 20:05:20'),
(403,4,'GET','/api/recetas/paciente/6','::1','{}','2026-05-27 20:05:20'),
(404,4,'GET','/api/insumos','::1','{}','2026-05-27 20:05:20'),
(405,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:05:20'),
(406,4,'GET','/api/medicamentos','::1','{}','2026-05-27 20:05:20'),
(407,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:05:28'),
(408,4,'GET','/api/insumos','::1','{}','2026-05-27 20:05:29'),
(409,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:05:29'),
(410,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:05:31'),
(411,4,'GET','/api/citas','::1','{}','2026-05-27 20:05:31'),
(412,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:05:31'),
(413,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 20:06:20'),
(414,1,'GET','/api/stats','::ffff:127.0.0.1','{}','2026-05-27 20:06:38'),
(415,1,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 20:06:40'),
(416,1,'POST','/api/odontologos','::ffff:127.0.0.1','{\"body\":{\"nombre\":\"hector\",\"apellido\":\"flores\",\"correo\":\"hector@gmail.com\",\"password\":\"\",\"especialidad\":\"ortodoncia\",\"cedula_profesional\":\"a7asdad\"}}','2026-05-27 20:08:21'),
(417,1,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 20:08:22'),
(418,NULL,'POST','/api/auth/login','::ffff:127.0.0.1','{\"body\":{\"correo\":\"hector@gmail.com\",\"password\":\"***\"}}','2026-05-27 20:08:43'),
(419,10,'GET','/api/stats','::ffff:127.0.0.1','{}','2026-05-27 20:08:43'),
(420,10,'POST','/api/auth/cambiar-password-temporal','::ffff:127.0.0.1','{\"body\":{\"correo\":\"hector@gmail.com\",\"password_actual\":\"HbXuqQ6m\",\"password_nueva\":\"hector123\"}}','2026-05-27 20:08:58'),
(421,10,'GET','/api/pacientes','::ffff:127.0.0.1','{}','2026-05-27 20:09:01'),
(422,10,'GET','/api/stats','::ffff:127.0.0.1','{}','2026-05-27 20:09:07'),
(423,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 20:09:15'),
(424,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 20:09:21'),
(425,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password\":\"***\"}}','2026-05-27 20:09:28'),
(426,4,'GET','/api/stats','::1','{}','2026-05-27 20:09:28'),
(427,10,'GET','/api/pacientes','::ffff:127.0.0.1','{}','2026-05-27 20:09:52'),
(428,10,'GET','/api/pacientes/6','::ffff:127.0.0.1','{}','2026-05-27 20:09:59'),
(429,10,'GET','/api/citas','::ffff:127.0.0.1','{}','2026-05-27 20:09:59'),
(430,10,'GET','/api/pacientes/6/historial','::ffff:127.0.0.1','{}','2026-05-27 20:09:59'),
(431,10,'GET','/api/notas/paciente/6','::ffff:127.0.0.1','{}','2026-05-27 20:09:59'),
(432,10,'GET','/api/recetas/paciente/6','::ffff:127.0.0.1','{}','2026-05-27 20:09:59'),
(433,10,'GET','/api/insumos','::ffff:127.0.0.1','{}','2026-05-27 20:09:59'),
(434,10,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 20:09:59'),
(435,10,'GET','/api/medicamentos','::ffff:127.0.0.1','{}','2026-05-27 20:09:59'),
(436,10,'GET','/api/odontograma/6','::ffff:127.0.0.1','{}','2026-05-27 20:10:00'),
(437,10,'GET','/api/insumos','::ffff:127.0.0.1','{}','2026-05-27 20:10:23'),
(438,10,'POST','/api/insumos','::ffff:127.0.0.1','{\"body\":{\"nombre\":\"anestesia\",\"descripcion\":\"anestesias descartables\",\"categoria\":\"descartables\",\"unidad_medida\":\"5ml\",\"stock_minimo\":10,\"id_estado_insumo\":1}}','2026-05-27 20:11:00'),
(439,10,'GET','/api/insumos','::ffff:127.0.0.1','{}','2026-05-27 20:11:00'),
(440,10,'POST','/api/insumos/3/stock','::ffff:127.0.0.1','{\"body\":{\"cantidad\":10}}','2026-05-27 20:11:10'),
(441,10,'GET','/api/insumos','::ffff:127.0.0.1','{}','2026-05-27 20:11:10'),
(442,10,'POST','/api/insumos/3/stock','::ffff:127.0.0.1','{\"body\":{\"cantidad\":1}}','2026-05-27 20:11:21'),
(443,10,'GET','/api/insumos','::ffff:127.0.0.1','{}','2026-05-27 20:11:21'),
(444,10,'GET','/api/citas','::ffff:127.0.0.1','{}','2026-05-27 20:11:45'),
(445,10,'GET','/api/odontologos','::ffff:127.0.0.1','{}','2026-05-27 20:11:45'),
(446,10,'GET','/api/pacientes','::ffff:127.0.0.1','{}','2026-05-27 20:11:45'),
(447,10,'GET','/api/insumos','::ffff:127.0.0.1','{}','2026-05-27 20:11:46'),
(448,4,'GET','/api/citas','::1','{}','2026-05-27 20:11:51'),
(449,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:11:51'),
(450,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:11:51'),
(451,4,'GET','/api/pacientes/3','::1','{}','2026-05-27 20:11:53'),
(452,4,'GET','/api/citas','::1','{}','2026-05-27 20:11:53'),
(453,4,'GET','/api/pacientes/3/historial','::1','{}','2026-05-27 20:11:53'),
(454,4,'GET','/api/notas/paciente/3','::1','{}','2026-05-27 20:11:53'),
(455,4,'GET','/api/recetas/paciente/3','::1','{}','2026-05-27 20:11:53'),
(456,4,'GET','/api/insumos','::1','{}','2026-05-27 20:11:53'),
(457,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:11:53'),
(458,4,'GET','/api/medicamentos','::1','{}','2026-05-27 20:11:53'),
(459,4,'POST','/api/consultas','::1','{\"body\":{\"id_paciente\":\"3\",\"id_odontologo\":\"1\",\"fecha_consulta\":\"2026-05-31 11:30:00\",\"motivo_consulta\":\"Limpieza Dental\",\"diagnostico\":\"qwe\",\"tratamiento\":\"qewqe\",\"notas\":\"\",\"insumos_utilizados\":[{\"id_insumo\":3,\"nombre\":\"anestesia\",\"cantidad\":2}]}}','2026-05-27 20:12:08'),
(460,4,'PUT','/api/citas/18','::1','{\"body\":{\"id_odontologo\":\"1\",\"id_estado_cita\":3,\"fecha_cita\":\"2026-05-31 11:30:00\",\"motivo\":\"Limpieza Dental\",\"notas\":\"\"}}','2026-05-27 20:12:08'),
(461,4,'GET','/api/pacientes/3','::1','{}','2026-05-27 20:12:08'),
(462,4,'GET','/api/citas','::1','{}','2026-05-27 20:12:08'),
(463,4,'GET','/api/pacientes/3/historial','::1','{}','2026-05-27 20:12:08'),
(464,4,'GET','/api/notas/paciente/3','::1','{}','2026-05-27 20:12:08'),
(465,4,'GET','/api/recetas/paciente/3','::1','{}','2026-05-27 20:12:08'),
(466,4,'GET','/api/insumos','::1','{}','2026-05-27 20:12:08'),
(467,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:12:08'),
(468,4,'GET','/api/medicamentos','::1','{}','2026-05-27 20:12:08'),
(469,4,'GET','/api/insumos','::1','{}','2026-05-27 20:12:10'),
(470,4,'GET','/api/stats','::1','{}','2026-05-27 20:12:19'),
(471,4,'GET','/api/citas','::1','{}','2026-05-27 20:13:01'),
(472,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:13:01'),
(473,4,'GET','/api/odontologos','::1','{}','2026-05-27 20:13:01'),
(474,4,'GET','/api/pacientes','::1','{}','2026-05-27 20:13:02'),
(475,NULL,'POST','/api/auth/login','::ffff:127.0.0.1','{\"body\":{\"correo\":\"admin@clinica.com\",\"password\":\"***\"}}','2026-05-27 20:13:18'),
(476,1,'GET','/api/stats','::ffff:127.0.0.1','{}','2026-05-27 20:13:19'),
(477,1,'GET','/api/usuarios','::ffff:127.0.0.1','{}','2026-05-27 20:13:26'),
(478,1,'PUT','/api/usuarios/4','::ffff:127.0.0.1','{\"body\":{\"nombre\":\"chepe\",\"apellido\":\"flores\",\"correo\":\"drchepe@gmail.com\",\"rol\":\"dentista\",\"id_estado_usuario\":3}}','2026-05-27 20:13:50'),
(479,NULL,'POST','/api/auth/login','::1','{\"body\":{\"correo\":\"drchepe@gmail.com\",\"password\":\"***\"}}','2026-05-27 20:14:01'),
(480,1,'GET','/api/logs','::ffff:127.0.0.1','{}','2026-05-27 20:14:22'),
(481,1,'GET','/api/stats','::ffff:127.0.0.1','{}','2026-05-27 20:18:28');
/*!40000 ALTER TABLE `LOG_ACTIVIDAD` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `LOTE_INSUMO`
--

DROP TABLE IF EXISTS `LOTE_INSUMO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `LOTE_INSUMO` (
  `id_lote` int(11) NOT NULL AUTO_INCREMENT,
  `id_insumo` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `numero_lote` varchar(50) NOT NULL,
  `fecha_ingreso` datetime NOT NULL,
  `fecha_vencimiento` datetime NOT NULL,
  `cantidad_inicial` int(11) NOT NULL,
  `cantidad_disponible` int(11) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_lote`),
  KEY `id_insumo` (`id_insumo`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `LOTE_INSUMO_ibfk_1` FOREIGN KEY (`id_insumo`) REFERENCES `INSUMO_CLINICO` (`id_insumo`),
  CONSTRAINT `LOTE_INSUMO_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `PROVEEDOR` (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LOTE_INSUMO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `LOTE_INSUMO` WRITE;
/*!40000 ALTER TABLE `LOTE_INSUMO` DISABLE KEYS */;
INSERT INTO `LOTE_INSUMO` VALUES
(1,1,1,'L-426364','2026-05-18 00:00:00','2027-05-18 00:00:00',10,5,'Ingreso manual rápido','2026-05-18 17:37:06'),
(2,3,1,'L-270481','2026-05-28 00:00:00','2027-05-28 00:00:00',10,8,'Ingreso manual rápido','2026-05-27 20:11:10'),
(3,3,1,'L-281709','2026-05-28 00:00:00','2027-05-28 00:00:00',1,1,'Ingreso manual rápido','2026-05-27 20:11:21');
/*!40000 ALTER TABLE `LOTE_INSUMO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `MEDICAMENTO`
--

DROP TABLE IF EXISTS `MEDICAMENTO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `MEDICAMENTO` (
  `id_medicamento` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `presentacion` varchar(100) DEFAULT NULL,
  `via_administracion` varchar(100) DEFAULT NULL,
  `requiere_receta` tinyint(1) NOT NULL DEFAULT 0,
  `estado` varchar(20) NOT NULL DEFAULT 'activo',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_medicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MEDICAMENTO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `MEDICAMENTO` WRITE;
/*!40000 ALTER TABLE `MEDICAMENTO` DISABLE KEYS */;
INSERT INTO `MEDICAMENTO` VALUES
(1,'Anestésico Local (Lidocaína)','Anestésico local para procedimientos dentales','Ampolla 2ml','Inyectable',1,'activo','2026-05-15 22:58:28'),
(2,'Amoxicilina 500mg','Antibiótico de amplio espectro','Cápsula','Oral',1,'activo','2026-05-15 22:58:28'),
(3,'Ibuprofeno 400mg','Antiinflamatorio y analgésico','Tableta','Oral',0,'activo','2026-05-15 22:58:28'),
(4,'Paracetamol 500mg','Analgésico y antipirético','Tableta','Oral',0,'activo','2026-05-15 22:58:28'),
(5,'Clorhexidina 0.12%','Enjuague bucal antiséptico','Solución 250ml','Tópica',0,'activo','2026-05-15 22:58:28');
/*!40000 ALTER TABLE `MEDICAMENTO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `MOVIMIENTO_INVENTARIO`
--

DROP TABLE IF EXISTS `MOVIMIENTO_INVENTARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `MOVIMIENTO_INVENTARIO` (
  `id_movimiento` int(11) NOT NULL AUTO_INCREMENT,
  `id_lote` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_movimiento` varchar(50) NOT NULL,
  `fecha_movimiento` datetime NOT NULL DEFAULT current_timestamp(),
  `motivo` varchar(255) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_movimiento`),
  KEY `id_lote` (`id_lote`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `MOVIMIENTO_INVENTARIO_ibfk_1` FOREIGN KEY (`id_lote`) REFERENCES `LOTE_INSUMO` (`id_lote`),
  CONSTRAINT `MOVIMIENTO_INVENTARIO_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MOVIMIENTO_INVENTARIO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `MOVIMIENTO_INVENTARIO` WRITE;
/*!40000 ALTER TABLE `MOVIMIENTO_INVENTARIO` DISABLE KEYS */;
INSERT INTO `MOVIMIENTO_INVENTARIO` VALUES
(1,1,1,'SALIDA','2026-05-18 19:56:00','CONSULTA-1','Uso en consulta clínica. Cantidad: 2','2026-05-18 19:56:00'),
(2,1,4,'SALIDA','2026-05-20 12:10:20','CONSULTA-3','Uso en consulta clínica. Cantidad: 1','2026-05-20 12:10:20'),
(3,1,4,'SALIDA','2026-05-27 18:34:39','CONSULTA-7','Uso en consulta clínica. Cantidad: 1','2026-05-27 18:34:39'),
(4,1,4,'SALIDA','2026-05-27 19:58:52','CONSULTA-8','Uso en consulta clínica. Cantidad: 1','2026-05-27 19:58:52'),
(5,2,4,'SALIDA','2026-05-27 20:12:08','CONSULTA-9','Uso en consulta clínica. Cantidad: 2','2026-05-27 20:12:08');
/*!40000 ALTER TABLE `MOVIMIENTO_INVENTARIO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `NOTA_CLINICA`
--

DROP TABLE IF EXISTS `NOTA_CLINICA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `NOTA_CLINICA` (
  `id_nota` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `contenido` text NOT NULL,
  `categoria` varchar(50) NOT NULL DEFAULT 'general',
  `fecha_nota` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_nota`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `NOTA_CLINICA_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `PACIENTE` (`id_paciente`) ON DELETE CASCADE,
  CONSTRAINT `NOTA_CLINICA_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NOTA_CLINICA`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `NOTA_CLINICA` WRITE;
/*!40000 ALTER TABLE `NOTA_CLINICA` DISABLE KEYS */;
INSERT INTO `NOTA_CLINICA` VALUES
(1,4,1,'sdasd','asdasdasd','treatment','2026-05-20 12:08:22'),
(2,3,4,'Derivación a Dr/a. chepe flores','DERIVACIÓN A ESPECIALISTA\n──────────────────────────\nDoctor Referente: Dr/a. chepe flores\nDoctor Destino: Dr/a. chepe flores\nUrgencia: Normal\nMotivo de Derivación:\nas','followup','2026-05-23 22:32:09'),
(3,4,4,'Derivación a Dr/a. chepe flores','DERIVACIÓN A ESPECIALISTA\n──────────────────────────\nDoctor Referente: Dr/a. chepe flores\nDoctor Destino: Dr/a. chepe flores (asdas)\nUrgencia: Normal\nMotivo de Derivación:\nasdasd','followup','2026-05-23 22:34:58'),
(4,6,4,'evaluacion post cita','siguiente semana intervencion quirurjica','followup','2026-05-27 20:03:40'),
(5,6,4,'Derivación a Dr/a. chepe flores','DERIVACIÓN A ESPECIALISTA\n──────────────────────────\nDoctor Referente: Dr/a. chepe flores\nDoctor Destino: Dr/a. chepe flores (cirugia)\nUrgencia: Normal\nMotivo de Derivación:\nrealizar cirjuia','followup','2026-05-27 20:05:20');
/*!40000 ALTER TABLE `NOTA_CLINICA` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `NOTIFICACION`
--

DROP TABLE IF EXISTS `NOTIFICACION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `NOTIFICACION` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` varchar(255) NOT NULL,
  `id_tipo_notificacion` int(11) NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_envio` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_tipo_notificacion` (`id_tipo_notificacion`),
  CONSTRAINT `NOTIFICACION_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`),
  CONSTRAINT `NOTIFICACION_ibfk_2` FOREIGN KEY (`id_tipo_notificacion`) REFERENCES `TIPO_NOTIFICACION` (`id_tipo_notificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NOTIFICACION`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `NOTIFICACION` WRITE;
/*!40000 ALTER TABLE `NOTIFICACION` DISABLE KEYS */;
/*!40000 ALTER TABLE `NOTIFICACION` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ODONTOGRAMA`
--

DROP TABLE IF EXISTS `ODONTOGRAMA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ODONTOGRAMA` (
  `id_odontograma` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `datos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'JSON con el estado de cada diente' CHECK (json_valid(`datos`)),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_odontograma`),
  KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `ODONTOGRAMA_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `PACIENTE` (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ODONTOGRAMA`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ODONTOGRAMA` WRITE;
/*!40000 ALTER TABLE `ODONTOGRAMA` DISABLE KEYS */;
INSERT INTO `ODONTOGRAMA` VALUES
(1,3,'{\"11\":{\"number\":11,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"fracture\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"12\":{\"number\":12,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"13\":{\"number\":13,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"14\":{\"number\":14,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"15\":{\"number\":15,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"16\":{\"number\":16,\"surfaces\":{\"top\":\"fracture\",\"left\":\"fracture\",\"center\":\"fracture\",\"right\":\"fracture\",\"bottom\":\"fracture\"}},\"17\":{\"number\":17,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"18\":{\"number\":18,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"21\":{\"number\":21,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"22\":{\"number\":22,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"23\":{\"number\":23,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"24\":{\"number\":24,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"25\":{\"number\":25,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"implant\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"26\":{\"number\":26,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"27\":{\"number\":27,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"28\":{\"number\":28,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"31\":{\"number\":31,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"32\":{\"number\":32,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"33\":{\"number\":33,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"34\":{\"number\":34,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"35\":{\"number\":35,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"36\":{\"number\":36,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"37\":{\"number\":37,\"surfaces\":{\"top\":\"to_extract\",\"left\":\"to_extract\",\"center\":\"to_extract\",\"right\":\"to_extract\",\"bottom\":\"to_extract\"}},\"38\":{\"number\":38,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"41\":{\"number\":41,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"42\":{\"number\":42,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"43\":{\"number\":43,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"44\":{\"number\":44,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"45\":{\"number\":45,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"46\":{\"number\":46,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"47\":{\"number\":47,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"48\":{\"number\":48,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}}}','2026-05-18 19:35:42','2026-05-18 19:33:38'),
(2,4,'{\"11\":{\"number\":11,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"12\":{\"number\":12,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"13\":{\"number\":13,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"implant\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"14\":{\"number\":14,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"implant\",\"right\":\"healthy\",\"bottom\":\"implant\"}},\"15\":{\"number\":15,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"16\":{\"number\":16,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"17\":{\"number\":17,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"18\":{\"number\":18,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"21\":{\"number\":21,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"22\":{\"number\":22,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"23\":{\"number\":23,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"24\":{\"number\":24,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"25\":{\"number\":25,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"26\":{\"number\":26,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"27\":{\"number\":27,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"28\":{\"number\":28,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"31\":{\"number\":31,\"surfaces\":{\"top\":\"healthy\",\"left\":\"implant\",\"center\":\"implant\",\"right\":\"implant\",\"bottom\":\"healthy\"}},\"32\":{\"number\":32,\"surfaces\":{\"top\":\"healthy\",\"left\":\"fracture\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"33\":{\"number\":33,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"34\":{\"number\":34,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"fracture\",\"right\":\"restored\",\"bottom\":\"healthy\"}},\"35\":{\"number\":35,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"36\":{\"number\":36,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"37\":{\"number\":37,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"restored\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"38\":{\"number\":38,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"41\":{\"number\":41,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"42\":{\"number\":42,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"43\":{\"number\":43,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"44\":{\"number\":44,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"45\":{\"number\":45,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"46\":{\"number\":46,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"47\":{\"number\":47,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"48\":{\"number\":48,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"fracture\",\"right\":\"healthy\",\"bottom\":\"healthy\"}}}','2026-05-20 13:22:22','2026-05-20 13:20:04'),
(3,5,'{\"11\":{\"number\":11,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"root_canal\",\"right\":\"root_canal\",\"bottom\":\"healthy\"}},\"12\":{\"number\":12,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"13\":{\"number\":13,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"14\":{\"number\":14,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"15\":{\"number\":15,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"16\":{\"number\":16,\"surfaces\":{\"top\":\"caries\",\"left\":\"caries\",\"center\":\"caries\",\"right\":\"caries\",\"bottom\":\"caries\"}},\"17\":{\"number\":17,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"18\":{\"number\":18,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"21\":{\"number\":21,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"22\":{\"number\":22,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"23\":{\"number\":23,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"24\":{\"number\":24,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"25\":{\"number\":25,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"26\":{\"number\":26,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"27\":{\"number\":27,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"root_canal\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"28\":{\"number\":28,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"31\":{\"number\":31,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"32\":{\"number\":32,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"33\":{\"number\":33,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"34\":{\"number\":34,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"35\":{\"number\":35,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"36\":{\"number\":36,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"37\":{\"number\":37,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"38\":{\"number\":38,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"41\":{\"number\":41,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"42\":{\"number\":42,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"43\":{\"number\":43,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"44\":{\"number\":44,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"45\":{\"number\":45,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"46\":{\"number\":46,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"47\":{\"number\":47,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"48\":{\"number\":48,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}}}','2026-05-27 18:34:05','2026-05-27 18:34:05'),
(4,6,'{\"11\":{\"number\":11,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"12\":{\"number\":12,\"surfaces\":{\"top\":\"restored\",\"left\":\"healthy\",\"center\":\"implant\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"13\":{\"number\":13,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"caries\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"14\":{\"number\":14,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"15\":{\"number\":15,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"16\":{\"number\":16,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"17\":{\"number\":17,\"surfaces\":{\"top\":\"healthy\",\"left\":\"caries\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"18\":{\"number\":18,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"21\":{\"number\":21,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"22\":{\"number\":22,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"23\":{\"number\":23,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"root_canal\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"24\":{\"number\":24,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"25\":{\"number\":25,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"26\":{\"number\":26,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"27\":{\"number\":27,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"28\":{\"number\":28,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"31\":{\"number\":31,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"32\":{\"number\":32,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"33\":{\"number\":33,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"34\":{\"number\":34,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"35\":{\"number\":35,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"36\":{\"number\":36,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"37\":{\"number\":37,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"38\":{\"number\":38,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"41\":{\"number\":41,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"42\":{\"number\":42,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"43\":{\"number\":43,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"44\":{\"number\":44,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"45\":{\"number\":45,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"46\":{\"number\":46,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"47\":{\"number\":47,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}},\"48\":{\"number\":48,\"surfaces\":{\"top\":\"healthy\",\"left\":\"healthy\",\"center\":\"healthy\",\"right\":\"healthy\",\"bottom\":\"healthy\"}}}','2026-05-27 19:56:33','2026-05-27 19:56:33');
/*!40000 ALTER TABLE `ODONTOGRAMA` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ODONTOLOGO`
--

DROP TABLE IF EXISTS `ODONTOLOGO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ODONTOLOGO` (
  `id_odontologo` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `cedula_profesional` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_odontologo`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `ODONTOLOGO_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ODONTOLOGO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ODONTOLOGO` WRITE;
/*!40000 ALTER TABLE `ODONTOLOGO` DISABLE KEYS */;
INSERT INTO `ODONTOLOGO` VALUES
(1,4,'Ortodoncia','123134','2026-05-15 23:43:18'),
(2,2,'General','123456','2026-05-23 23:09:01'),
(3,10,'ortodoncia','a7asdad','2026-05-27 20:08:22');
/*!40000 ALTER TABLE `ODONTOLOGO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `PACIENTE`
--

DROP TABLE IF EXISTS `PACIENTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `PACIENTE` (
  `id_paciente` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `sexo` varchar(10) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `contacto_emergencia_nombre` varchar(100) DEFAULT NULL,
  `contacto_emergencia_telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `documento_identidad` varchar(50) DEFAULT NULL,
  `alergias` varchar(255) DEFAULT NULL,
  `tipo_sangre` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_paciente`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `PACIENTE_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PACIENTE`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `PACIENTE` WRITE;
/*!40000 ALTER TABLE `PACIENTE` DISABLE KEYS */;
INSERT INTO `PACIENTE` VALUES
(2,6,'Adonay','Flores ','2002-09-15','Masculino','60470241','adonayflores@gmail.com','santa ana ','maria flores','77777777','2026-05-16 11:07:42','123456789','Ninguna conocida','B+'),
(3,4,'Adonay','Flores','2000-01-01','Masculino','11111111','adonayflores@gmail.com','santa ana','MARIA','1111111111','2026-05-16 11:53:54',NULL,NULL,NULL),
(4,7,'Jose Luis','Mendoza Hernandez','1985-05-07','Masculino','10101010','joseluis@gmail.com','direccion','maria hernandez','77777777','2026-05-18 21:39:42','0203605556','ninguna','B+'),
(5,8,'Luis Fernando','Gil Portales','2000-11-19','Masculino','79732028','luisportales@gmail.com','colonia la heroica , calle principal , casa 20','Luisa Portales','75757575','2026-05-27 18:29:12','099555951','ninguna','B+'),
(6,9,'15151225158525','1655151515252','2012-02-15','Masculino','gsrgrsgrsgr15551515','JuanPerez@gmail.com','Residencial Cadiz',NULL,NULL,'2026-05-27 19:45:17','nfjnzdfjndsjfnjesnfnjde','ninguna','A+');
/*!40000 ALTER TABLE `PACIENTE` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `PROVEEDOR`
--

DROP TABLE IF EXISTS `PROVEEDOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROVEEDOR` (
  `id_proveedor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_proveedor` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROVEEDOR`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `PROVEEDOR` WRITE;
/*!40000 ALTER TABLE `PROVEEDOR` DISABLE KEYS */;
INSERT INTO `PROVEEDOR` VALUES
(1,'Distribuidora Dental El Salvador','2222-3333','ventas@dentalsa.com','San Salvador, El Salvador','Juan Pérez','2026-05-15 22:58:28'),
(2,'Farmacéutica Nacional','2444-5555','info@farmanacional.com','Santa Ana, El Salvador','María López','2026-05-15 22:58:28');
/*!40000 ALTER TABLE `PROVEEDOR` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `RECETA`
--

DROP TABLE IF EXISTS `RECETA`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECETA` (
  `id_receta` int(11) NOT NULL AUTO_INCREMENT,
  `id_consulta` int(11) NOT NULL,
  `fecha_receta` datetime NOT NULL DEFAULT current_timestamp(),
  `indicaciones_generales` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_receta`),
  KEY `id_consulta` (`id_consulta`),
  CONSTRAINT `RECETA_ibfk_1` FOREIGN KEY (`id_consulta`) REFERENCES `CONSULTA_CLINICA` (`id_consulta`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECETA`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `RECETA` WRITE;
/*!40000 ALTER TABLE `RECETA` DISABLE KEYS */;
INSERT INTO `RECETA` VALUES
(1,4,'2026-05-20 12:15:09','acetaminofen cada 8 horas para el dolor ');
/*!40000 ALTER TABLE `RECETA` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `RECETA_DETALLE`
--

DROP TABLE IF EXISTS `RECETA_DETALLE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECETA_DETALLE` (
  `id_receta_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `id_receta` int(11) NOT NULL,
  `id_medicamento` int(11) NOT NULL,
  `dosis` varchar(50) NOT NULL,
  `frecuencia` varchar(50) NOT NULL,
  `duracion` varchar(50) NOT NULL,
  `cantidad_indicada` varchar(50) NOT NULL,
  `instrucciones` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_receta_detalle`),
  KEY `id_receta` (`id_receta`),
  KEY `id_medicamento` (`id_medicamento`),
  CONSTRAINT `RECETA_DETALLE_ibfk_1` FOREIGN KEY (`id_receta`) REFERENCES `RECETA` (`id_receta`),
  CONSTRAINT `RECETA_DETALLE_ibfk_2` FOREIGN KEY (`id_medicamento`) REFERENCES `MEDICAMENTO` (`id_medicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECETA_DETALLE`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `RECETA_DETALLE` WRITE;
/*!40000 ALTER TABLE `RECETA_DETALLE` DISABLE KEYS */;
INSERT INTO `RECETA_DETALLE` VALUES
(1,1,3,'500 mg','cada 8 horas','7 dias ','12',NULL);
/*!40000 ALTER TABLE `RECETA_DETALLE` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `TIPO_DOCUMENTO`
--

DROP TABLE IF EXISTS `TIPO_DOCUMENTO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `TIPO_DOCUMENTO` (
  `id_tipo_documento` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_tipo_documento`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TIPO_DOCUMENTO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `TIPO_DOCUMENTO` WRITE;
/*!40000 ALTER TABLE `TIPO_DOCUMENTO` DISABLE KEYS */;
INSERT INTO `TIPO_DOCUMENTO` VALUES
(1,'RADIOGRAFIA','Radiografía','Imagen de radiografía dental',1,'2026-05-15 22:58:28'),
(2,'CONSENTIMIENTO','Consentimiento','Formulario de consentimiento informado',1,'2026-05-15 22:58:28'),
(3,'PRESUPUESTO','Presupuesto','Presupuesto de tratamiento',1,'2026-05-15 22:58:28'),
(4,'OTRO','Otro','Otro tipo de documento',1,'2026-05-15 22:58:28');
/*!40000 ALTER TABLE `TIPO_DOCUMENTO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `TIPO_NOTIFICACION`
--

DROP TABLE IF EXISTS `TIPO_NOTIFICACION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `TIPO_NOTIFICACION` (
  `id_tipo_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_tipo_notificacion`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TIPO_NOTIFICACION`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `TIPO_NOTIFICACION` WRITE;
/*!40000 ALTER TABLE `TIPO_NOTIFICACION` DISABLE KEYS */;
INSERT INTO `TIPO_NOTIFICACION` VALUES
(1,'CITA','Cita','Notificación relacionada con citas',1,'2026-05-15 22:58:28'),
(2,'STOCK','Stock Bajo','Notificación de stock bajo de medicamentos',1,'2026-05-15 22:58:28'),
(3,'SISTEMA','Sistema','Notificación del sistema',1,'2026-05-15 22:58:28'),
(4,'RECETA','Receta','Notificación de nueva receta',1,'2026-05-15 22:58:28');
/*!40000 ALTER TABLE `TIPO_NOTIFICACION` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `USUARIO`
--

DROP TABLE IF EXISTS `USUARIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `USUARIO` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `id_estado_usuario` int(11) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `requiere_cambio_password` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_estado_usuario` (`id_estado_usuario`),
  CONSTRAINT `USUARIO_ibfk_1` FOREIGN KEY (`id_estado_usuario`) REFERENCES `ESTADO_USUARIO` (`id_estado_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USUARIO`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `USUARIO` WRITE;
/*!40000 ALTER TABLE `USUARIO` DISABLE KEYS */;
INSERT INTO `USUARIO` VALUES
(1,'Admin','Sistema','admin@clinica.com','$2a$10$bzkcAmugBsggBzEnioWZte5qWKl2OLJcbHYPVeeAOmHksP9xl.i8K','admin',1,'2026-05-15 22:58:28',0),
(2,'Doctor','Demo','doctor@clinica.com','$2a$10$WsGzkY/GSqL9YNDwT5k0/.hej3HmRSdP3Fg8a.psdrUm66dAUtata','dentista',1,'2026-05-15 22:58:28',0),
(3,'Asistente','Demo','asistente@clinica.com','$2a$10$Y0g7wWNNI/Da5zS2ib1iwuhUNVaUBtFrQzqAtnNUBAv07evnlh/gO','asistente',1,'2026-05-15 22:58:28',0),
(4,'chepe','flores','drchepe@gmail.com','$2a$10$NvIh.n28c1cUNmnTdWweMePGzovdbFMjNr8NulmtO/dJlg0SpOlK.','dentista',3,'2026-05-15 23:43:18',0),
(5,'Adonay Edgardo','flores','correo@gmail.com','$2a$10$ZET/qd2Tbbadw1l8.ZBLdOxDC33X8AA7DUUzko8Oq/8zdo3ak40aS','paciente',1,'2026-05-15 23:48:41',0),
(6,'Adonay','Flores ','adonayflores@gmail.com','$2a$10$ayWbqkDixDn48HovYZzV/.H3yza8FOG15uJVcooyKwSpQhnPFDym6','paciente',3,'2026-05-16 11:08:10',0),
(7,'Jose Luis','Mendoza Hernandez','joseluis@gmail.com','$2a$10$O2XhFHSjeP5rmtB1CDFfMe5GToul2pfBeWb/bQEzZklIQ4h6J34Pe','paciente',1,'2026-05-18 21:40:05',0),
(8,'Luis Fernando','Gil Portales','luisportales@gmail.com','$2a$10$2WYjRrm1o9FsVKTGugesXOIrx8mOg/bDmVIePkZHH3B.ImfSlGxcu','paciente',1,'2026-05-27 18:29:45',0),
(9,'15151225158525','1655151515252','JuanPerez@gmail.com','$2a$10$wAdL9IUuQjGvj4zq25JiReSR5cAId6EtpDETfwVsb0weClfEzX5d.','paciente',1,'2026-05-27 19:45:17',0),
(10,'hector','flores','hector@gmail.com','$2a$10$dKor7kY41sQiMvzbzOMjue2Q8OczdNgIA0naFGJeJInzp7GhE15MG','dentista',1,'2026-05-27 20:08:22',0);
/*!40000 ALTER TABLE `USUARIO` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-27 21:35:20
