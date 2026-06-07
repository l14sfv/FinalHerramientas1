CREATE DATABASE tareas_db;

USE tareas_db;

CREATE TABLE usuarios (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(100) NOT NULL UNIQUE,
    contrasena     VARCHAR(255) NOT NULL,
    telefono       VARCHAR(20) NULL COMMENT 'WhatsApp con código de país, ej. 573001234567',
    creado_en      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuarios_email (email)
);

CREATE TABLE tareas (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id        INT NOT NULL,
    titulo            VARCHAR(200) NOT NULL,
    descripcion       TEXT NULL,
    fecha_vencimiento DATE NULL,
    prioridad         ENUM('BAJA', 'MEDIA', 'ALTA') NOT NULL DEFAULT 'MEDIA',
    estado            ENUM('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    orden             INT DEFAULT 0 COMMENT 'Orden dentro de la columna del tablero',
    etiquetas         JSON NULL COMMENT 'Tags/etiquetas como JSON array',
    creado_en         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tarea_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_tareas_usuario  (usuario_id),
    INDEX idx_tareas_estado   (estado),
    INDEX idx_tareas_prioridad (prioridad),
    INDEX idx_tareas_fecha_venc (fecha_vencimiento)
);
