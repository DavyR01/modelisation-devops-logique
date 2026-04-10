
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