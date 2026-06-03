CREATE DATABASE Tutores_db

USE Tutores_db
CREATE TABLE usuarios (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(100) NOT NULL UNIQUE,
    contrasena     VARCHAR(255) NOT NULL,
    rol            ENUM('STUDENT', 'TUTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    telefono       VARCHAR(20) NULL COMMENT 'WhatsApp con código de país, ej. 573001234567',
    creado_en      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE materias (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    descripcion    TEXT NULL,
    creado_en      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tutor_materias (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id       INT NOT NULL,
    materia_id     INT NOT NULL,
    precio_hora    DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    creado_en      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tm_tutor    FOREIGN KEY (tutor_id)   REFERENCES usuarios(id)  ON DELETE CASCADE,
    CONSTRAINT fk_tm_materia  FOREIGN KEY (materia_id) REFERENCES materias(id)  ON DELETE CASCADE,
    CONSTRAINT uq_tutor_materia UNIQUE (tutor_id, materia_id)
);

CREATE TABLE sesiones (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id   INT NOT NULL,
    tutor_id        INT NOT NULL,
    materia_id      INT NOT NULL,
    programado_en   DATETIME NOT NULL,
    notas           TEXT NULL,
    estado          ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    creado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ses_estudiante FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_ses_tutor      FOREIGN KEY (tutor_id)      REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_ses_materia    FOREIGN KEY (materia_id)    REFERENCES materias(id) ON DELETE RESTRICT
);