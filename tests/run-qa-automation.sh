#!/bin/bash

# Script shell pour faciliter l'exécution du système d'analyse et de correction automatique

# Couleurs pour les messages
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

# Fonction d'affichage du menu
show_menu() {
    echo -e "${BLUE}=== Système d'Analyse et de Correction Automatique des UI ===${NC}"
    echo -e "${CYAN}1.${NC} Analyser les captures d'écran"
    echo -e "${CYAN}2.${NC} Appliquer les corrections automatiques"
    echo -e "${CYAN}3.${NC} Exécuter le workflow complet (analyse + corrections)"
    echo -e "${CYAN}4.${NC} Tester le système"
    echo -e "${CYAN}5.${NC} Afficher la documentation"
    echo -e "${CYAN}0.${NC} Quitter"
    echo -e "${YELLOW}Entrez votre choix [0-5]:${NC} "
}

# Fonction pour vérifier si Node.js est installé
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Erreur: Node.js n'est pas installé.${NC}"
        exit 1
    fi
}

# Fonction pour vérifier si les fichiers nécessaires existent
check_files() {
    local missing=0
    
    if [ ! -f "tests/screenshot-analyzer.js" ]; then
        echo -e "${RED}Erreur: Le fichier tests/screenshot-analyzer.js n'existe pas.${NC}"
        missing=1
    fi
    
    if [ ! -f "tests/auto-fix-ui.js" ]; then
        echo -e "${RED}Erreur: Le fichier tests/auto-fix-ui.js n'existe pas.${NC}"
        missing=1
    fi
    
    if [ ! -f "tests/qa-auto-fix-workflow.js" ]; then
        echo -e "${RED}Erreur: Le fichier tests/qa-auto-fix-workflow.js n'existe pas.${NC}"
        missing=1
    fi
    
    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Fonction pour analyser les captures d'écran
analyze_screenshots() {
    echo -e "${BLUE}=== Analyse des captures d'écran ===${NC}"
    node tests/screenshot-analyzer.js
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Analyse terminée avec succès.${NC}"
        echo -e "${YELLOW}Rapport disponible dans: tests/screenshot-analysis-report.md${NC}"
    else
        echo -e "${RED}Erreur lors de l'analyse des captures d'écran.${NC}"
    fi
}

# Fonction pour appliquer les corrections automatiques
apply_fixes() {
    echo -e "${BLUE}=== Application des corrections automatiques ===${NC}"
    node tests/auto-fix-ui.js
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Corrections appliquées avec succès.${NC}"
        echo -e "${YELLOW}Rapport disponible dans: tests/auto-fix-report.md${NC}"
    else
        echo -e "${RED}Erreur lors de l'application des corrections.${NC}"
    fi
}

# Fonction pour exécuter le workflow complet
run_workflow() {
    echo -e "${BLUE}=== Exécution du workflow complet ===${NC}"
    node tests/qa-auto-fix-workflow.js
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Workflow exécuté avec succès.${NC}"
        echo -e "${YELLOW}Rapport disponible dans: tests/qa-workflow-report.md${NC}"
    else
        echo -e "${RED}Erreur lors de l'exécution du workflow.${NC}"
    fi
}

# Fonction pour tester le système
run_tests() {
    echo -e "${BLUE}=== Test du système ===${NC}"
    node tests/test-qa-automation.js
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Tests terminés.${NC}"
    else
        echo -e "${RED}Erreur lors de l'exécution des tests.${NC}"
    fi
}

# Fonction pour afficher la documentation
show_docs() {
    if [ -f "tests/README-QA-AUTOMATION.md" ]; then
        if command -v less &> /dev/null; then
            less tests/README-QA-AUTOMATION.md
        else
            cat tests/README-QA-AUTOMATION.md
        fi
    else
        echo -e "${RED}Erreur: Le fichier de documentation n'existe pas.${NC}"
    fi
}

# Vérifications initiales
check_node
check_files

# Traitement des arguments en ligne de commande
if [ $# -gt 0 ]; then
    case "$1" in
        "analyze")
            analyze_screenshots
            exit 0
            ;;
        "fix")
            apply_fixes
            exit 0
            ;;
        "workflow")
            run_workflow
            exit 0
            ;;
        "test")
            run_tests
            exit 0
            ;;
        "docs")
            show_docs
            exit 0
            ;;
        *)
            echo -e "${RED}Option non reconnue: $1${NC}"
            echo -e "${YELLOW}Options disponibles: analyze, fix, workflow, test, docs${NC}"
            exit 1
            ;;
    esac
fi

# Menu interactif
while true; do
    show_menu
    read -r choice
    
    case $choice in
        1)
            analyze_screenshots
            ;;
        2)
            apply_fixes
            ;;
        3)
            run_workflow
            ;;
        4)
            run_tests
            ;;
        5)
            show_docs
            ;;
        0)
            echo -e "${GREEN}Au revoir!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Option non valide. Veuillez réessayer.${NC}"
            ;;
    esac
    
    echo
    echo -e "${YELLOW}Appuyez sur Entrée pour continuer...${NC}"
    read -r
    clear
done