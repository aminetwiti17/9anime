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
    // Define tools
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'launch_browser',
            description: 'Launch a new browser instance',
            inputSchema: {
              type: 'object',
              properties: {
                headless: { type: 'boolean', default: true },
                slowMo: { type: 'number', default: 0 }
              }
            }
          },
          {
            name: 'new_page',
            description: 'Create a new page in the browser',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'navigate',
            description: 'Navigate to a URL',
            inputSchema: {
              type: 'object',
              properties: {
                pageId: { type: 'string' },
                url: { type: 'string' }
              },
              required: ['pageId', 'url']
            }
          },
          {
            name: 'screenshot',
            description: 'Take a screenshot',
            inputSchema: {
              type: 'object',
              properties: {
                pageId: { type: 'string' },
                path: { type: 'string' },
                fullPage: { type: 'boolean', default: false }
              },
              required: ['pageId']
            }
          },
          {
            name: 'extract_text',
            description: 'Extract text from an element',
            inputSchema: {
              type: 'object',
              properties: {
                pageId: { type: 'string' },
                selector: { type: 'string' }
              },
              required: ['pageId', 'selector']
            }
          },
          {
            name: 'close_browser',
            description: 'Close the browser',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    // Handle tool calls
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
          case 'close_browser':
            return await this.closeBrowser(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
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
      headless: headless === false ? false : true,
      slowMo: parseInt(slowMo) || 0,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    return {
      content: [
        {
          type: 'text',
          text: `Browser launched successfully. Headless: ${headless}`,
        },
      ],
    };
  }

  async newPage(args) {
    if (!this.browser) {
      throw new Error('Browser not launched. Use launch_browser first.');
    }

    const page = await this.browser.newPage();
    const pageId = Date.now().toString();
    this.pages.set(pageId, page);

    return {
      content: [
        {
          type: 'text',
          text: `Page created successfully. Page ID: ${pageId}`,
        },
        {
          type: 'text',
          text: JSON.stringify({ pageId }),
        },
      ],
    };
  }

  async navigate(args) {
    const { pageId, url } = args;
    
    if (!this.pages.has(pageId)) {
      throw new Error(`Page not found: ${pageId}`);
    }

    const page = this.pages.get(pageId);
    await page.goto(url, { waitUntil: 'networkidle2' });

    return {
      content: [
        {
          type: 'text',
          text: `Navigated to ${url} successfully`,
        },
      ],
    };
  }

  async takeScreenshot(args) {
    const { pageId, path = 'screenshot.png', fullPage = false } = args;
    
    if (!this.pages.has(pageId)) {
      throw new Error(`Page not found: ${pageId}`);
    }

    const page = this.pages.get(pageId);
    await page.screenshot({ path, fullPage });

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved to ${path}`,
        },
      ],
    };
  }

  async extractText(args) {
    const { pageId, selector } = args;
    
    if (!this.pages.has(pageId)) {
      throw new Error(`Page not found: ${pageId}`);
    }

    const page = this.pages.get(pageId);
    const text = await page.$eval(selector, el => el.textContent);

    return {
      content: [
        {
          type: 'text',
          text: text || 'No text found',
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
          text: 'Browser closed successfully',
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Puppeteer MCP Server started');
  }
}

// Start the server
const server = new PuppeteerMCPServer();
server.start().catch(console.error);
