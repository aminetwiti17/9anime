// Script de test pour une seule page avec Trae AI MCP

// Configuration
const PAGE_URL = 'http://localhost:3000/'; // URL de la page à tester
const SCREENSHOT_NAME = 'homepage-test.png'; // Nom du fichier de capture d'écran

// Fonction principale
async function testSinglePage() {
  console.log(`🚀 Test de la page: ${PAGE_URL}`);
  
  try {
    // 1. Naviguer vers la page
    console.log('🌐 Navigation vers la page...');
    await runMCP('puppeteer_navigate', { 
      url: PAGE_URL,
      launchOptions: {
        headless: false,
        args: ['--no-sandbox']
      }
    });
    
    // 2. Attendre que la page soit chargée
    console.log('⏳ Attente du chargement complet...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Prendre une capture d'écran
    console.log('📸 Capture d\'écran...');
    await runMCP('puppeteer_screenshot', { 
      name: SCREENSHOT_NAME
    });
    
    // 4. Vérifier les erreurs console
    console.log('🔍 Vérification des erreurs console...');
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
      console.log('⚠️ Erreurs console détectées:');
      consoleErrors.forEach(error => console.log(`- ${error}`));
    } else {
      console.log('✅ Aucune erreur console détectée');
    }
    
    // 5. Tester un clic sur un bouton
    console.log('🖱️ Test de clic sur un bouton...');
    await runMCP('puppeteer_click', {
      selector: 'a.navbar-brand' // Exemple: clic sur le logo/brand
    });
    
    console.log('⏳ Attente après le clic...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 6. Prendre une autre capture d'écran après le clic
    console.log('📸 Capture d\'écran après clic...');
    await runMCP('puppeteer_screenshot', { 
      name: 'after-click.png'
    });
    
    console.log('✅ Test terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Fonction utilitaire pour appeler MCP
async function runMCP(toolName, args) {
  console.log(`Appel MCP: ${toolName}`, args);
  // Cette fonction sera remplacée par l'appel réel à MCP dans Trae AI
  return {};
}

// Exécuter le test
testSinglePage().catch(console.error);