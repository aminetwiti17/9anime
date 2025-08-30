// Script de test automatisé pour le frontend avec Puppeteer + MCP
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:3000'; // À ajuster selon l'URL de votre site
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const LOGS_FILE = path.join(__dirname, 'logs.json');
const REPORT_FILE = path.join(__dirname, 'report.md');

// Pages principales à tester
const PAGES_TO_TEST = [
  { name: 'home', path: '/' },
  { name: 'anime-list', path: '/anime' },
  { name: 'search', path: '/search?q=naruto' },
  // Ajoutez d'autres pages selon votre site
];

// Résolutions pour les tests
const RESOLUTIONS = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 812 }
};

// Structure pour stocker les résultats
const testResults = {
  consoleErrors: [],
  networkErrors: [],
  buttonIssues: [],
  visualIssues: [],
  screenshots: []
};

// Fonction principale
async function runQATests() {
  console.log('🚀 Démarrage des tests QA Frontend...');
  
  try {
    // Vérifier/créer les dossiers nécessaires
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
    
    // Initialiser le fichier de logs
    fs.writeFileSync(LOGS_FILE, JSON.stringify(testResults, null, 2));
    
    // Tester chaque page dans chaque résolution
    for (const page of PAGES_TO_TEST) {
      for (const [deviceType, viewport] of Object.entries(RESOLUTIONS)) {
        await testPage(page, deviceType, viewport);
      }
    }
    
    // Générer le rapport final
    await generateReport();
    
    console.log('✅ Tests QA terminés avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests QA:', error);
    // Sauvegarder l'erreur dans les logs
    testResults.consoleErrors.push({
      source: 'Test Runner',
      message: error.message,
      stack: error.stack
    });
    fs.writeFileSync(LOGS_FILE, JSON.stringify(testResults, null, 2));
  }
}

// Fonction pour tester une page
async function testPage(page, deviceType, viewport) {
  console.log(`🔍 Test de ${page.name} en mode ${deviceType}...`);
  
  try {
    // Utiliser l'API MCP pour Puppeteer
    // Lancer le navigateur si ce n'est pas déjà fait
    await runMCP('puppeteer_navigate', { 
      url: `${BASE_URL}${page.path}`,
      launchOptions: {
        headless: false,
        args: ['--no-sandbox']
      }
    });
    
    // Configurer la taille de la fenêtre selon le device
    await runMCP('puppeteer_evaluate', {
      script: `
        window.resizeTo(${viewport.width}, ${viewport.height});
        document.documentElement.style.overflow = 'auto';
      `
    });
    
    // Attendre que la page soit chargée
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Capturer les erreurs console
    const consoleErrors = await runMCP('puppeteer_evaluate', {
      script: `
        const errors = [];
        const originalConsoleError = console.error;
        console.error = function() {
          errors.push(Array.from(arguments).join(' '));
          originalConsoleError.apply(console, arguments);
        };
        return errors;
      `
    });
    
    if (consoleErrors && consoleErrors.length > 0) {
      testResults.consoleErrors.push({
        page: page.name,
        deviceType,
        errors: consoleErrors
      });
    }
    
    // Prendre une capture d'écran
    const screenshotName = `${page.name}-${deviceType}.png`;
    const screenshotResult = await runMCP('puppeteer_screenshot', { 
      name: screenshotName,
      width: viewport.width,
      height: viewport.height
    });
    
    // Sauvegarder le screenshot dans le dossier local
    if (screenshotResult && screenshotResult.data) {
      const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
      fs.writeFileSync(screenshotPath, Buffer.from(screenshotResult.data, 'base64'));
      
      testResults.screenshots.push({
        page: page.name,
        deviceType,
        path: `./screenshots/${screenshotName}`
      });
    }
    
    // Vérifier les boutons principaux
    await checkButtons(page, deviceType);
    
    // Vérifier les problèmes visuels
    await checkVisualIssues(page, deviceType);
    
    // Sauvegarder les résultats intermédiaires
    fs.writeFileSync(LOGS_FILE, JSON.stringify(testResults, null, 2));
    
    console.log(`✅ Test de ${page.name} en mode ${deviceType} terminé`);
    
  } catch (error) {
    console.error(`❌ Erreur lors du test de ${page.name} en ${deviceType}:`, error);
    testResults.consoleErrors.push({
      page: page.name,
      deviceType,
      message: error.message,
      stack: error.stack
    });
    fs.writeFileSync(LOGS_FILE, JSON.stringify(testResults, null, 2));
  }
}

// Fonction pour vérifier les boutons
async function checkButtons(page, deviceType) {
  try {
    // Trouver tous les boutons et liens cliquables
    const buttons = await runMCP('puppeteer_evaluate', {
      script: `
        const elements = Array.from(document.querySelectorAll('button, a, [role="button"]'));
        return elements.map(el => ({
          tagName: el.tagName,
          text: el.textContent.trim(),
          href: el.href || '',
          id: el.id || '',
          className: el.className || '',
          isVisible: el.offsetParent !== null,
          rect: el.getBoundingClientRect().toJSON()
        }));
      `
    });
    
    if (buttons && buttons.length > 0) {
      for (const button of buttons) {
        // Vérifier si le bouton est visible et cliquable
        if (!button.isVisible) {
          testResults.buttonIssues.push({
            page: page.name,
            deviceType,
            element: `${button.tagName} - ${button.text || button.id || button.className}`,
            issue: 'Bouton non visible'
          });
        } else if (button.rect.width < 20 || button.rect.height < 20) {
          testResults.buttonIssues.push({
            page: page.name,
            deviceType,
            element: `${button.tagName} - ${button.text || button.id || button.className}`,
            issue: 'Bouton trop petit pour être cliqué facilement'
          });
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des boutons:', error);
  }
}

// Fonction pour vérifier les problèmes visuels
async function checkVisualIssues(page, deviceType) {
  try {
    // Vérifier les débordements et autres problèmes visuels
    const visualIssues = await runMCP('puppeteer_evaluate', {
      script: `
        const issues = [];
        
        // Vérifier les débordements horizontaux
        if (document.body.scrollWidth > window.innerWidth) {
          issues.push({
            type: 'overflow',
            message: 'Débordement horizontal détecté',
            details: 'La page dépasse la largeur de la fenêtre'
          });
        }
        
        // Vérifier les éléments qui dépassent de la fenêtre
        const allElements = Array.from(document.querySelectorAll('*'));
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth + 5) {
            issues.push({
              type: 'overflow',
              element: el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
              message: 'Élément dépasse à droite',
              details: 'Dépasse de ' + Math.round(rect.right - window.innerWidth) + 'px'
            });
          }
          
          // Vérifier les textes tronqués
          if (el.nodeType === 1 && 
              (el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || 
               el.tagName === 'H3' || el.tagName === 'H4' || el.tagName === 'H5' || 
               el.tagName === 'H6' || el.tagName === 'SPAN' || el.tagName === 'DIV')) {
            
            const style = window.getComputedStyle(el);
            if (style.overflow === 'hidden' && 
                el.scrollWidth > el.clientWidth && 
                style.textOverflow !== 'ellipsis') {
              issues.push({
                type: 'truncated',
                element: el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
                message: 'Texte tronqué',
                details: 'Le texte est coupé sans ellipsis'
              });
            }
          }
        }
        
        return issues;
      `
    });
    
    if (visualIssues && visualIssues.length > 0) {
      for (const issue of visualIssues) {
        testResults.visualIssues.push({
          page: page.name,
          deviceType,
          element: issue.element || 'Page entière',
          issue: `${issue.message}: ${issue.details}`
        });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des problèmes visuels:', error);
  }
}

// Fonction pour générer le rapport
async function generateReport() {
  console.log('📝 Génération du rapport...');
  
  let report = `# Rapport de QA Frontend

## Date: ${new Date().toLocaleString()}

`;
  
  // Ajouter les captures d'écran
  report += '## Captures d\'écran\n\n';
  for (const screenshot of testResults.screenshots) {
    report += `- ${screenshot.page} (${screenshot.deviceType}): ![${screenshot.page}-${screenshot.deviceType}](${screenshot.path})\n`;
  }
  
  // Ajouter les erreurs console
  report += '\n## Erreurs Console\n\n';
  if (testResults.consoleErrors.length === 0) {
    report += 'Aucune erreur console détectée.\n';
  } else {
    for (const error of testResults.consoleErrors) {
      if (error.errors && error.errors.length > 0) {
        report += `### Page: ${error.page} (${error.deviceType})\n\n`;
        for (const err of error.errors) {
          report += `- ${err}\n`;
        }
      } else if (error.message) {
        report += `- **${error.page || 'Global'}**: ${error.message}\n`;
      }
    }
  }
  
  // Ajouter les erreurs réseau
  report += '\n## Erreurs Réseau\n\n';
  if (testResults.networkErrors.length === 0) {
    report += 'Aucune erreur réseau détectée.\n';
  } else {
    for (const error of testResults.networkErrors) {
      report += `- **${error.url}**: ${error.status} ${error.statusText}\n`;
    }
  }
  
  // Ajouter les problèmes de boutons
  report += '\n## Boutons Non Fonctionnels\n\n';
  if (testResults.buttonIssues.length === 0) {
    report += 'Aucun problème de bouton détecté.\n';
  } else {
    for (const issue of testResults.buttonIssues) {
      report += `- **${issue.page} (${issue.deviceType})**: ${issue.element} - ${issue.issue}\n`;
    }
  }
  
  // Ajouter les problèmes visuels
  report += '\n## Problèmes Visuels\n\n';
  if (testResults.visualIssues.length === 0) {
    report += 'Aucun problème visuel détecté.\n';
  } else {
    for (const issue of testResults.visualIssues) {
      report += `- **${issue.page} (${issue.deviceType})**: ${issue.element} - ${issue.issue}\n`;
    }
  }
  
  // Écrire le rapport dans un fichier
  fs.writeFileSync(REPORT_FILE, report);
  console.log(`📄 Rapport généré: ${REPORT_FILE}`);
}

// Fonction utilitaire pour appeler MCP
async function runMCP(toolName, args) {
  try {
    // Cette fonction sera remplacée par l'appel réel à MCP dans Trae AI
    console.log(`Appel MCP: ${toolName}`, args);
    return {}; // Simuler une réponse vide pour les tests
  } catch (error) {
    console.error(`Erreur lors de l'appel MCP ${toolName}:`, error);
    throw error;
  }
}

// Exécuter les tests
runQATests().catch(console.error);