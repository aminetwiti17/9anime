# 🗄️ Guide de Migration vers MongoDB

Ce guide vous accompagne dans la migration de votre projet AniStream vers MongoDB (en supprimant PostgreSQL et Supabase).

## 📋 Prérequis

- Docker et Docker Compose installés
- Node.js 18+ installé
- Git installé

## 🚀 Migration Rapide

### 1. Arrêter les anciens services inutiles
```bash
docker-compose down
```

### 2. Démarrer avec MongoDB
```bash
./start-mongodb.sh
```

## 🔧 Migration Manuelle

### Étape 1: Configuration Docker

1. **Vérifiez que docker-compose.yml ne contient plus aucun service PostgreSQL ou Supabase**

### Étape 2: Configuration Backend

1. **Vérifiez que le backend n'utilise plus aucun code ou dépendance PostgreSQL/Supabase**

### Étape 3: Variables d'environnement

1. **Vérifiez que .env ne contient plus de DATABASE_URL PostgreSQL**

### Étape 4: Démarrer les services

1. **Démarrer MongoDB et Redis**
```bash
docker-compose up -d
```

2. **Tester la connexion**
```bash
node test-mongodb.js
```

3. **Exécuter les migrations**
```bash
npm run migrate
```

4. **Exécuter les seeds**
```bash
npm run seed
```

5. **Démarrer le serveur**
```bash
npm run dev
```

## 📊 Différences MongoDB vs SQL

| MongoDB | SQL |
|---------|-----|
| Collections | Tables |
| Documents | Rows |
| Fields | Columns |
| _id | Primary Key |
| populate | Joins |

## 🔍 Vérification de la Migration

### 1. Test de connexion
```bash
cd backend
node test-mongodb.js
```

### 2. Vérifier les collections
```bash
mongosh
show collections
db.anime.find().limit(5)
```

### 3. Tester l'API
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/v1/anime
```

## 🛠️ Outils d'administration

- MongoDB Express : http://localhost:8080
- Redis Commander : http://localhost:8081
- API Documentation : http://localhost:5000/api-docs

## 📈 Avantages de MongoDB

- Schéma flexible
- Indexation automatique
- Scalabilité horizontale
- Requêtes JSON natives

## 🔧 Dépannage

- Vérifiez que MongoDB est bien démarré
- Vérifiez la configuration dans `.env`
- Consultez la documentation MongoDB

---

**🎉 Félicitations !** Votre projet AniStream utilise maintenant MongoDB uniquement ! 