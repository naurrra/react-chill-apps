CREATE DATABASE IF NOT EXISTS chill_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chill_db;

CREATE TABLE IF NOT EXISTS movies (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title        VARCHAR(150)  NOT NULL,
  genre        VARCHAR(50)   NOT NULL,
  rating       DECIMAL(3,1)  NULL,
  release_year SMALLINT UNSIGNED NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_movies_rating CHECK (rating IS NULL OR (rating >= 0 AND rating <= 10))
);

INSERT INTO movies (title, genre, rating, release_year) VALUES
  ('Suzume',              'Anime',       9.2, 2022),
  ('Jurassic World',      'Petualangan', 9.0, 2015),
  ('Sonic 2',             'Komedi',      8.9, 2022),
  ('All Of Us Are Dead',  'Thriller',    8.7, 2022),
  ('Big Hero 6',          'Anak-anak',   8.7, 2014);