#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractAllBackendRoutes } from './extract-backend-routes.js';
import { extractAllFrontendRoutes } from './extract-frontend-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKEND_ROUTES_FILE = 'backend-routes.json';
const FRONTEND_ROUTES_FILE = 'frontend-routes.json';
const REPORT_FILE = 'routes-report.md';

// Fonction pour normaliser une URL pour la comparaison
function normalizeUrl(url) {
  // Supprimer le protocole et le domaine
  let normalized = url.replace(/^https?:\/\/[^\/]+/, '');
  
  // Supprimer les paramètres de requête
  normalized = normalized.split('?')[0];
  
  // Supprimer les fragments
  normalized = normalized.split('#')[0];
  
  // Normaliser les slashes
  normalized = normalized.replace(/\/+/g, '/');
  
  // Supprimer le slash final
  if (normalized.endsWith('/') && normalized !== '/') {
    normalized = normalized.slice(0, -1);
  }
  
  return normalized;
}

// Fonction pour analyser les incohérences
function analyzeInconsistencies(backendRoutes, frontendRoutes) {
  const analysis = {
    missingInBackend: [],
    missingInFrontend: [],
    methodMismatches: [],
    parameterMismatches: [],
    duplicates: [],
    summary: {
      totalBackend: backendRoutes.length,
      totalFrontend: frontendRoutes.length,
      missingInBackend: 0,
      missingInFrontend: 0,
      methodMismatches: 0,
      parameterMismatches: 0,
      duplicates: 0
    }
  };
  
  // Créer un index des routes backend pour une recherche rapide
  const backendIndex = new Map();
  backendRoutes.forEach(route => {
    const key = `${route.method}:${normalizeUrl(route.fullPath)}`;
    backendIndex.set(key, route);
  });
  
  // Analyser chaque route frontend
  const processedFrontend = new Set();
  
  frontendRoutes.forEach(frontendRoute => {
    const normalizedUrl = normalizeUrl(frontendRoute.url);
    const key = `${frontendRoute.method}:${normalizedUrl}`;
    
    // Vérifier les doublons
    if (processedFrontend.has(key)) {
      analysis.duplicates.push({
        route: frontendRoute,
        reason: 'Route dupliquée dans le frontend'
      });
      analysis.summary.duplicates++;
      return;
    }
    processedFrontend.add(key);
    
    // Vérifier si la route existe dans le backend
    const backendRoute = backendIndex.get(key);
    
    if (!backendRoute) {
      // Vérifier si c'est un problème de méthode
      const urlExists = Array.from(backendIndex.keys()).some(backendKey => 
        backendKey.endsWith(`:${normalizedUrl}`)
      );
      
      if (urlExists) {
        analysis.methodMismatches.push({
          frontend: frontendRoute,
          reason: 'Méthode HTTP incorrecte',
          availableMethods: Array.from(backendIndex.keys())
            .filter(backendKey => backendKey.endsWith(`:${normalizedUrl}`))
            .map(key => key.split(':')[0])
        });
        analysis.summary.methodMismatches++;
      } else {
        analysis.missingInBackend.push({
          route: frontendRoute,
          reason: 'Route inexistante dans le backend'
        });
        analysis.summary.missingInBackend++;
      }
    }
  });
  
  // Identifier les routes backend non utilisées
  const usedBackendRoutes = new Set();
  frontendRoutes.forEach(frontendRoute => {
    const normalizedUrl = normalizeUrl(frontendRoute.url);
    const key = `${frontendRoute.method}:${normalizedUrl}`;
    usedBackendRoutes.add(key);
  });
  
  backendRoutes.forEach(backendRoute => {
    const key = `${backendRoute.method}:${normalizeUrl(backendRoute.fullPath)}`;
    if (!usedBackendRoutes.has(key)) {
      analysis.missingInFrontend.push({
        route: backendRoute,
        reason: 'Route non utilisée par le frontend'
      });
      analysis.summary.missingInFrontend++;
    }
  });
  
  return analysis;
}

// Fonction pour générer le rapport
function generateReport(analysis) {
  const report = `# Rapport d'Analyse des Routes Frontend vs Backend

## 📊 Résumé Général

- **Routes Backend totales**: ${analysis.summary.totalBackend}
- **Routes Frontend totales**: ${analysis.summary.totalFrontend}
- **Routes manquantes dans le backend**: ${analysis.summary.missingInBackend}
- **Routes manquantes dans le frontend**: ${analysis.summary.missingInFrontend}
- **Incohérences de méthode HTTP**: ${analysis.summary.methodMismatches}
- **Routes dupliquées**: ${analysis.summary.duplicates}

## 🚨 Problèmes Détectés

### 1. Routes Frontend Inexistantes dans le Backend (${analysis.summary.missingInBackend})

${analysis.missingInBackend.map(issue => `
**${issue.route.method} ${issue.route.url}**
- Fichier: \`${issue.route.file}\` (ligne ${issue.route.line})
- Type: ${issue.route.type}
- Raison: ${issue.reason}
`).join('\n')}

### 2. Incohérences de Méthode HTTP (${analysis.summary.methodMismatches})

${analysis.methodMismatches.map(issue => `
**${issue.frontend.method} ${issue.frontend.url}**
- Fichier: \`${issue.frontend.file}\` (ligne ${issue.frontend.line})
- Méthodes disponibles: ${issue.availableMethods.join(', ')}
- Raison: ${issue.reason}
`).join('\n')}

### 3. Routes Dupliquées (${analysis.summary.duplicates})

${analysis.duplicates.map(issue => `
**${issue.route.method} ${issue.route.url}**
- Fichier: \`${issue.route.file}\` (ligne ${issue.route.line})
- Raison: ${issue.reason}
`).join('\n')}

### 4. Routes Backend Non Utilisées (${analysis.summary.missingInFrontend})

${analysis.missingInFrontend.map(issue => `
**${issue.route.method} ${issue.route.fullPath}**
- Fichier: \`${issue.route.file}\`
- Raison: ${issue.reason}
`).join('\n')}

## 🔧 Recommandations de Correction

### Priorité 1: Erreurs Critiques
1. **Corriger les routes inexistantes**: Modifier le frontend pour utiliser des routes backend valides
2. **Corriger les méthodes HTTP**: Aligner les méthodes frontend avec celles du backend
3. **Supprimer les doublons**: Nettoyer les appels API redondants

### Priorité 2: Optimisations
1. **Utiliser les routes backend disponibles**: Implémenter les fonctionnalités manquantes
2. **Standardiser les appels API**: Créer des services API cohérents
3. **Ajouter la gestion d'erreurs**: Implémenter try/catch et gestion d'erreurs

## 📅 Date de Génération

${new Date().toLocaleString('fr-FR')}

---

*Ce rapport a été généré automatiquement par le script d'analyse des routes.*
`;

  fs.writeFileSync(REPORT_FILE, report);
  console.log(`📝 Rapport généré et sauvegardé dans ${REPORT_FILE}`);
  
  return report;
}

// Fonction principale
async function main() {
  try {
    console.log('🚀 Démarrage de l\'analyse des routes...\n');
    
    // Étape 1: Extraire les routes backend
    console.log('📋 Étape 1: Extraction des routes backend...');
    const backendRoutes = await extractAllBackendRoutes();
    
    // Étape 2: Extraire les routes frontend
    console.log('\n📋 Étape 2: Extraction des routes frontend...');
    const frontendRoutes = await extractAllFrontendRoutes();
    
    // Étape 3: Analyser les incohérences
    console.log('\n📋 Étape 3: Analyse des incohérences...');
    const analysis = analyzeInconsistencies(backendRoutes, frontendRoutes);
    
    // Étape 4: Générer le rapport
    console.log('\n📋 Étape 4: Génération du rapport...');
    generateReport(analysis);
    
    // Affichage du résumé
    console.log('\n🎯 RÉSUMÉ DE L\'ANALYSE');
    console.log('========================');
    console.log(`✅ Routes backend: ${analysis.summary.totalBackend}`);
    console.log(`✅ Routes frontend: ${analysis.summary.totalFrontend}`);
    console.log(`❌ Routes manquantes dans le backend: ${analysis.summary.missingInBackend}`);
    console.log(`❌ Routes manquantes dans le frontend: ${analysis.summary.missingInFrontend}`);
    console.log(`⚠️  Incohérences de méthode: ${analysis.summary.methodMismatches}`);
    console.log(`⚠️  Routes dupliquées: ${analysis.summary.duplicates}`);
    
    if (analysis.summary.missingInBackend > 0 || analysis.summary.methodMismatches > 0) {
      console.log('\n🚨 ATTENTION: Des corrections sont nécessaires dans le frontend !');
    } else {
      console.log('\n🎉 Aucune correction critique nécessaire !');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, analyzeInconsistencies, generateReport };
