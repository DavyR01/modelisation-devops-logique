# Documentation technique – Modélisation des redevances

## 1. Objet
Ce document décrit la modélisation des données d’un système de calcul des redevances d’auteur dans le domaine de l’édition, selon la méthode **MERISE**, depuis le niveau conceptuel jusqu’à l’implémentation SQL.

---

## 2. Portée
Le modèle couvre :
- la gestion des auteurs, ouvrages et éditeurs,
- la répartition des droits par ouvrage,
- l’enregistrement des ventes mensuelles,
- la base de calcul des redevances.

---

## 3. Modèle Conceptuel de Données (MCD)

### 3.1 Entités métier
- **AUTEUR** : représente une personne percevant des droits.
- **EDITEUR** : représente une maison d’édition.
- **OUVRAGE** : représente un ouvrage publié.
- **VENTE_MENSUELLE** : représente les ventes d’un ouvrage sur une période donnée.

### 3.2 Associations
- **PUBLIE** (EDITEUR – OUVRAGE)  
  Relation 1–N : un éditeur publie plusieurs ouvrages ; un ouvrage est publié par un seul éditeur.
- **PARTICIPER** (AUTEUR – OUVRAGE)  
  Relation N–N porteuse d’attributs (rôle, pourcentage de droits, dates).
- **ENREGISTRER_VENTE** (OUVRAGE – VENTE_MENSUELLE)  
  Relation 1–N avec dépendance d’identification.

### 3.3 Contraintes métier
- Répartition des droits par pourcentage.
- Somme des pourcentages par ouvrage égale à 100 %.
- Une vente mensuelle est identifiée par un ouvrage, un mois et un canal.

---

## 3. Modèle logique de données (MLD)

### 3.1 Entités logiques
- **AUTEUR** : référentiel des auteurs.
- **EDITEUR** : référentiel des éditeurs.
- **OUVRAGE** : référentiel des ouvrages publiés.
- **VENTE_MENSUELLE** : données de ventes par période.
- **PARTICIPATION** : table d’association entre auteurs et ouvrages.

### 3.2 Relations
- **EDITEUR – OUVRAGE** : relation 1–N  
  Un éditeur publie plusieurs ouvrages ; un ouvrage dépend d’un seul éditeur.
- **AUTEUR – OUVRAGE** : relation N–N via `PARTICIPATION`  
  La table porte les informations de rôle et de pourcentage de droits.
- **OUVRAGE – VENTE_MENSUELLE** : relation 1–N avec dépendance d’identification  
  Une vente mensuelle est identifiée par (ouvrage, mois, canal).

### 3.3 Clés
- Clés primaires métier (ISBN, mois).
- Clés primaires composées pour les entités dépendantes.
- Clés étrangères assurant l’intégrité référentielle.

---

## 4. Contraintes d’intégrité
- Pourcentages de droits compris entre 0 et 100.
- Somme des pourcentages de participation par ouvrage égale à 100 %.
- Valeurs numériques positives pour les quantités et chiffres d’affaires.
- Unicité des ventes par (ouvrage, mois, canal).

---

## 5. Implémentation SQL
- Implémentation réalisée en **PostgreSQL**.
- Utilisation de :
  - `PRIMARY KEY`, `FOREIGN KEY`
  - contraintes `NOT NULL`, `UNIQUE`, `CHECK`
- Données d’exemple fournies pour validation fonctionnelle.

---

## 6. Conclusion
Le modèle est conforme aux règles de modélisation relationnelle et à la méthode MERISE.  
Il est cohérent, extensible et directement exploitable pour le calcul des redevances.
