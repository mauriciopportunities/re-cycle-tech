-- ============================================================
-- Re-Cycle Tech — DDL versionado (Fase 3)
-- ============================================================
-- CORRECCIÓN del hallazgo de Fase 2 "DDL con índices no ejecutables":
-- el script anterior definía índices sobre residuoId y usuarioId(email),
-- pero las columnas reales (generadas por las entidades JPA) son
-- residuo_id y email. Este archivo usa los nombres de columna reales y
-- se puede ejecutar desde una base vacía sin errores.
--
-- Uso (instalación limpia y reproducible):
--   docker-compose up -d postgres
--   psql "postgresql://admin:<password>@localhost:5432/recycle_db" -f database/schema.sql
--
-- Nota: en desarrollo, Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- también puede crear/actualizar estas tablas automáticamente al levantar
-- el backend. Este archivo es la referencia versionada y reproducible del
-- esquema para auditoría, evaluación y despliegues futuros con Flyway.
-- ============================================================

BEGIN;

-- ============================================================
-- USUARIO
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario (
    id              BIGSERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    password        VARCHAR(255) NOT NULL,
    rol             VARCHAR(30)  NOT NULL DEFAULT 'CIUDADANO',
    fecha_registro  TIMESTAMP,
    CONSTRAINT uq_usuario_email UNIQUE (email)
);

-- Índice explícito de apoyo a login/lookup por email (además del UNIQUE).
-- Nombre corregido respecto al hallazgo de Fase 2: usuarioId(email) -> email.
CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario (email);

-- ============================================================
-- CENTRO_ACOPIO
-- ============================================================
CREATE TABLE IF NOT EXISTS centro_acopio (
    id          BIGSERIAL PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    direccion   TEXT NOT NULL,
    latitud     DOUBLE PRECISION NOT NULL,
    longitud    DOUBLE PRECISION NOT NULL,
    telefono    VARCHAR(20),
    horario     VARCHAR(100),
    capacidad   VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_centro_acopio_lat_lng ON centro_acopio (latitud, longitud);

-- ============================================================
-- RESIDUO
-- ============================================================
CREATE TABLE IF NOT EXISTS residuo (
    id              BIGSERIAL PRIMARY KEY,
    usuario_id      BIGINT NOT NULL REFERENCES usuario (id),
    centro_id       BIGINT REFERENCES centro_acopio (id),
    tipo            VARCHAR(50) NOT NULL,
    descripcion     TEXT,
    latitud         DOUBLE PRECISION,
    longitud        DOUBLE PRECISION,
    estado          VARCHAR(30) NOT NULL DEFAULT 'REGISTRADO',
    fecha_registro  TIMESTAMP,
    CONSTRAINT chk_residuo_estado CHECK (estado IN (
        'REGISTRADO', 'PENDIENTE_ENTREGA', 'RECIBIDO_EN_CENTRO', 'CLASIFICADO',
        'DONADO', 'RECICLADO', 'REACONDICIONADO', 'DESTRUCCION_SEGURA'
    ))
);

CREATE INDEX IF NOT EXISTS idx_residuo_usuario ON residuo (usuario_id);
CREATE INDEX IF NOT EXISTS idx_residuo_estado  ON residuo (estado);

-- ============================================================
-- TRAZABILIDAD
-- ============================================================
CREATE TABLE IF NOT EXISTS trazabilidad (
    id              BIGSERIAL PRIMARY KEY,
    residuo_id      BIGINT NOT NULL REFERENCES residuo (id),
    estado_anterior VARCHAR(30),
    estado_nuevo    VARCHAR(30) NOT NULL,
    responsable_id  BIGINT REFERENCES usuario (id),
    observaciones   TEXT,
    fecha_cambio    TIMESTAMP
);

-- Índice explícito, corregido respecto al hallazgo de Fase 2:
-- antes idx_trazabilidad_residuo(residuoId) -> ahora (residuo_id).
CREATE INDEX IF NOT EXISTS idx_trazabilidad_residuo ON trazabilidad (residuo_id);
CREATE INDEX IF NOT EXISTS idx_trazabilidad_fecha    ON trazabilidad (fecha_cambio);

-- ============================================================
-- RNF-05: TRAZABILIDAD INMUTABLE (refuerzo a nivel de base de datos)
-- ------------------------------------------------------------
-- La aplicación ya no expone update/delete para trazabilidad
-- (TrazabilidadRepository solo declara save/findById/findByResiduo...).
-- Este trigger es una segunda capa de defensa: aunque alguien se conecte
-- directo a la base de datos con permisos de escritura, no podrá
-- modificar ni borrar un evento de trazabilidad ya insertado.
-- ============================================================
CREATE OR REPLACE FUNCTION fn_trazabilidad_inmutable()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION
        'trazabilidad es de solo inserción (RNF-05): % no permitido sobre id=%',
        TG_OP, OLD.id;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trazabilidad_no_update ON trazabilidad;
CREATE TRIGGER trg_trazabilidad_no_update
    BEFORE UPDATE ON trazabilidad
    FOR EACH ROW EXECUTE FUNCTION fn_trazabilidad_inmutable();

DROP TRIGGER IF EXISTS trg_trazabilidad_no_delete ON trazabilidad;
CREATE TRIGGER trg_trazabilidad_no_delete
    BEFORE DELETE ON trazabilidad
    FOR EACH ROW EXECUTE FUNCTION fn_trazabilidad_inmutable();

COMMIT;

-- ============================================================
-- PRUEBA DE INMUTABILIDAD (evidencia para Fase 3, ejecutar aparte)
-- ============================================================
-- UPDATE trazabilidad SET observaciones = 'intento no autorizado' WHERE id = 1;
-- Resultado esperado: ERROR: trazabilidad es de solo inserción (RNF-05)...
--
-- DELETE FROM trazabilidad WHERE id = 1;
-- Resultado esperado: ERROR: trazabilidad es de solo inserción (RNF-05)...
