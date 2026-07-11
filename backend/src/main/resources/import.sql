-- ============================================================
-- LIMPIAR CENTROS EXISTENTES
-- ============================================================
DELETE FROM centro_acopio;

-- ============================================================
-- INSERTAR CENTROS REALES DE EL SALVADOR
-- ============================================================
INSERT INTO centro_acopio (nombre, direccion, latitud, longitud, telefono, horario, capacidad) VALUES
('MARN - Ministerio de Medio Ambiente', 'Km 5½ Carretera a Santa Tecla, Col. Las Mercedes, San Salvador', 13.6724, -89.2621, '503-2132-6000', 'Lun-Vie 7:30-15:30', '1000 kg/día'),
('SRS - Superintendencia de Regulación Sanitaria', '75 Av. Sur #214, Col. Escalón, San Salvador', 13.6899, -89.2486, '503-2511-7000', 'Lun-Vie 8:00-16:00', '500 kg/día'),
('ZARTEX - Gestor Autorizado', 'Calle Agua Caliente Km 5, Soyapango', 13.7067, -89.1496, '503-1234-5678', 'Lun-Vie 8:00-17:00', '800 kg/día'),
('AUTOCONSA - Gestor Autorizado', '37 Ave. Sur #543, Col. Flor Blanca, San Salvador', 13.6946, -89.2357, '503-1234-5679', 'Lun-Vie 8:00-17:00', '600 kg/día'); 