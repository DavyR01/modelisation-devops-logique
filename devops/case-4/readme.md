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
