#!/bin/bash

# Script de démarrage pour AniStream avec MongoDB
# Usage: ./start-mongodb.sh

echo "🚀 Démarrage d'AniStream avec MongoDB..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

print_status "Vérification des prérequis..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

print_success "Tous les prérequis sont satisfaits!"

# Aller dans le répertoire backend
cd backend

print_status "Démarrage des services Docker..."

# Démarrer les services Docker
if docker-compose up -d; then
    print_success "Services Docker démarrés avec succès!"
else
    print_error "Échec du démarrage des services Docker"
    exit 1
fi

# Attendre que MongoDB soit prêt
print_status "Attente que MongoDB soit prêt..."
sleep 10

# Vérifier la connexion MongoDB
print_status "Test de la connexion MongoDB..."
if node test-mongodb.js; then
    print_success "Connexion MongoDB réussie!"
else
    print_error "Échec de la connexion MongoDB"
    print_warning "Vérifiez que MongoDB est bien démarré et accessible"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances backend..."
    npm install
    print_success "Dépendances backend installées!"
fi

# Exécuter les migrations
print_status "Exécution des migrations MongoDB..."
if npm run migrate; then
    print_success "Migrations MongoDB terminées!"
else
    print_error "Échec des migrations MongoDB"
    exit 1
fi

# Exécuter les seeds
print_status "Exécution des seeds..."
if npm run seed; then
    print_success "Seeds terminés!"
else
    print_error "Échec des seeds"
    exit 1
fi

# Démarrer le serveur backend
print_status "Démarrage du serveur backend..."
npm run dev &
BACKEND_PID=$!

# Attendre que le backend soit prêt
sleep 5

# Aller dans le répertoire racine pour le frontend
cd ..

# Installer les dépendances frontend si nécessaire
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances frontend..."
    npm install
    print_success "Dépendances frontend installées!"
fi

# Démarrer le serveur frontend
print_status "Démarrage du serveur frontend..."
npm run dev &
FRONTEND_PID=$!

print_success "🎉 AniStream démarré avec succès!"
echo ""
echo "📊 Services démarrés:"
echo "   - MongoDB: http://localhost:27017"
echo "   - MongoDB Express: http://localhost:8080"
echo "   - Redis: localhost:6379"
echo "   - Redis Commander: http://localhost:8081"
echo "   - Backend API: http://localhost:5000"
echo "   - Frontend: http://localhost:5173"
echo ""
echo "📚 Documentation API: http://localhost:5000/api-docs"
echo "🏥 Health Check: http://localhost:5000/health"
echo ""
echo "🛑 Pour arrêter les services, appuyez sur Ctrl+C"

# Fonction de nettoyage
cleanup() {
    print_status "Arrêt des services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_success "Services arrêtés!"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre que les processus se terminent
wait 