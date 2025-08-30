import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import puppeteer from 'puppeteer';

class PuppeteerMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'puppeteer-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browser = null;
    this.pages = new Map();
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // Outil pour lancer un navigateur
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args);
          case 'new_page':
            return await this.newPage(args);
          case 'navigate':
            return await this.navigate(args);
          case 'screenshot':
            return await this.takeScreenshot(args);
          case 'extract_text':
            return await this.extractText(args);
          case 'click_element':
            return await this.clickElement(args);
          case 'type_text':
            return await this.typeText(args);
          case 'wait_for_element':
            return await this.waitForElement(args);
          case 'close_browser':
            return await this.closeBrowser(args);
          default:
            throw new Error(`Outil non reconnu: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Erreur: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async launchBrowser(args) {
    const { headless = true, slowMo = 0 } = args;
    
    if (this.browser) {
      await this.browser.close();
    }

    this.browser = await puppeteer.launch({
      headless: headless === 'false' ? false : true,
      slowMo: parseInt(slowMo) || 0,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    return {
      content: [
        {
          type: 'text',
          text: `Navigateur lancé avec succès. Headless: ${headless}`,
        },
      ],
    };
  }

  async newPage(args) {
    if (!this.browser) {
      throw new Error('Navigateur non lancé. Utilisez launch_browser d\'abord.');
    }

    const page = await this.browser.newPage();
    const pageId = Date.now().toString();
    this.pages.set(pageId, page);

    return {
      content: [
        {
          type: 'text',
          text: `Nouvelle page créée avec l'ID: ${pageId}`,
        },
      ],
    };
  }

  async navigate(args) {
    const { pageId, url } = args;
    
    if (!this.browser) {
      throw new Error('Navigateur non lancé.');
    }

    const page = this.pages.get(pageId) || (await this.browser.newPage());
    await page.goto(url, { waitUntil: 'networkidle2' });

    return {
      content: [
        {
          type: 'text',
          text: `Navigation vers ${url} terminée.`,
        },
      ],
    };
  }

  async takeScreenshot(args) {
    const { pageId, path, fullPage = false } = args;
    
    if (!this.browser) {
      throw new Error('Navigateur non lancé.');
    }

    const page = this.pages.get(pageId) || (await this.browser.newPage());
    const screenshotPath = path || `screenshot_${Date.now()}.png`;
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: fullPage === 'true'
    });

    return {
      content: [
        {
          type: 'text',
          text: `Capture d'écran sauvegardée: ${screenshotPath}`,
        },
      ],
    };
  }

  async extractText(args) {
    const { pageId, selector } = args;
    
    if (!this.browser) {
      throw new Error('Navigateur non lancé.');
    }

    const page = this.pages.get(pageId) || (await this.browser.newPage());
    const text = await page.$eval(selector, el => el.textContent);

    return {
      content: [
        {
          type: 'text',
          text: `Texte extrait: ${text}`,
        },
      ],
    };
  }

  async clickElement(args) {
    const { pageId, selector } = args;
    
    if (!this.browser) {
      throw new Error('Navigateur non lancé.');
    }

    const page = this.pages.get(pageId) || (await this.browser.newPage());
    await page.click(selector);

    return {
      content: [
        {
          type: 'text',
          text: `Clic sur l'élément ${selector} effectué.`,
        },
      ],
    };
  }

  async typeText(args) {
    const { pageId, selector, text } = args;
    
    if (!this.browser) {
      throw new Error('Navigateur non lancé.');
    }

    const page = this.pages.get(pageId) || (await this.browser.newPage());
    await page.type(selector, text);

    return {
      content: [
        {
          type: 'text',
          text: `Texte "${text}" saisi dans ${selector}.`,
        },
      ],
    };
  }

  async waitForElement(args) {
    const { pageId, selector, timeout = 30000 } = args;
    
    if (!this.browser) {
      throw new Error('Navigateur non lancé.');
    }

    const page = this.pages.get(pageId) || (await this.browser.newPage());
    await page.waitForSelector(selector, { timeout: parseInt(timeout) });

    return {
      content: [
        {
          type: 'text',
          text: `Élément ${selector} trouvé.`,
        },
      ],
    };
  }

  async closeBrowser(args) {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.pages.clear();
    }

    return {
      content: [
        {
          type: 'text',
          text: 'Navigateur fermé avec succès.',
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Serveur MCP Puppeteer démarré');
  }
}

// Démarrage du serveur
const server = new PuppeteerMCPServer();
server.run().catch(console.error);
