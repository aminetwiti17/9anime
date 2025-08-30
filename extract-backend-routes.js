#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKEND_ROUTES_DIR = path.join(__dirname, 'backend', 'src', 'routes');
const OUTPUT_FILE = 'backend-routes.json';

// Fonction pour extraire les routes d'un fichier
function extractRoutesFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const routes = [];
    
    // Regex pour capturer les routes
    const routeRegex = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    
    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      
      routes.push({
        method,
        path: routePath,
        fullPath: `/api/v1${routePath}`,
        file: path.basename(filePath)
      });
    }
    
    return routes;
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filePath}:`, error.message);
    return [];
  }
}

// Fonction principale
function extractAllBackendRoutes() {
  const allRoutes = [];
  
  try {
    const routeFiles = fs.readdirSync(BACKEND_ROUTES_DIR);
    
    routeFiles.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(BACKEND_ROUTES_DIR, file);
        const routes = extractRoutesFromFile(filePath);
        allRoutes.push(...routes);
      }
    });
    
    // Ajouter la route de documentation
    allRoutes.push({
      method: 'GET',
      path: '/api-docs',
      fullPath: '/api-docs',
      file: 'server.js'
    });
    
    // Trier par méthode puis par chemin
    allRoutes.sort((a, b) => {
      if (a.method !== b.method) {
        return a.method.localeCompare(b.method);
      }
      return a.path.localeCompare(b.path);
    });
    
    // Sauvegarder dans un fichier JSON
    const output = {
      totalRoutes: allRoutes.length,
      apiVersion: 'v1',
      baseUrl: '/api/v1',
      routes: allRoutes,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log(`✅ ${allRoutes.length} routes backend extraites et sauvegardées dans ${OUTPUT_FILE}`);
    
    // Afficher un résumé
    const methodCounts = {};
    allRoutes.forEach(route => {
      methodCounts[route.method] = (methodCounts[route.method] || 0) + 1;
    });
    
    console.log('\n📊 Résumé par méthode HTTP:');
    Object.entries(methodCounts).forEach(([method, count]) => {
      console.log(`  ${method}: ${count} routes`);
    });
    
    return allRoutes;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction des routes:', error.message);
    return [];
  }
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  extractAllBackendRoutes();
}

export { extractAllBackendRoutes };
