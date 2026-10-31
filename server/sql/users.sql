USE chill_db;

-- Bagian 1: tabel users
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  fullname    VARCHAR(100) NOT NULL,
  username    VARCHAR(30)  NOT NULL,
  email       VARCHAR(255) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bagian 2: kolom untuk verifikasi email (jalankan sekali saja)
ALTER TABLE users
  ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0 AFTER password,
  ADD COLUMN verification_token CHAR(36) NULL AFTER is_verified,
  ADD UNIQUE KEY uq_users_verification_token (verification_token);
