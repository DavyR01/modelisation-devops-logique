## Case 2 — Debug Nextcloud + PostgreSQL + Redis

### 🎯 Objectif
Déployer une stack Nextcloud fonctionnelle avec PostgreSQL et Redis, en identifiant et corrigeant les problèmes de configuration.

---

## 🔍 Étapes de debugging

### 1. Démarrage de la stack
```bash
docker compose up -d
```

---

### 2. Vérification de l’état des conteneurs
```bash
docker compose ps
```
→ Tous les conteneurs sont démarrés

---

### 3. Analyse des logs Nextcloud
```bash
docker compose logs nextcloud
```
→ Nextcloud démarre correctement, pas de crash applicatif

---

### 4. Vérification de l’accès applicatif
Accès navigateur : http://localhost:8080  
→ Interface Nextcloud accessible

---

### 5. Analyse des logs PostgreSQL
```bash
docker compose logs postgres
```

→ `database system is ready to accept connections`  
→ Base de données fonctionnelle

---

### 6. Vérification de Redis
```bash
docker compose exec redis redis-cli ping
```

→ `PONG` : Redis opérationnel et joignable

---

## 🧠 Diagnostic

- Redis présent mais non utilisé par Nextcloud  
- Absence de healthchecks  
- Démarrage non fiabilisé (`depends_on` seul)  
- Variables d’environnement non structurées  
- Absence de bonnes pratiques (réseau, restart policy)

---

## 🛠️ Corrections apportées

### 🔹 Intégration Redis
- Ajout de `REDIS_HOST=redis` dans Nextcloud

### 🔹 Healthchecks
- PostgreSQL : `pg_isready`
- Redis : `redis-cli ping`
- Nextcloud : vérification HTTP via `status.php`

### 🔹 Variables d’environnement
- Externalisation dans un `.env`
- Séparation entre variables PostgreSQL et Nextcloud

### 🔹 Réseau Docker
- Ajout d’un réseau dédié `nextcloud_network`

### 🔹 Restart policy
- Ajout de `restart: unless-stopped` sur tous les services

### 🔹 Nettoyage
- Suppression du champ `version` obsolète

---

## 🔁 Redémarrage propre

```bash
docker compose down -v
docker compose up -d
```

---

## ✅ Validation finale

```bash
docker compose ps
docker compose restart
```

### Vérifications
- Nextcloud accessible : http://localhost:8080  
- Connexion admin réussie  
- PostgreSQL en `healthy`  
- Redis en `healthy`  
- Nextcloud fonctionnel  
- Stack stable après redémarrage

---

## 🔐 Gestion des variables d’environnement

Un fichier `.env` est utilisé pour stocker les variables sensibles.

Exemple fourni dans `.env.example` :

```bash
POSTGRES_DB=nextcloud
POSTGRES_USER=nextcloud
POSTGRES_PASSWORD=change_me

NEXTCLOUD_DB_NAME=nextcloud
NEXTCLOUD_DB_USER=nextcloud
NEXTCLOUD_DB_PASSWORD=change_me
NEXTCLOUD_DB_HOST=postgres
```

---

## 🌐 Accès réseau

Nextcloud est exposé via :
```bash
8080:80
```

→ Accessible depuis la machine locale et le réseau local  
→ Comportement adapté à un environnement de développement

---

## 📌 Remarques

- `depends_on` ne garantit pas la disponibilité applicative des services  
- Les healthchecks permettent de vérifier l’état réel des services  
- Les restart policies améliorent la résilience de la stack  
- En production, un reverse proxy et des règles de sécurité seraient nécessaires

---

## 🧠 Conclusion

Le problème provenait principalement d’une configuration incomplète plutôt que d’un dysfonctionnement des services.

Les corrections ont permis :
- d’assurer la communication entre services  
- de fiabiliser le démarrage  
- d’améliorer la maintenabilité et la lisibilité  

La stack est désormais fonctionnelle, stable et conforme aux bonnes pratiques attendues.
