## Case 3 — Debug Mattermost + PostgreSQL

### 🧠 Contexte
Mattermost démarre mais la création de compte échoue avec une erreur de connexion à la base de données.

---

## 🛠️ Démarche de résolution

1. Démarrage de la stack pour observer le comportement initial
```bash
docker compose up -d
```

2. Analyse des logs applicatifs
```bash
docker compose logs -f mattermost postgres
```
- Mattermost affiche uniquement l’aide CLI, le serveur ne démarre pas.

3. Première correction
- Ajout de `command: ["mattermost", "server"]`  
  (le binaire Mattermost est multi-commandes, le serveur n’est pas lancé par défaut)

4. Redémarrage du service Mattermost
```bash
docker compose up -d --force-recreate mattermost
docker compose logs -f mattermost
```

5. Nouvelle erreur bloquante identifiée dans les logs
```bash
docker compose logs -f mattermost
```
- Erreur : `pq: SSL is not enabled on the server`

6. Seconde correction
- Ajout de `sslmode=disable` dans `MM_SQLSETTINGS_DATASOURCE`  
  (PostgreSQL n’est pas configuré en SSL par défaut)

7. Redémarrage du service Mattermost
```bash
docker compose up -d --force-recreate mattermost
```

8. Nouvelle erreur bloquante
```bash
docker compose logs -f mattermost
```
- Erreur : version PostgreSQL insuffisante (13 détectée, 14 requise)

9. Troisième correction
- Mise à jour de l’image PostgreSQL vers `postgres:14`

10. Redémarrage propre avec recréation du volume
```bash
docker compose down -v
docker compose up -d
```

11. Validation technique
```bash
docker compose ps
curl -I http://localhost:8065
```

---

## ⚠️ Blocage fonctionnel

- Message : "Contact your workspace admin"
- Impossible de créer un compte utilisateur

**Cause :**
- Inscription désactivée par défaut dans Mattermost

**Correction :**
- Ajout de `MM_TEAMSETTINGS_ENABLEOPENSERVER=true`

**Redémarrage :**
```bash
docker compose down
docker compose up -d
```

---

## 🔐 Sécurisation de la configuration

- Externalisation des variables sensibles dans un fichier `.env`
- Suppression des valeurs en dur dans le `docker-compose.yml`

---

## ✅ Validation finale

- Accès à l’interface : http://localhost:8065
- Création de compte utilisateur réussie
- Connexion à la base fonctionnelle

---

## 🔧 Troubleshooting

### 🔍 Logs
```bash
docker compose logs -f mattermost
docker compose logs -f postgres
docker compose logs --tail=100 mattermost
```

### 📦 État des services
```bash
docker compose ps
docker compose top
docker stats
```

### 🌐 Connectivité entre services
```bash
docker compose exec mattermost ping postgres
```

### 🐚 Accès à un conteneur
```bash
docker compose exec mattermost /bin/bash
docker compose exec postgres /bin/bash
```

### 🗄️ Vérifier la base de données
```bash
docker compose exec postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
```

### 🧹 Nettoyage environnement
```bash
docker compose down -v
docker system prune -a
```

---

## 🎯 Résultat

- Mattermost démarre correctement  
- Connexion PostgreSQL fonctionnelle  
- Création de compte utilisateur validée  
- Configuration sécurisée via variables d’environnement  

Stack fonctionnelle et prête à l’usage.
