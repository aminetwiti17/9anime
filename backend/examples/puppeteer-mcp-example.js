// Exemple d'utilisation du serveur MCP Puppeteer
// Ce fichier montre comment utiliser les différentes fonctionnalités

import puppeteer from 'puppeteer';

// Exemple d'automatisation web complète
async function exampleAutomation() {
  console.log('🚀 Démarrage de l\'exemple d\'automatisation...');
  
  try {
    // 1. Lancer le navigateur
    const browser = await puppeteer.launch({
      headless: false, // Visible pour voir ce qui se passe
      slowMo: 1000,    // Ralentir pour voir les actions
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // 2. Créer une nouvelle page
    const page = await browser.newPage();
    
    // 3. Définir la taille de la fenêtre
    await page.setViewport({ width: 1280, height: 720 });

    // 4. Naviguer vers un site
    console.log('🌐 Navigation vers GitHub...');
    await page.goto('https://github.com/puppeteer/puppeteer', {
      waitUntil: 'networkidle2'
    });

    // 5. Attendre qu'un élément soit présent
    await page.waitForSelector('h1');

    // 6. Extraire du texte
    const title = await page.$eval('h1', el => el.textContent);
    console.log(`📝 Titre de la page: ${title}`);

    // 7. Prendre une capture d'écran
    console.log('📸 Prise de capture d\'écran...');
    await page.screenshot({
      path: 'github-puppeteer.png',
      fullPage: true
    });

    // 8. Cliquer sur un lien
    console.log('🖱️ Clic sur le lien README...');
    await page.click('a[href="/puppeteer/puppeteer/blob/main/README.md"]');

    // 9. Attendre le chargement
    await page.waitForSelector('.markdown-body');

    // 10. Extraire plus de contenu
    const readmeContent = await page.$eval('.markdown-body', el => {
      const headings = el.querySelectorAll('h1, h2, h3');
      return Array.from(headings).map(h => h.textContent).join('\n');
    });

    console.log('📖 Contenu des titres du README:');
    console.log(readmeContent);

    // 11. Prendre une autre capture
    await page.screenshot({
      path: 'github-readme.png',
      fullPage: true
    });

    console.log('✅ Exemple terminé avec succès !');
    console.log('📁 Captures d\'écran sauvegardées:');
    console.log('   - github-puppeteer.png');
    console.log('   - github-readme.png');

  } catch (error) {
    console.error('❌ Erreur lors de l\'automatisation:', error);
  } finally {
    // 12. Fermer le navigateur
    if (browser) {
      await browser.close();
      console.log('🔒 Navigateur fermé');
    }
  }
}

// Exemple d'extraction de données
async function extractDataExample() {
  console.log('📊 Démarrage de l\'exemple d\'extraction de données...');
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Aller sur une page avec des données
    await page.goto('https://example.com');
    
    // Extraire des informations
    const data = await page.evaluate(() => {
      return {
        title: document.title,
        headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent),
        links: Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.textContent,
          href: a.href
        }))
      };
    });

    console.log('📋 Données extraites:', JSON.stringify(data, null, 2));

    await browser.close();
    console.log('✅ Extraction terminée');

  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction:', error);
  }
}

// Exemple de test automatisé
async function testExample() {
  console.log('🧪 Démarrage de l\'exemple de test...');
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Test de navigation
    await page.goto('https://example.com');
    
    // Vérifier que le titre est correct
    const title = await page.title();
    if (title.includes('Example Domain')) {
      console.log('✅ Test du titre réussi');
    } else {
      console.log('❌ Test du titre échoué');
    }

    // Vérifier qu'un élément existe
    const element = await page.$('h1');
    if (element) {
      console.log('✅ Test de présence d\'élément réussi');
    } else {
      console.log('❌ Test de présence d\'élément échoué');
    }

    await browser.close();
    console.log('✅ Tests terminés');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Fonction principale
async function main() {
  console.log('🎯 Démarrage des exemples Puppeteer MCP...\n');
  
  // Exécuter les exemples
  await exampleAutomation();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await extractDataExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testExample();
  
  console.log('\n🎉 Tous les exemples sont terminés !');
}

// Exécuter si le fichier est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { exampleAutomation, extractDataExample, testExample };
