// Script complet de test QA Frontend avec Trae AI MCP
const fs = require('fs').promises;
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000'; // À ajuster selon l'URL de votre site
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const LOGS_FILE = path.join(__dirname, 'logs.json');
const REPORT_FILE = path.join(__dirname, 'report.md');

// Pages principales à tester
const PAGES_TO_TEST = [
  { name: 'home', path: '/' },
  { name: 'anime-list', path: '/anime' },
  { name: 'search', path: '/search?q=naruto' },
  { name: 'anime-detail', path: '/anime/naruto' }, // Ajustez selon un anime disponible
  { name: 'episode', path: '/anime/naruto/episode/1' }, // Ajustez selon un épisode disponible
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

// Fonction principale pour exécuter les tests
async function runQATests() {
  console.log('🚀 Démarrage des tests QA Frontend avec Trae AI MCP...');
  
  // S'assurer que le dossier de captures d'écran existe
  await ensureDirectoryExists(SCREENSHOTS_DIR);
  
  // Initialiser le navigateur avec MCP
  await initBrowser();
  
  // Tester chaque page
  for (const page of PAGES_TO_TEST) {
    console.log(`\n📄 Test de la page: ${page.name}`);
    
    // Tester dans chaque résolution
    for (const [deviceType, viewport] of Object.entries(RESOLUTIONS)) {
      console.log(`🖥️  Résolution: ${deviceType} (${viewport.width}x${viewport.height})`);
      
      // 1. Configurer la taille de la fenêtre
      await setViewport(viewport.width, viewport.height);
      
      // 2. Naviguer vers la page
      console.log(`🌐 Navigation vers ${BASE_URL}${page.path}`);
      await navigateToPage(`${BASE_URL}${page.path}`);
      
      // 3. Attendre que la page soit chargée
      await waitForPageLoad();
      
      // 4. Capturer les erreurs console
      const consoleErrors = await captureConsoleErrors();
      if (consoleErrors.length > 0) {
        testResults.consoleErrors.push({
          page: page.name,
          device: deviceType,
          errors: consoleErrors
        });
      }
      
      // 5. Capturer les erreurs réseau
      const networkErrors = await captureNetworkErrors();
      if (networkErrors.length > 0) {
        testResults.networkErrors.push({
          page: page.name,
          device: deviceType,
          errors: networkErrors
        });
      }
      
      // 6. Prendre une capture d'écran
      const screenshotName = `${page.name}-${deviceType}.png`;
      const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotName);
      console.log(`📸 Capture d'écran: ${screenshotName}`);
      await takeScreenshot(screenshotName);
      testResults.screenshots.push({
        page: page.name,
        device: deviceType,
        path: screenshotPath
      });
      
      // 7. Vérifier les boutons et interactions
      const buttonIssues = await checkButtonInteractions(page.name);
      if (buttonIssues.length > 0) {
        testResults.buttonIssues.push({
          page: page.name,
          device: deviceType,
          issues: buttonIssues
        });
      }
      
      // 8. Détecter les problèmes visuels
      const visualIssues = await detectVisualIssues();
      if (visualIssues.length > 0) {
        testResults.visualIssues.push({
          page: page.name,
          device: deviceType,
          issues: visualIssues
        });
      }
      
      console.log(`✅ Test de ${page.name} en ${deviceType} terminé`);
    }
  }
  
  // Générer les rapports
  await generateLogs(testResults);
  await generateReport(testResults);
  
  console.log('\n✅ Tests QA terminés!');
}

// Fonctions utilitaires pour MCP
async function initBrowser() {
  console.log('🌐 Initialisation du navigateur...');
  await runMCP('puppeteer_navigate', { 
    url: 'about:blank',
    launchOptions: {
      headless: true,
      args: ['--no-sandbox']
    }
  });
}

async function setViewport(width, height) {
  console.log(`📏 Configuration de la taille: ${width}x${height}`);
  await runMCP('puppeteer_evaluate', {
    script: `
      window.resizeTo(${width}, ${height});
      return true;
    `
  });
}

async function navigateToPage(url) {
  await runMCP('puppeteer_navigate', { url });
}

async function waitForPageLoad() {
  console.log('⏳ Attente du chargement complet...');
  await new Promise(resolve => setTimeout(resolve, 2000));
}

async function takeScreenshot(name) {
  await runMCP('puppeteer_screenshot', { name });
}

async function captureConsoleErrors() {
  console.log('🔍 Vérification des erreurs console...');
  const result = await runMCP('puppeteer_evaluate', {
    script: `
      return window.__consoleErrors || [];
    `
  });
  
  // Installer le capteur d'erreurs pour les futures erreurs
  await runMCP('puppeteer_evaluate', {
    script: `
      if (!window.__consoleErrors) {
        window.__consoleErrors = [];
        const originalConsoleError = console.error;
        console.error = function() {
          window.__consoleErrors.push(Array.from(arguments).join(' '));
          originalConsoleError.apply(console, arguments);
        };
        
        const originalConsoleWarn = console.warn;
        console.warn = function() {
          window.__consoleErrors.push('[WARN] ' + Array.from(arguments).join(' '));
          originalConsoleWarn.apply(console, arguments);
        };
        
        window.addEventListener('error', function(event) {
          window.__consoleErrors.push('[UNCAUGHT] ' + event.message);
        });
      }
      return true;
    `
  });
  
  return result || [];
}

async function captureNetworkErrors() {
  console.log('🔍 Vérification des erreurs réseau...');
  const result = await runMCP('puppeteer_evaluate', {
    script: `
      return window.__networkErrors || [];
    `
  });
  
  // Installer le capteur d'erreurs réseau
  await runMCP('puppeteer_evaluate', {
    script: `
      if (!window.__networkErrors) {
        window.__networkErrors = [];
        const originalFetch = window.fetch;
        window.fetch = async function() {
          try {
            const response = await originalFetch.apply(this, arguments);
            if (!response.ok) {
              window.__networkErrors.push({
                url: arguments[0],
                status: response.status,
                statusText: response.statusText
              });
            }
            return response;
          } catch (error) {
            window.__networkErrors.push({
              url: arguments[0],
              error: error.message
            });
            throw error;
          }
        };
      }
      return true;
    `
  });
  
  return result || [];
}

async function checkButtonInteractions(pageName) {
  console.log('🖱️ Vérification des interactions des boutons...');
  const issues = [];
  
  // Définir les sélecteurs de boutons à tester selon la page
  const buttonSelectors = getButtonSelectorsForPage(pageName);
  
  for (const selector of buttonSelectors) {
    try {
      // Vérifier si le bouton existe
      const buttonExists = await runMCP('puppeteer_evaluate', {
        script: `return !!document.querySelector('${selector}')`
      });
      
      if (!buttonExists) {
        issues.push({
          selector,
          issue: 'Bouton non trouvé'
        });
        continue;
      }
      
      // Vérifier si le bouton est visible et cliquable
      const buttonStatus = await runMCP('puppeteer_evaluate', {
        script: `
          const button = document.querySelector('${selector}');
          if (!button) return { visible: false, clickable: false };
          
          const rect = button.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(button);
          
          const visible = rect.width > 0 && 
                         rect.height > 0 && 
                         computedStyle.visibility !== 'hidden' && 
                         computedStyle.display !== 'none' &&
                         rect.top < window.innerHeight &&
                         rect.left < window.innerWidth;
          
          const clickable = visible && 
                           !button.disabled && 
                           computedStyle.pointerEvents !== 'none';
          
          return { 
            visible, 
            clickable,
            width: rect.width,
            height: rect.height,
            text: button.innerText || button.textContent
          };
        `
      });
      
      if (!buttonStatus.visible) {
        issues.push({
          selector,
          issue: 'Bouton non visible',
          details: buttonStatus
        });
        continue;
      }
      
      if (!buttonStatus.clickable) {
        issues.push({
          selector,
          issue: 'Bouton non cliquable',
          details: buttonStatus
        });
        continue;
      }
      
      // Vérifier si le bouton est trop petit (moins de 44x44px pour mobile)
      if (buttonStatus.width < 44 || buttonStatus.height < 44) {
        issues.push({
          selector,
          issue: 'Bouton trop petit pour une bonne expérience mobile',
          details: buttonStatus
        });
      }
      
      // Essayer de cliquer sur le bouton
      await runMCP('puppeteer_click', { selector });
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      issues.push({
        selector,
        issue: 'Erreur lors du test du bouton',
        error: error.message
      });
    }
  }
  
  return issues;
}

async function detectVisualIssues() {
  console.log('🔍 Détection des problèmes visuels...');
  const issues = [];
  
  // Détecter les overflows
  const overflowIssues = await runMCP('puppeteer_evaluate', {
    script: `
      const issues = [];
      const elements = document.querySelectorAll('*');
      
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        
        // Ignorer les éléments très petits ou invisibles
        if (rect.width < 10 || rect.height < 10) continue;
        
        // Vérifier les overflows horizontaux
        if (rect.right > window.innerWidth + 5) {
          issues.push({
            type: 'overflow-x',
            element: element.tagName + (element.id ? '#' + element.id : '') + 
                    (element.className ? '.' + element.className.replace(/ /g, '.') : ''),
            details: {
              right: rect.right,
              windowWidth: window.innerWidth,
              overflow: rect.right - window.innerWidth
            }
          });
        }
        
        // Vérifier les textes tronqués
        if (element.tagName === 'P' || 
            element.tagName === 'H1' || 
            element.tagName === 'H2' || 
            element.tagName === 'H3' || 
            element.tagName === 'H4' || 
            element.tagName === 'H5' || 
            element.tagName === 'H6' || 
            element.tagName === 'SPAN' || 
            element.tagName === 'DIV') {
          
          const style = window.getComputedStyle(element);
          if (style.overflow === 'hidden' && 
              style.textOverflow !== 'ellipsis' && 
              element.scrollWidth > element.clientWidth + 2) {
            issues.push({
              type: 'truncated-text',
              element: element.tagName + (element.id ? '#' + element.id : '') + 
                      (element.className ? '.' + element.className.replace(/ /g, '.') : ''),
              text: element.innerText || element.textContent,
              details: {
                scrollWidth: element.scrollWidth,
                clientWidth: element.clientWidth,
                overflow: element.scrollWidth - element.clientWidth
              }
            });
          }
        }
      }
      
      return issues;
    `
  });
  
  return overflowIssues || [];
}

// Fonction utilitaire pour obtenir les sélecteurs de boutons selon la page
function getButtonSelectorsForPage(pageName) {
  // Définir les sélecteurs de boutons à tester pour chaque page
  const buttonSelectors = {
    'home': [
      'a.navbar-brand',
      'a.nav-link',
      'button.btn-primary',
      '.card a'
    ],
    'anime-list': [
      'a.navbar-brand',
      '.pagination .page-link',
      '.card a',
      'button.filter-button'
    ],
    'search': [
      'a.navbar-brand',
      'input[type="search"]',
      'button[type="submit"]',
      '.search-result a'
    ],
    'anime-detail': [
      'a.navbar-brand',
      '.episode-list a',
      'button.watch-button',
      '.genre-tag'
    ],
    'episode': [
      'a.navbar-brand',
      '.player-controls button',
      '.episode-navigation a',
      'button.fullscreen-button'
    ]
  };
  
  return buttonSelectors[pageName] || [];
}

// Fonctions pour générer les rapports
async function generateLogs(results) {
  console.log('📝 Génération des logs...');
  await fs.writeFile(LOGS_FILE, JSON.stringify(results, null, 2));
}

async function generateReport(results) {
  console.log('📊 Génération du rapport...');
  
  let report = `# Rapport de QA Frontend\n\n`;
  report += `Date: ${new Date().toLocaleString()}\n\n`;
  
  // Résumé
  report += `## Résumé\n\n`;
  report += `- Pages testées: ${PAGES_TO_TEST.length}\n`;
  report += `- Résolutions testées: ${Object.keys(RESOLUTIONS).length}\n`;
  report += `- Captures d'écran: ${results.screenshots.length}\n`;
  report += `- Erreurs console: ${results.consoleErrors.reduce((sum, item) => sum + item.errors.length, 0)}\n`;
  report += `- Erreurs réseau: ${results.networkErrors.reduce((sum, item) => sum + item.errors.length, 0)}\n`;
  report += `- Problèmes de boutons: ${results.buttonIssues.reduce((sum, item) => sum + item.issues.length, 0)}\n`;
  report += `- Problèmes visuels: ${results.visualIssues.reduce((sum, item) => sum + item.issues.length, 0)}\n\n`;
  
  // Erreurs console
  report += `## Erreurs Console\n\n`;
  if (results.consoleErrors.length === 0) {
    report += `✅ Aucune erreur console détectée.\n\n`;
  } else {
    for (const item of results.consoleErrors) {
      report += `### Page: ${item.page} (${item.device})\n\n`;
      for (const error of item.errors) {
        report += `- \`${error}\`\n`;
      }
      report += `\n`;
    }
  }
  
  // Erreurs réseau
  report += `## Erreurs Réseau\n\n`;
  if (results.networkErrors.length === 0) {
    report += `✅ Aucune erreur réseau détectée.\n\n`;
  } else {
    for (const item of results.networkErrors) {
      report += `### Page: ${item.page} (${item.device})\n\n`;
      for (const error of item.errors) {
        if (error.status) {
          report += `- ${error.url}: ${error.status} ${error.statusText}\n`;
        } else {
          report += `- ${error.url}: ${error.error}\n`;
        }
      }
      report += `\n`;
    }
  }
  
  // Problèmes de boutons
  report += `## Problèmes de Boutons\n\n`;
  if (results.buttonIssues.length === 0) {
    report += `✅ Aucun problème de bouton détecté.\n\n`;
  } else {
    for (const item of results.buttonIssues) {
      report += `### Page: ${item.page} (${item.device})\n\n`;
      for (const issue of item.issues) {
        report += `- Sélecteur: \`${issue.selector}\`\n`;
        report += `  - Problème: ${issue.issue}\n`;
        if (issue.details) {
          if (issue.details.text) {
            report += `  - Texte: "${issue.details.text}"\n`;
          }
          if (issue.details.width !== undefined && issue.details.height !== undefined) {
            report += `  - Dimensions: ${issue.details.width}x${issue.details.height}px\n`;
          }
        }
      }
      report += `\n`;
    }
  }
  
  // Problèmes visuels
  report += `## Problèmes Visuels\n\n`;
  if (results.visualIssues.length === 0) {
    report += `✅ Aucun problème visuel détecté.\n\n`;
  } else {
    for (const item of results.visualIssues) {
      report += `### Page: ${item.page} (${item.device})\n\n`;
      for (const issue of item.issues) {
        report += `- Élément: \`${issue.element}\`\n`;
        report += `  - Type: ${issue.type}\n`;
        if (issue.text) {
          report += `  - Texte: "${issue.text}"\n`;
        }
        if (issue.details) {
          if (issue.type === 'overflow-x') {
            report += `  - Débordement: ${issue.details.overflow}px hors de l'écran\n`;
          } else if (issue.type === 'truncated-text') {
            report += `  - Texte tronqué de ${issue.details.overflow}px\n`;
          }
        }
      }
      report += `\n`;
    }
  }
  
  // Captures d'écran
  report += `## Captures d'écran\n\n`;
  for (const screenshot of results.screenshots) {
    report += `- ${screenshot.page} (${screenshot.device}): \`${path.basename(screenshot.path)}\`\n`;
  }
  
  await fs.writeFile(REPORT_FILE, report);
}

// Fonction utilitaire pour s'assurer qu'un répertoire existe
async function ensureDirectoryExists(directory) {
  try {
    await fs.mkdir(directory, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Fonction utilitaire pour appeler MCP
async function runMCP(toolName, args) {
  console.log(`Appel MCP: ${toolName}`);
  // Cette fonction sera remplacée par l'appel réel à MCP dans Trae AI
  return {};
}

// Exécuter les tests
runQATests().catch(console.error);