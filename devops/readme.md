## Case 1 — Debug WordPress + MySQL

1. Démarrage de la stack pour observer le comportement initial
```bash
   docker compose up -d
```
 
2. Vérification de l’état des conteneurs 
```bash
   docker compose ps -a  # Conteneurs créés mais non démarrés
```

3. Démarrage en mode interactif pour identifier l’erreur bloquante  
```bash
   docker compose up  # Erreur de bind : port MySQL 3306 déjà utilisé sur l’hôte
```

4. Première correction  
   - Suppression de l’exposition du port 3306 (inutile pour la communication interne Docker)

5. Analyse des logs MySQL  
```bash
   docker compose logs mysql  
```
   → Erreur : MYSQL_ROOT_PASSWORD manquant (obligatoire avec MySQL 8)

6. Seconde correction  
   - Ajout de MYSQL_ROOT_PASSWORD (on aurait pu faire un fichier .env)

7. Redémarrage propre pour réinitialiser la base  
```bash
   docker compose down -v  
   docker compose up -d
```

1. Validation finale  
```bash
   docker compose ps  
```

   Accès applicatif :
   - http://localhost:8080 (WordPress)
   - http://localhost:8081 (PhpMyAdmin)  

---
<br>
<br>


## Case 2 — Debug Nextcloud + PostgreSQL + Redis

1. Démarrage de la stack pour observer le comportement initial
```bash  
   docker compose up -d
```

2. Vérification de l’état des conteneurs  
```bash
   docker compose ps  # Tous les conteneurs sont démarrés
```

3. Analyse des logs Nextcloud  
```bash
   docker compose logs nextcloud # Nextcloud démarre correctement, pas de crash applicatif
```

4. Vérification de l’accès applicatif  
   Accès navigateur : http://localhost:8080  
   - Service accessible (interface Nextcloud affichée)

5. Analyse des logs PostgreSQL  
```bash
   docker compose logs postgres  
```
   - `database system is ready to accept connections`  
   - Base de données fonctionnelle

6. Vérification de Redis  
```bash
   docker compose exec redis redis-cli ping  
```
- `PONG` : Redis opérationnel et joignable

7. Diagnostic  
   - Redis présent mais non intégré à Nextcloud  
   - Absence de healthchecks  
   - Démarrage non fiabilisé (`depends_on` seul)

8. Corrections appliquées  
   - Ajout de `REDIS_HOST=redis` côté Nextcloud  
   - Ajout d’un healthcheck PostgreSQL (`pg_isready`)  
   - Ajout d’un healthcheck Redis (`redis-cli ping`)  
   - Nettoyage optionnel du champ `version` (Compose v2)

9.  Redémarrage propre pour validation  
```bash
   docker compose down -v  
   docker compose up -d
```

10.  Validation finale  
```bash
    docker compose ps  
    docker compose restart  
```

   Accès applicatif :  
   - http://localhost:8080 (Nextcloud)  
   - Connexion admin réussie  
   - Stack stable après redémarrage


---
<br>
<br>



## Case 3 — Debug Mattermost + PostgreSQL

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

11. Validation finale
```bash
    docker compose ps  
    curl -I http://localhost:8065
```

Accès applicatif :
- http://localhost:8065 (Mattermost)
- Création de compte utilisateur fonctionnelle



---
<br>
<br>



## Case 4 — Debug ELK (Elasticsearch + Logstash + Kibana + Filebeat)
## 1. Procédure de debug (pas à pas)

### 1.1 Démarrage de la stack pour observer le comportement initial
docker compose up -d  
docker compose ps  

- Elasticsearch, Kibana et Logstash démarrent
- Filebeat est instable (redémarrages)
- Aucun log visible dans Kibana

### 1.2 Analyse des logs Filebeat
docker compose logs -f filebeat  

- Erreur : `config file ("filebeat.yml") can only be writable by the owner`
- Indication claire d’un échec lié aux permissions

### 1.3 Identification de la cause racine
- Filebeat applique par défaut un contrôle strict des permissions (`strict.perms`)
- Le fichier `filebeat.yml` est monté depuis Windows avec des permissions trop ouvertes
- Filebeat refuse donc de démarrer et crash en boucle

### 1.4 Correction critique (Docker Compose)
- Modification du service `filebeat` :
  - exécution en tant que `root`
  - désactivation du contrôle strict des permissions

(user: root + `--strict.perms=false`)

### 1.5 Redémarrage ciblé de Filebeat
docker compose up -d --force-recreate filebeat  
docker compose logs -f filebeat  

- Filebeat démarre correctement
- Plus de crash-loop

### 1.6 Validation de l’ingestion côté Logstash
docker compose logs -f logstash  

- Connexion Filebeat → Logstash confirmée (port 5044)
- Réception d’événements Beats

### 1.7 Validation de l’indexation côté Elasticsearch
curl http://localhost:9200/_cat/indices?v  

- Présence d’index de type `filebeat-*`
- Confirmation que la chaîne d’ingestion fonctionne

### 1.8 Fiabilisation de l’ordre de démarrage
- Ajout d’un `healthcheck` sur Elasticsearch
- Passage des `depends_on` de Kibana, Logstash et Filebeat en  
  `condition: service_healthy`

Objectif :
- éviter les démarrages prématurés
- garantir que les services dépendants attendent Elasticsearch prêt

### 1.9 Redémarrage propre de la stack
docker compose down  
docker compose up -d  

### 1.10 Validation finale
docker compose ps  
curl -I http://localhost:5601  
curl http://localhost:9200  

Accès applicatif :
- http://localhost:5601 (Kibana)
- Logs visibles après création du Data View `filebeat-*` dans Discover

---

## 2. Résumé de résolution (synthèse)

### Identification
- ELK démarre partiellement
- Filebeat crash → aucun log visible dans Kibana

### Cause racine
- Filebeat refuse le fichier `filebeat.yml`
- Permissions trop ouvertes sur Windows (`strict.perms`)

### Correction critique
- Docker Compose :
  - exécution Filebeat en `root`
  - ajout de `--strict.perms=false`

### Validation ingestion
- Chaîne fonctionnelle :
  **Filebeat → Logstash → Elasticsearch → Kibana**
- Index visibles dans Elasticsearch et Kibana

### Fiabilisation
- Ajout d’un `healthcheck` sur Elasticsearch
- `depends_on: condition: service_healthy` pour Kibana, Logstash et Filebeat
