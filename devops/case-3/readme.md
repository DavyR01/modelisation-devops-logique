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
