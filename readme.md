## Exercice 1 — Debug WordPress + MySQL

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
