#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FRONTEND_DIR = path.join(__dirname, 'src');
const OUTPUT_FILE = 'frontend-routes.json';

// Patterns pour détecter les appels API
const API_PATTERNS = [
  // fetch, axios, etc.
  {
    name: 'fetch',
    regex: /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g,
    type: 'fetch'
  },
  {
    name: 'axios',
    regex: /axios\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    type: 'axios'
  },
  // Services et hooks personnalisés
  {
    name: 'api service',
    regex: /['"`]([^'"`]*\/api\/[^'"`]*)['"`]/g,
    type: 'api_service'
  },
  // URLs dans les composants
  {
    name: 'url component',
    regex: /href\s*=\s*['"`]([^'"`]*\/api\/[^'"`]*)['"`]/g,
    type: 'href'
  },
  // Variables d'environnement
  {
    name: 'env url',
    regex: /process\.env\.(VITE_API_URL|REACT_APP_API_URL|NEXT_PUBLIC_API_URL)/g,
    type: 'env'
  }
];

// Fonction pour extraire les routes d'un fichier
function extractRoutesFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const routes = [];
    
    API_PATTERNS.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(content)) !== null) {
        let url = '';
        let method = 'GET';
        
        if (pattern.type === 'axios') {
          method = match[1].toUpperCase();
          url = match[2];
        } else if (pattern.type === 'fetch') {
          url = match[1];
        } else {
          url = match[1];
        }
        
        // Nettoyer l'URL
        if (url && !url.startsWith('http') && !url.startsWith('//')) {
          // Ajouter le protocole si manquant
          if (url.startsWith('/')) {
            url = `http://localhost:5000${url}`;
          }
          
          routes.push({
            method,
            url,
            type: pattern.type,
            file: path.basename(filePath),
            line: content.substring(0, match.index).split('\n').length
          });
        }
      }
    });
    
    return routes;
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filePath}:`, error.message);
    return [];
  }
}

// Fonction pour explorer récursivement un répertoire
function exploreDirectory(dirPath, fileExtensions = ['.js', '.ts', '.vue', '.jsx', '.tsx']) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...exploreDirectory(fullPath, fileExtensions));
      } else if (stat.isFile() && fileExtensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  } catch (error) {
    console.error(`Erreur lors de l'exploration de ${dirPath}:`, error.message);
  }
  
  return files;
}

// Fonction principale
function extractAllFrontendRoutes() {
  const allRoutes = [];
  
  try {
    // Explorer tous les fichiers frontend
    const frontendFiles = exploreDirectory(FRONTEND_DIR);
    
    console.log(`🔍 Exploration de ${frontendFiles.length} fichiers frontend...`);
    
    frontendFiles.forEach(filePath => {
      const routes = extractRoutesFromFile(filePath);
      allRoutes.push(...routes);
    });
    
    // Supprimer les doublons et nettoyer
    const uniqueRoutes = [];
    const seen = new Set();
    
    allRoutes.forEach(route => {
      const key = `${route.method}-${route.url}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRoutes.push(route);
      }
    });
    
    // Trier par méthode puis par URL
    uniqueRoutes.sort((a, b) => {
      if (a.method !== b.method) {
        return a.method.localeCompare(b.method);
      }
      return a.url.localeCompare(b.url);
    });
    
    // Sauvegarder dans un fichier JSON
    const output = {
      totalRoutes: uniqueRoutes.length,
      totalFiles: frontendFiles.length,
      routes: uniqueRoutes,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log(`✅ ${uniqueRoutes.length} routes frontend uniques extraites et sauvegardées dans ${OUTPUT_FILE}`);
    
    // Afficher un résumé
    const methodCounts = {};
    const typeCounts = {};
    
    uniqueRoutes.forEach(route => {
      methodCounts[route.method] = (methodCounts[route.method] || 0) + 1;
      typeCounts[route.type] = (typeCounts[route.type] || 0) + 1;
    });
    
    console.log('\n📊 Résumé par méthode HTTP:');
    Object.entries(methodCounts).forEach(([method, count]) => {
      console.log(`  ${method}: ${count} routes`);
    });
    
    console.log('\n📊 Résumé par type de détection:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} routes`);
    });
    
    return uniqueRoutes;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction des routes frontend:', error.message);
    return [];
  }
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  extractAllFrontendRoutes();
}

export { extractAllFrontendRoutes };
