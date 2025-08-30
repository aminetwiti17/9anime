// Script de correction automatique des problèmes UI courants détectés dans les captures d'écran
// Ce script analyse les problèmes détectés et applique des corrections au code frontend

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Configuration
const PROJECT_ROOT = process.cwd();
const LOGS_FILE = path.join(PROJECT_ROOT, 'tests', 'screenshot-analysis-logs.json');
const REPORT_FILE = path.join(PROJECT_ROOT, 'tests', 'auto-fix-report.md');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

// Types de corrections
const FIX_TYPES = {
  OVERFLOW_X: 'overflow-horizontal',
  SMALL_TOUCH_TARGET: 'cible-tactile-trop-petite',
  CONTRAST_ISSUE: 'problème-contraste',
  TRUNCATED_TEXT: 'texte-tronqué',
  RESPONSIVE_ISSUE: 'problème-responsive'
};

// Résultats des corrections
const fixResults = {
  timestamp: new Date().toISOString(),
  issuesFixed: 0,
  issuesPartiallyFixed: 0,
  issuesNotFixed: 0,
  filesByType: {},
  fixesByPage: {},
  fixesByType: {},
  modifiedFiles: []
};

/**
 * Fonction principale pour appliquer les corrections
 */
async function applyAutoFixes() {
  console.log('🔧 Démarrage des corrections automatiques...');
  
  try {
    // Vérifier que le fichier de logs existe
    await fs.access(LOGS_FILE);
    
    // Charger les résultats de l'analyse
    const analysisData = JSON.parse(await fs.readFile(LOGS_FILE, 'utf8'));
    console.log(`📊 Analyse chargée: ${analysisData.issuesDetected} problèmes détectés`);
    
    // Initialiser les compteurs
    Object.values(FIX_TYPES).forEach(type => {
      fixResults.fixesByType[type] = 0;
    });
    
    // Traiter chaque capture d'écran avec des problèmes
    const screenshotsWithIssues = analysisData.screenshots.filter(s => s.issues && s.issues.length > 0);
    
    for (const screenshot of screenshotsWithIssues) {
      await processScreenshotIssues(screenshot);
    }
    
    // Générer et sauvegarder le rapport
    await generateAndSaveReport();
    
    console.log(`✅ Corrections terminées. ${fixResults.issuesFixed} problèmes corrigés.`);
    console.log(`📝 Rapport sauvegardé dans ${REPORT_FILE}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'application des corrections:', error);
  }
}

/**
 * Traite les problèmes d'une capture d'écran
 * @param {Object} screenshot - Informations sur la capture d'écran
 */
async function processScreenshotIssues(screenshot) {
  console.log(`🔍 Traitement des problèmes pour ${screenshot.page} (${screenshot.deviceType})...`);
  
  // Initialiser le compteur pour cette page si nécessaire
  if (!fixResults.fixesByPage[screenshot.page]) {
    fixResults.fixesByPage[screenshot.page] = {
      fixed: 0,
      partiallyFixed: 0,
      notFixed: 0
    };
  }
  
  // Traiter chaque problème
  for (const issue of screenshot.issues) {
    await fixIssue(issue, screenshot);
  }
}

/**
 * Applique une correction pour un problème spécifique
 * @param {Object} issue - Problème à corriger
 * @param {Object} screenshot - Informations sur la capture d'écran
 */
async function fixIssue(issue, screenshot) {
  console.log(`🔧 Tentative de correction: ${issue.type} dans ${screenshot.page}`);
  
  // Trouver les fichiers à modifier en fonction de la page
  const filesToModify = await findFilesToModify(screenshot.page);
  
  if (filesToModify.length === 0) {
    console.log(`⚠️ Aucun fichier trouvé pour la page ${screenshot.page}`);
    fixResults.issuesNotFixed++;
    fixResults.fixesByPage[screenshot.page].notFixed++;
    return;
  }
  
  let fixApplied = false;
  
  // Appliquer la correction appropriée selon le type de problème
  switch (issue.type) {
    case FIX_TYPES.OVERFLOW_X:
      fixApplied = await fixOverflowX(filesToModify, screenshot.deviceType);
      break;
    case FIX_TYPES.SMALL_TOUCH_TARGET:
      fixApplied = await fixSmallTouchTargets(filesToModify, screenshot.deviceType);
      break;
    case FIX_TYPES.CONTRAST_ISSUE:
      fixApplied = await fixContrastIssues(filesToModify);
      break;
    case FIX_TYPES.TRUNCATED_TEXT:
      fixApplied = await fixTruncatedText(filesToModify);
      break;
    case FIX_TYPES.RESPONSIVE_ISSUE:
      fixApplied = await fixResponsiveIssues(filesToModify);
      break;
    default:
      console.log(`⚠️ Type de problème non pris en charge: ${issue.type}`);
      fixResults.issuesNotFixed++;
      fixResults.fixesByPage[screenshot.page].notFixed++;
      return;
  }
  
  // Mettre à jour les statistiques
  if (fixApplied === true) {
    fixResults.issuesFixed++;
    fixResults.fixesByPage[screenshot.page].fixed++;
    fixResults.fixesByType[issue.type] = (fixResults.fixesByType[issue.type] || 0) + 1;
    console.log(`✅ Correction appliquée pour ${issue.type}`);
  } else if (fixApplied === 'partial') {
    fixResults.issuesPartiallyFixed++;
    fixResults.fixesByPage[screenshot.page].partiallyFixed++;
    console.log(`⚠️ Correction partielle appliquée pour ${issue.type}`);
  } else {
    fixResults.issuesNotFixed++;
    fixResults.fixesByPage[screenshot.page].notFixed++;
    console.log(`❌ Impossible d'appliquer la correction pour ${issue.type}`);
  }
}

/**
 * Trouve les fichiers à modifier en fonction du nom de la page
 * @param {string} pageName - Nom de la page
 * @returns {Promise<Array>} Liste des fichiers à modifier
 */
async function findFilesToModify(pageName) {
  const files = [];
  
  // Mapper les noms de pages aux fichiers correspondants
  const pageToFileMap = {
    'home': ['components/Header.tsx', 'components/NineAnimeHomepage.tsx'],
    'anime-list': ['components/AnimeCard.tsx', 'pages/Dashboard.tsx'],
    'search': ['components/NineAnimeSearch.tsx', 'pages/SearchResults.tsx'],
    'anime-detail': ['pages/NineAnimeDetails.tsx', 'components/AnimeEpisodeList.tsx'],
    'episode': ['components/EpisodePage.tsx']
  };
  
  // Obtenir les fichiers correspondants
  const filePatterns = pageToFileMap[pageName] || [];
  
  // Si aucun fichier spécifique n'est trouvé, chercher par nom
  if (filePatterns.length === 0) {
    // Convertir le nom de la page en un format probable de fichier
    const possibleFileNames = [
      `${pageName}.tsx`,
      `${pageName}.jsx`,
      `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}.tsx`,
      `${pageName.replace(/-([a-z])/g, g => g[1].toUpperCase())}.tsx`
    ];
    
    // Rechercher dans le répertoire src
    try {
      const { stdout } = await execPromise(`find ${SRC_DIR} -type f -name "*.tsx" -o -name "*.jsx"`);
      const allFiles = stdout.trim().split('\n');
      
      for (const file of allFiles) {
        const fileName = path.basename(file);
        if (possibleFileNames.includes(fileName)) {
          files.push(file);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de fichiers:', error);
    }
  } else {
    // Utiliser les fichiers spécifiés
    for (const pattern of filePatterns) {
      const filePath = path.join(SRC_DIR, pattern);
      try {
        await fs.access(filePath);
        files.push(filePath);
      } catch (error) {
        // Fichier non trouvé, ignorer
      }
    }
  }
  
  return files;
}

/**
 * Corrige les problèmes de débordement horizontal
 * @param {Array} files - Liste des fichiers à modifier
 * @param {string} deviceType - Type d'appareil (mobile, desktop)
 * @returns {Promise<boolean|string>} Résultat de la correction
 */
async function fixOverflowX(files, deviceType) {
  let fixedCount = 0;
  
  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let modified = false;
      
      // Ajouter des styles pour éviter les débordements
      if (deviceType === 'mobile' && file.endsWith('.tsx') || file.endsWith('.jsx')) {
        // Rechercher les conteneurs qui pourraient causer des débordements
        if (content.includes('overflow-x:') || content.includes('overflowX:')) {
          // Remplacer overflow-x: auto/scroll par overflow-x: hidden pour mobile
          const newContent = content
            .replace(/overflow-x:\s*(auto|scroll)/g, 'overflow-x: hidden')
            .replace(/overflowX:\s*['"]?(auto|scroll)['"]?/g, 'overflowX: "hidden"');
          
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        } else {
          // Ajouter des classes Tailwind pour gérer les débordements
          if (content.includes('className=')) {
            const newContent = content.replace(
              /(className=['"](?:[^'"]*\s)?)(?!overflow-x-hidden|max-w-full)([^'"]*['"])/g,
              '$1overflow-x-hidden max-w-full $2'
            );
            
            if (newContent !== content) {
              content = newContent;
              modified = true;
            }
          }
        }
        
        // Ajouter des media queries pour le responsive si nécessaire
        if (!content.includes('@media') && (content.includes('width:') || content.includes('width='))) {
          const cssInsertPoint = content.lastIndexOf('`');
          if (cssInsertPoint !== -1) {
            const mediaCss = `
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }
`;
            content = content.slice(0, cssInsertPoint) + mediaCss + content.slice(cssInsertPoint);
            modified = true;
          }
        }
      }
      
      if (modified) {
        await fs.writeFile(file, content);
        fixedCount++;
        
        // Ajouter aux fichiers modifiés
        if (!fixResults.modifiedFiles.includes(file)) {
          fixResults.modifiedFiles.push(file);
        }
        
        // Mettre à jour les statistiques par type de fichier
        const fileType = path.extname(file).substring(1);
        fixResults.filesByType[fileType] = (fixResults.filesByType[fileType] || 0) + 1;
      }
    } catch (error) {
      console.error(`Erreur lors de la correction de ${file}:`, error);
    }
  }
  
  return fixedCount > 0 ? (fixedCount === files.length ? true : 'partial') : false;
}

/**
 * Corrige les problèmes de cibles tactiles trop petites
 * @param {Array} files - Liste des fichiers à modifier
 * @param {string} deviceType - Type d'appareil (mobile, desktop)
 * @returns {Promise<boolean|string>} Résultat de la correction
 */
async function fixSmallTouchTargets(files, deviceType) {
  let fixedCount = 0;
  
  if (deviceType !== 'mobile') {
    return false; // Ne s'applique qu'aux appareils mobiles
  }
  
  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let modified = false;
      
      // Rechercher les boutons et liens qui pourraient être trop petits
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        // Augmenter la taille des boutons
        if (content.includes('<button') || content.includes('Button')) {
          const newContent = content
            .replace(/className=['"]([^'"]*)['"]\s*(?=.*<button)/g, (match, classNames) => {
              if (!classNames.includes('min-w-') && !classNames.includes('min-h-')) {
                return `className="${classNames} min-w-[44px] min-h-[44px] p-2"`;
              }
              return match;
            })
            .replace(/className=['"]([^'"]*)['"]\s*(?=.*Button)/g, (match, classNames) => {
              if (!classNames.includes('min-w-') && !classNames.includes('min-h-')) {
                return `className="${classNames} min-w-[44px] min-h-[44px] p-2"`;
              }
              return match;
            });
          
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        }
        
        // Augmenter la taille des liens
        if (content.includes('<a ')) {
          const newContent = content
            .replace(/className=['"]([^'"]*)['"]\s*(?=.*<a )/g, (match, classNames) => {
              if (!classNames.includes('inline-block') && !classNames.includes('min-h-')) {
                return `className="${classNames} inline-block min-h-[44px] min-w-[44px] p-2"`;
              }
              return match;
            });
          
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        }
        
        // Ajouter des styles pour les icônes cliquables
        if (content.includes('lucide-react') && (content.includes('onClick') || content.includes('as="button"'))) {
          const newContent = content
            .replace(/(<[A-Z][a-zA-Z]*\s+[^>]*onClick=[^>]*>)/g, (match) => {
              if (!match.includes('className=')) {
                return match.replace('>', ' className="p-2 min-w-[44px] min-h-[44px]">');
              } else if (!match.includes('min-w-') && !match.includes('min-h-')) {
                return match.replace(/className=['"]([^'"]*)['"]/, 'className="$1 p-2 min-w-[44px] min-h-[44px]"');
              }
              return match;
            });
          
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        }
      }
      
      if (modified) {
        await fs.writeFile(file, content);
        fixedCount++;
        
        // Ajouter aux fichiers modifiés
        if (!fixResults.modifiedFiles.includes(file)) {
          fixResults.modifiedFiles.push(file);
        }
        
        // Mettre à jour les statistiques par type de fichier
        const fileType = path.extname(file).substring(1);
        fixResults.filesByType[fileType] = (fixResults.filesByType[fileType] || 0) + 1;
      }
    } catch (error) {
      console.error(`Erreur lors de la correction de ${file}:`, error);
    }
  }
  
  return fixedCount > 0 ? (fixedCount === files.length ? true : 'partial') : false;
}

/**
 * Corrige les problèmes de contraste
 * @param {Array} files - Liste des fichiers à modifier
 * @returns {Promise<boolean|string>} Résultat de la correction
 */
async function fixContrastIssues(files) {
  let fixedCount = 0;
  
  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let modified = false;
      
      // Rechercher les problèmes de contraste potentiels
      if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.css')) {
        // Remplacer les couleurs de texte claires sur fond clair
        const newContent = content
          // Remplacer les classes text-gray-300, text-gray-400, etc. par des couleurs plus foncées
          .replace(/text-gray-(300|400|200)/g, 'text-gray-700')
          .replace(/text-gray-(100)/g, 'text-gray-800')
          // Remplacer les couleurs CSS claires
          .replace(/color:\s*#([0-9a-f]{6})/gi, (match, color) => {
            // Vérifier si la couleur est claire (approximation simplifiée)
            const r = parseInt(color.substr(0, 2), 16);
            const g = parseInt(color.substr(2, 2), 16);
            const b = parseInt(color.substr(4, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            
            // Si la couleur est claire, la remplacer par une couleur plus foncée
            if (brightness > 155) {
              return 'color: #333333';
            }
            return match;
          });
        
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
      
      if (modified) {
        await fs.writeFile(file, content);
        fixedCount++;
        
        // Ajouter aux fichiers modifiés
        if (!fixResults.modifiedFiles.includes(file)) {
          fixResults.modifiedFiles.push(file);
        }
        
        // Mettre à jour les statistiques par type de fichier
        const fileType = path.extname(file).substring(1);
        fixResults.filesByType[fileType] = (fixResults.filesByType[fileType] || 0) + 1;
      }
    } catch (error) {
      console.error(`Erreur lors de la correction de ${file}:`, error);
    }
  }
  
  return fixedCount > 0 ? (fixedCount === files.length ? true : 'partial') : false;
}

/**
 * Corrige les problèmes de texte tronqué
 * @param {Array} files - Liste des fichiers à modifier
 * @returns {Promise<boolean|string>} Résultat de la correction
 */
async function fixTruncatedText(files) {
  let fixedCount = 0;
  
  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let modified = false;
      
      // Rechercher les problèmes de texte tronqué potentiels
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        // Ajouter des classes pour gérer le texte trop long
        const newContent = content
          // Ajouter truncate aux éléments qui pourraient avoir du texte tronqué
          .replace(/(<(?:p|h[1-6]|span|div)[^>]*className=['"])([^'"]*?)(['"])/g, (match, prefix, classNames, suffix) => {
            if (!classNames.includes('truncate') && !classNames.includes('overflow-')) {
              return `${prefix}${classNames} truncate${suffix}`;
            }
            return match;
          })
          // Ajouter des tooltips aux éléments tronqués
          .replace(/(<(?:p|h[1-6]|span|div)[^>]*className=['"][^'"]*truncate[^'"]*['"][^>]*>)([^<]*?)(<\/(?:p|h[1-6]|span|div)>)/g, 
            (match, prefix, content, suffix) => {
              return `${prefix.replace('>', ' title="${content}">')}${content}${suffix}`;
            });
        
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
      
      if (modified) {
        await fs.writeFile(file, content);
        fixedCount++;
        
        // Ajouter aux fichiers modifiés
        if (!fixResults.modifiedFiles.includes(file)) {
          fixResults.modifiedFiles.push(file);
        }
        
        // Mettre à jour les statistiques par type de fichier
        const fileType = path.extname(file).substring(1);
        fixResults.filesByType[fileType] = (fixResults.filesByType[fileType] || 0) + 1;
      }
    } catch (error) {
      console.error(`Erreur lors de la correction de ${file}:`, error);
    }
  }
  
  return fixedCount > 0 ? (fixedCount === files.length ? true : 'partial') : false;
}

/**
 * Corrige les problèmes de responsive
 * @param {Array} files - Liste des fichiers à modifier
 * @returns {Promise<boolean|string>} Résultat de la correction
 */
async function fixResponsiveIssues(files) {
  let fixedCount = 0;
  
  for (const file of files) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let modified = false;
      
      // Rechercher les problèmes de responsive potentiels
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        // Ajouter des classes responsive manquantes
        const newContent = content
          // Ajouter des classes responsive aux conteneurs
          .replace(/(<div[^>]*className=['"])([^'"]*?)(['"])/g, (match, prefix, classNames, suffix) => {
            if (!classNames.includes('md:') && !classNames.includes('sm:') && !classNames.includes('lg:')) {
              return `${prefix}${classNames} w-full md:w-auto${suffix}`;
            }
            return match;
          })
          // Ajouter des classes flex-wrap aux conteneurs flex
          .replace(/(<div[^>]*className=['"][^'"]*flex[^'"]*['"][^>]*>)/g, (match) => {
            if (!match.includes('flex-wrap')) {
              return match.replace('flex', 'flex flex-wrap');
            }
            return match;
          })
          // Ajouter des classes responsive aux grilles
          .replace(/(<div[^>]*className=['"][^'"]*grid[^'"]*['"][^>]*>)/g, (match) => {
            if (!match.includes('grid-cols-')) {
              return match.replace('grid', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
            }
            return match;
          });
        
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
      
      if (modified) {
        await fs.writeFile(file, content);
        fixedCount++;
        
        // Ajouter aux fichiers modifiés
        if (!fixResults.modifiedFiles.includes(file)) {
          fixResults.modifiedFiles.push(file);
        }
        
        // Mettre à jour les statistiques par type de fichier
        const fileType = path.extname(file).substring(1);
        fixResults.filesByType[fileType] = (fixResults.filesByType[fileType] || 0) + 1;
      }
    } catch (error) {
      console.error(`Erreur lors de la correction de ${file}:`, error);
    }
  }
  
  return fixedCount > 0 ? (fixedCount === files.length ? true : 'partial') : false;
}

/**
 * Génère et sauvegarde le rapport de corrections
 */
async function generateAndSaveReport() {
  const report = generateReport();
  await fs.writeFile(REPORT_FILE, report);
}

/**
 * Génère un rapport au format Markdown
 * @returns {string} Rapport au format Markdown
 */
function generateReport() {
  const now = new Date().toLocaleString();
  
  let report = `# 🔧 Rapport des Corrections Automatiques

`;
  report += `*Généré le ${now}*

`;
  
  // Résumé
  report += `## 📋 Résumé

`;
  report += `- **Problèmes corrigés**: ${fixResults.issuesFixed}
`;
  report += `- **Problèmes partiellement corrigés**: ${fixResults.issuesPartiallyFixed}
`;
  report += `- **Problèmes non corrigés**: ${fixResults.issuesNotFixed}
`;
  report += `- **Fichiers modifiés**: ${fixResults.modifiedFiles.length}
`;
  
  // Corrections par type
  report += `
## 🔍 Corrections par Type

`;
  const fixTypes = Object.entries(fixResults.fixesByType)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
  
  if (fixTypes.length > 0) {
    report += `| Type de Problème | Nombre de Corrections |
|----------------|----------------------:|
`;
    fixTypes.forEach(([type, count]) => {
      report += `| ${formatFixType(type)} | ${count} |
`;
    });
  } else {
    report += `*Aucune correction appliquée*
`;
  }
  
  // Corrections par page
  report += `
## 📄 Corrections par Page

`;
  const pageFixEntries = Object.entries(fixResults.fixesByPage);
  
  if (pageFixEntries.length > 0) {
    report += `| Page | Corrigés | Partiellement Corrigés | Non Corrigés |
|------|--------:|------------------------:|-------------:|
`;
    pageFixEntries.forEach(([page, counts]) => {
      report += `| ${page} | ${counts.fixed} | ${counts.partiallyFixed} | ${counts.notFixed} |
`;
    });
  } else {
    report += `*Aucune correction appliquée*
`;
  }
  
  // Fichiers modifiés
  report += `
## 📁 Fichiers Modifiés

`;
  if (fixResults.modifiedFiles.length > 0) {
    fixResults.modifiedFiles.forEach(file => {
      const relativePath = path.relative(PROJECT_ROOT, file);
      report += `- \`${relativePath}\`
`;
    });
  } else {
    report += `*Aucun fichier modifié*
`;
  }
  
  // Recommandations
  report += `
## 💡 Recommandations

`;
  report += `- Vérifier visuellement les modifications apportées pour s'assurer qu'elles n'ont pas d'effets secondaires indésirables.
`;
  report += `- Exécuter à nouveau les tests pour vérifier que les problèmes ont bien été résolus.
`;
  report += `- Certains problèmes peuvent nécessiter une intervention manuelle, en particulier les problèmes de contraste et de design responsive complexes.
`;
  
  // Pied de page
  report += `\n---\n\n*Rapport généré automatiquement par l'outil de correction automatique*`;
  
  return report;
}

/**
 * Formate un type de correction pour l'affichage
 * @param {string} type - Type de correction
 * @returns {string} Type formaté
 */
function formatFixType(type) {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Exécuter les corrections
applyAutoFixes();