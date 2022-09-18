-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 18-09-2022 a las 22:04:09
-- Versión del servidor: 8.0.17
-- Versión de PHP: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_proyecto2022`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hospitales`
--

CREATE TABLE `hospitales` (
  `id` int(11) NOT NULL,
  `email` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `hospitales`
--

INSERT INTO `hospitales` (`id`, `email`) VALUES
(1, 'LuisMaimonides@gmail.com'),
(2, 'LuisMaimonides@gmail.com'),
(3, 'LuisMaimonides@gmail.com'),
(4, 'LuisMaimonides@gmail.com'),
(5, 'LuisMaimonides@gmail.com'),
(6, 'LuisMaimonides@gmail.com'),
(7, 'LuisMaimonides@gmail.com'),
(8, 'LuisovichHospital@gmail.com'),
(9, 'PepeSandHospital@gmail.com'),
(10, 'ArotuAlzoHospital@gmail.com'),
(11, 'Nacho@gmail.com'),
(12, 'HelfHospital@est.edu.ar'),
(13, 'PolloHospital@est.edu.ar'),
(14, 'AAHospital@est.edu.ar'),
(15, 'LuisHospita@est.edu.ar'),
(16, '47205114@est.ort.edu.ar'),
(17, '47205114@est.ort.edu.ar'),
(18, '47205114@est.ort.edu.ar'),
(19, '47205114@est.ort.edu.ar'),
(20, '47205114@est.ort.edu.ar'),
(21, '47205114@est.ort.edu.ar'),
(22, '47205114@est.ort.edu.ar'),
(23, '47205114@est.ort.edu.ar'),
(24, '47205114@est.ort.edu.ar'),
(25, '47205114@est.ort.edu.ar'),
(26, '47205114@est.ort.edu.ar'),
(27, '47205114@est.ort.edu.ar'),
(28, '47205114@est.ort.edu.ar'),
(29, '47205114@est.ort.edu.ar'),
(30, '47205114@est.ort.edu.ar'),
(31, '47205114@est.ort.edu.ar'),
(32, '47205114@est.ort.edu.ar'),
(33, '47205114@est.ort.edu.ar'),
(34, '47205114@est.ort.edu.ar'),
(35, '47205114@est.ort.edu.ar'),
(36, '47205114@est.ort.edu.ar'),
(37, '47205114@est.ort.edu.ar'),
(38, '47205114@est.ort.edu.ar'),
(39, '47205114@est.ort.edu.ar'),
(40, '47205114@est.ort.edu.ar'),
(41, '47205114@est.ort.edu.ar'),
(42, '47205114@est.ort.edu.ar'),
(43, '47205114@est.ort.edu.ar'),
(44, '47205114@est.ort.edu.ar'),
(45, '47205114@est.ort.edu.ar'),
(46, '47205114@est.ort.edu.ar'),
(47, '47205114@est.ort.edu.ar'),
(48, '47205114@est.ort.edu.ar'),
(49, '47205114@est.ort.edu.ar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `id` int(11) NOT NULL,
  `DNI` int(8) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_medico` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`id`, `DNI`, `nombre`, `apellido`, `createdAt`, `id_medico`) VALUES
(30, 13789432, 'Ramiro', 'Perez', '2022-08-17 17:33:30', NULL),
(31, 13789432, 'Ramiro', 'Perez', '2022-08-17 17:33:53', NULL),
(33, 11222344, 'Pancho', 'Santarelli', '2022-08-22 00:48:33', 11),
(34, 908732626, 'Pancho', 'Santarelli', '2022-08-22 00:54:18', 11),
(35, 12345098, 'Martin', 'Choe', '2022-08-23 23:24:12', 14),
(36, 12345054, 'Juan', 'Choiue', '2022-08-23 23:36:52', 14),
(37, 32345054, 'Juan', 'Choiue', '2022-08-23 23:37:13', 14),
(38, 41235678, 'Mariano', 'Fuentes', '2022-09-02 00:36:36', 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `radiografias`
--

CREATE TABLE `radiografias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `titulo` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `descripcion` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ruta` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `prediccion_cnn` varchar(7) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `prediccion_transformers` varchar(7) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `prediccion_promedio` varchar(7) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_Paciente` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `radiografias`
--

INSERT INTO `radiografias` (`id`, `nombre`, `titulo`, `descripcion`, `ruta`, `prediccion_cnn`, `prediccion_transformers`, `prediccion_promedio`, `createdAt`, `id_Paciente`) VALUES
(20, 'e265d71b-bde8-4f2c-bc53-1b626845c8ea.jpg', 'hola', 'chau', 'D:\\Desktop\\WebPractica\\Back-End\\Server-N', '78.34 %', '', '', '2022-09-16 23:23:54', 37);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro`
--

CREATE TABLE `registro` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `apellido` varchar(40) NOT NULL,
  `email` varchar(60) NOT NULL,
  `contrasenia` varchar(100) NOT NULL,
  `matricula` int(6) NOT NULL,
  `id_Hospital` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `registro`
--

INSERT INTO `registro` (`id`, `nombre`, `apellido`, `email`, `contrasenia`, `matricula`, `id_Hospital`) VALUES
(1, '0', '0', '0', '0', 123908, NULL),
(2, 'Augusto', 'Lorencetti', 'AugustoLoren@gmail.com', 'Mamhuevo', 123908, NULL),
(3, 'Augusto', 'Lorencetti', 'AugustoLoren@gmail.com', 'Mamhuevo', 123908, NULL),
(4, 'Augusto', 'Lorencetti', 'AugustoLoren@gmail.com', 'Mamhuevo', 123908, NULL),
(5, 'Augusto', 'Lorencetti', 'AugustoLoren@gmail.com', 'Mamhuevo', 123908, NULL),
(6, 'Augusto', 'Lorencetti', 'AugustoLoren@gmail.com', 'Mamhuevo', 123908, NULL),
(7, 'Augusto', 'Lorencetti', 'AugustoLoren@gmail.com', 'Mamhuevo', 123908, NULL),
(8, 'Augusto', 'Lorencetti', 'AugustoLoren@gmail.com', 'Mamhuevo', 123908, 6),
(9, 'Augusto', 'Lorencetti', 'AugustoLoren@gmail.com', 'Mamhuevo', 123908, 7),
(10, 'Mandarino', 'Juancho', 'MandarinoJuancho@gmail.com', '$2a$12$Qv1xTGUKV1XKKz/PITHHgeTh1/n1gT.iA/rCD4/x5IrlbMsJpCFNq', 123333, 8),
(11, 'Pepe', 'Sand', 'PepeSand@gmail.com', '$2a$12$u8.qy7Yz4sDXX3.4rLj3ze7VQTj0bxTghTa5pyckCJChmZWiBsSYy', 124567, 9),
(12, 'Arotu', 'Alzo', 'ArotuAlzo@gmail.com', '$2a$12$IqhwNm3KXhHsFg4wgQFGfey1rJTblGCjYPiT.CYOULMTo557GRbTe', 897654, 10),
(13, 'Nacho', 'Alzo', 'Nacho@gmail.com', '$2a$12$tCtK2g21mf4ZZd4lwbJAK.B2BqYZCSyZaO91OYua/i18rlp0o4A4S', 897654, 11),
(14, 'Manuel', 'Rodriguez', 'ManuRodriguez@gmail.com', '$2a$12$Oq16HISFH8I1.KNdOtbFgOG0KO7.7eROCNWg6y0NbCReZ6y6axKyu', 345908, 12),
(15, 'Pollo', 'Vignolo', 'PolloVignolo@gmail.com', '$2a$12$hdmxeStotKMwg/NiYEBYKOn0SQoRGrFBs77VWUGxhvGTeQAANW5BO', 456908, 13),
(16, 'Ariel', 'Alzogaray', 'ArielAlzogaray@gmail.com', '$2a$12$mxDu6oEOgQIXT05rw5neveVrck3haluxQ2gsTmLAcXXE4q2M2824y', 987654, 14),
(17, 'Luis', 'Embo', 'LuisardPollo@gmail.com', '$2a$12$04JDtteS4.rddDvrOS1kXerCkziEZFODfaaaThfDOXxsAAMQiYW6q', 345908, 15),
(18, 'Leo', 'E', 'LuisPollo@gmail.com', '$2a$12$Zj19cYg9cnl2nP6GR5Z8S.T4jzQi9mzlbb89MjLynzDFIxQfWgUN.', 345905, 16),
(19, 'Leo', 'E', 'LuisPolsalo@gmail.com', '$2a$12$XJc5llT4OB3SZ3V0w8c9KOEKDnRC5pa6/60qgmWxhMJp/S3Eurq0i', 345905, 17);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `hospitales`
--
ALTER TABLE `hospitales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario` (`id_medico`);

--
-- Indices de la tabla `radiografias`
--
ALTER TABLE `radiografias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_paciente` (`id_Paciente`);

--
-- Indices de la tabla `registro`
--
ALTER TABLE `registro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_hospital` (`id_Hospital`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `hospitales`
--
ALTER TABLE `hospitales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `radiografias`
--
ALTER TABLE `radiografias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `registro`
--
ALTER TABLE `registro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`id_medico`) REFERENCES `registro` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `radiografias`
--
ALTER TABLE `radiografias`
  ADD CONSTRAINT `fk_paciente` FOREIGN KEY (`id_Paciente`) REFERENCES `paciente` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `registro`
--
ALTER TABLE `registro`
  ADD CONSTRAINT `fk_hospital` FOREIGN KEY (`id_Hospital`) REFERENCES `hospitales` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
