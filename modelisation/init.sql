DROP TABLE IF EXISTS vente_mensuelle CASCADE;
DROP TABLE IF EXISTS participation CASCADE;
DROP TABLE IF EXISTS ouvrage CASCADE;
DROP TABLE IF EXISTS editeur CASCADE;
DROP TABLE IF EXISTS auteur CASCADE;

CREATE TABLE auteur (
  id_auteur INTEGER PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE editeur (
  id_editeur INTEGER PRIMARY KEY,
  nom_editeur VARCHAR(200) NOT NULL UNIQUE,
  adresse VARCHAR(300)
);

CREATE TABLE ouvrage (
  isbn VARCHAR(17) PRIMARY KEY,
  titre VARCHAR(250) NOT NULL,
  date_parution DATE,
  type_ouvrage VARCHAR(50) NOT NULL,
  taux_redevance NUMERIC(5,2) NOT NULL
    CHECK (taux_redevance BETWEEN 0 AND 100),
  id_editeur INTEGER NOT NULL
    REFERENCES editeur(id_editeur)
);

CREATE TABLE participation (
  isbn VARCHAR(17) NOT NULL
    REFERENCES ouvrage(isbn)
    ON DELETE CASCADE,
  id_auteur INTEGER NOT NULL
    REFERENCES auteur(id_auteur),
  role VARCHAR(30) NOT NULL,
  pourcentage_droits NUMERIC(5,2) NOT NULL
    CHECK (pourcentage_droits BETWEEN 0 AND 100),
  date_debut DATE,
  date_fin DATE,
  PRIMARY KEY (isbn, id_auteur, role),
  CHECK (date_fin IS NULL OR date_debut IS NULL OR date_fin >= date_debut)
);

CREATE TABLE vente_mensuelle (
  isbn VARCHAR(17) NOT NULL
    REFERENCES ouvrage(isbn)
    ON DELETE CASCADE,
  mois DATE NOT NULL,
  canal VARCHAR(30) NOT NULL DEFAULT 'GLOBAL',
  quantite INTEGER NOT NULL CHECK (quantite >= 0),
  chiffre_affaires NUMERIC(14,2) NOT NULL CHECK (chiffre_affaires >= 0),
  PRIMARY KEY (isbn, mois, canal),
  CHECK (EXTRACT(DAY FROM mois) = 1)
);

CREATE OR REPLACE FUNCTION check_somme_participation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  total NUMERIC(10,2);
BEGIN
  SELECT COALESCE(SUM(pourcentage_droits), 0)
  INTO total
  FROM participation
  WHERE isbn = COALESCE(NEW.isbn, OLD.isbn);

  IF total <> 100 THEN
    RAISE EXCEPTION 'Somme des pourcentages invalide (%)', total;
  END IF;

  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER trg_participation_100
AFTER INSERT OR UPDATE OR DELETE ON participation
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION check_somme_participation();

INSERT INTO auteur VALUES
  (101, 'Durand', 'Alice', 'alice.durand@example.com'),
  (102, 'Martin', 'Bob', 'bob.martin@example.com'),
  (103, 'Nguyen', 'Chloe', 'chloe.nguyen@example.com');

INSERT INTO editeur VALUES
  (10, 'Editions Atlas', 'Paris'),
  (20, 'Nouvelles Plumes', 'Lyon');

INSERT INTO ouvrage VALUES
  ('978-2-1234-5678-9', 'Modeliser sans douleur', '2025-09-15', 'manuel', 8.00, 10),
  ('978-2-9876-5432-1', 'SQL et Redevances', '2024-03-01', 'essai', 10.00, 20);

BEGIN;

INSERT INTO participation VALUES
  ('978-2-1234-5678-9', 101, 'auteur', 60.00, '2025-09-15', NULL),
  ('978-2-1234-5678-9', 102, 'auteur', 40.00, '2025-09-15', NULL),
  ('978-2-9876-5432-1', 103, 'auteur', 70.00, '2024-03-01', NULL),
  ('978-2-9876-5432-1', 101, 'auteur', 30.00, '2024-03-01', NULL);

COMMIT;

INSERT INTO vente_mensuelle VALUES
  ('978-2-1234-5678-9', '2026-01-01', 'GLOBAL', 500, 12500.00),
  ('978-2-1234-5678-9', '2026-02-01', 'GLOBAL', 300, 7500.00),
  ('978-2-9876-5432-1', '2026-01-01', 'GLOBAL', 200, 6000.00);
