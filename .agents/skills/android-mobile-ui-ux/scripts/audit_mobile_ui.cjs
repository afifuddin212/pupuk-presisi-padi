#!/usr/bin/env node
/**
 * Black-box CLI tool to statically audit Android / Capacitor mobile web UI & CSS
 * for Material Design 3 touch ergonomics, safe-area insets, viewport settings,
 * bottom-sheet patterns, and small-target traps.
 * Run with --help for usage instructions.
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node audit_mobile_ui.cjs [app-dir] [--json]

Audits an Android / Capacitor / Mobile Web application directory (HTML & CSS)
against Material Design 3 and outdoor field UI/UX best practices:
  1. Viewport configuration (viewport-fit=cover, width=device-width, user-scalable)
  2. Safe-area system bar insets (env(safe-area-inset-top), env(safe-area-inset-bottom))
  3. Touch ergonomics (-webkit-tap-highlight-color, touch-action, user-select)
  4. Touch target sizing (detects interactive rules with width/height < 36px vs 48dp target)
  5. Thumb-zone & sheet patterns (bottom sheets, FABs, backdrop scrims, z-index layering)

Arguments:
  [app-dir]   Path to the web app directory containing index.html & src/ (default: ./app or .)
  --json      Output structured JSON report
  --help, -h  Show this help message
`);
  process.exit(0);
}

const jsonMode = args.includes('--json');
const targetArg = args.find((a) => !a.startsWith('-'));
let appDir = path.resolve(targetArg || (fs.existsSync(path.resolve('app/index.html')) ? 'app' : '.'));

const htmlFiles = [];
const cssFiles = [];

function walk(dir, depth = 0) {
  if (depth > 3 || !fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', 'dist', 'android', 'ios', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, depth + 1);
    } else if (entry.name.endsWith('.html')) {
      htmlFiles.push(full);
    } else if (entry.name.endsWith('.css')) {
      cssFiles.push(full);
    }
  }
}

walk(appDir);

const report = {
  appDir,
  htmlFiles: htmlFiles.map((f) => path.relative(appDir, f)),
  cssFiles: cssFiles.map((f) => path.relative(appDir, f)),
  checks: [],
  warnings: [],
  metrics: {
    smallTouchTargets: [],
    zIndexLayers: [],
  },
  passed: true,
};

function addCheck(category, name, passed, detail, severity = 'warning') {
  report.checks.push({ category, name, passed, detail });
  if (!passed) {
    if (severity === 'error') report.passed = false;
    report.warnings.push(`[${category}] ${name}: ${detail}`);
  }
}

// 1. Audit HTML viewport & structure
const allHtml = htmlFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
if (htmlFiles.length === 0) {
  addCheck('HTML', 'HTML Entrypoint Found', false, `No .html files found in ${appDir}`, 'error');
} else {
  const viewportMatch = allHtml.match(/<meta[^>]+name=["']viewport["'][^>]*>/i);
  const vpContent = viewportMatch ? viewportMatch[0] : '';
  addCheck(
    'Viewport',
    'Viewport Meta Tag Present',
    Boolean(viewportMatch),
    viewportMatch ? vpContent : 'Missing <meta name="viewport"> tag',
    'error'
  );
  addCheck(
    'Viewport',
    'Edge-to-Edge Safe Area (viewport-fit=cover)',
    /viewport-fit\s*=\s*cover/i.test(vpContent),
    /viewport-fit\s*=\s*cover/i.test(vpContent)
      ? 'viewport-fit=cover is enabled for Android cutout/system bars'
      : 'Add viewport-fit=cover to <meta name="viewport"> so env(safe-area-inset-*) works on Android cutouts'
  );
  addCheck(
    'Viewport',
    'Accidental Page Pinch-Zoom Disabled',
    /user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?/i.test(vpContent),
    'Prevents accidental browser page zoom during map pinch gestures'
  );
}

// 2. Audit CSS Safe Areas, Touch Ergonomics, and Sizing
const allCss = cssFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
if (cssFiles.length === 0) {
  addCheck('CSS', 'Stylesheet Found', false, `No .css files found in ${appDir}`, 'error');
} else {
  const hasSafeTop = /env\(\s*safe-area-inset-top/i.test(allCss);
  const hasSafeBottom = /env\(\s*safe-area-inset-bottom/i.test(allCss);
  addCheck(
    'Safe Areas',
    'Top System Status Bar Inset (safe-area-inset-top)',
    hasSafeTop,
    hasSafeTop ? 'Found env(safe-area-inset-top)' : 'Missing env(safe-area-inset-top) for top HUD/header'
  );
  addCheck(
    'Safe Areas',
    'Bottom Gesture Navigation Inset (safe-area-inset-bottom)',
    hasSafeBottom,
    hasSafeBottom ? 'Found env(safe-area-inset-bottom)' : 'Missing env(safe-area-inset-bottom) for bottom nav/sheets'
  );

  const hasTapHighlight = /-webkit-tap-highlight-color\s*:\s*transparent/i.test(allCss);
  addCheck(
    'Touch UX',
    'Suppress Default WebView Tap Flash (-webkit-tap-highlight-color)',
    hasTapHighlight,
    hasTapHighlight
      ? 'Custom touch feedback enabled (-webkit-tap-highlight-color: transparent)'
      : 'Set -webkit-tap-highlight-color: transparent to avoid blue WebView flash on tap'
  );

  const hasActiveState = /:active\s*\{[^}]*transform\s*:\s*scale/i.test(allCss);
  addCheck(
    'Touch UX',
    'Tactile Button Press Feedback (:active scale)',
    hasActiveState,
    hasActiveState
      ? 'Buttons provide physical scale feedback on :active press'
      : 'Add :active { transform: scale(0.96) } on buttons/FABs for tactile field feedback'
  );

  const hasBottomSheet = /\.sheet\b|bottom-sheet/i.test(allCss);
  addCheck(
    'Thumb Zone',
    'Bottom Sheet Pattern (.sheet)',
    hasBottomSheet,
    hasBottomSheet
      ? 'Sliding bottom sheet architecture detected for one-handed thumb reach'
      : 'Consider sliding bottom sheets instead of center modals for mobile workflows'
  );

  // Scan CSS rules for button/interactive classes with small width/height (< 36px)
  const cleanCss = allCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let match;
  const zIndexSet = new Set();
  while ((match = ruleRegex.exec(cleanCss)) !== null) {
    const selector = match[1].trim().replace(/\s+/g, ' ');
    const body = match[2];

    const zMatch = body.match(/z-index\s*:\s*(-?\d+)/i);
    if (zMatch) {
      zIndexSet.add(`${zMatch[1]} (${selector})`);
    }

    if (/btn|button|fab|tab|pill|chip|close/i.test(selector) && !/:after|:before|\bsvg\b|dot|badge|icon/i.test(selector)) {
      const wMatch = body.match(/(?:^|;|\s)width\s*:\s*(\d+)px/i);
      const hMatch = body.match(/(?:^|;|\s)height\s*:\s*(\d+)px/i);
      const w = wMatch ? parseInt(wMatch[1], 10) : null;
      const h = hMatch ? parseInt(hMatch[1], 10) : null;
      if ((w !== null && w < 36) || (h !== null && h < 36)) {
        report.metrics.smallTouchTargets.push({
          selector,
          width: w ? `${w}px` : 'auto',
          height: h ? `${h}px` : 'auto',
          recommendation: 'Material Design 3 recommends >= 48x48dp (or >= 36px compact with 8px spacing)',
        });
      }
    }
  }

  report.metrics.zIndexLayers = Array.from(zIndexSet).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  addCheck(
    'Touch Targets',
    'Interactive Target Size Audit (>= 36px compact / 48dp standard)',
    report.metrics.smallTouchTargets.length === 0,
    report.metrics.smallTouchTargets.length === 0
      ? 'No undersized interactive button selectors (<36px) detected'
      : `${report.metrics.smallTouchTargets.length} compact selector(s) under 36px detected: ${report.metrics.smallTouchTargets
          .map((t) => `${t.selector} [${t.width}x${t.height}]`)
          .join(', ')}`
  );
}

if (jsonMode) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`=== Android & Field Mobile UI/UX Audit ===`);
  console.log(`Directory : ${report.appDir}`);
  console.log(`Files     : ${report.htmlFiles.join(', ')} | ${report.cssFiles.join(', ')}\n`);
  for (const c of report.checks) {
    const icon = c.passed ? '[PASS]' : '[WARN]';
    console.log(`${icon} [${c.category}] ${c.name}`);
    console.log(`       ${c.detail}`);
  }
  if (report.metrics.zIndexLayers.length > 0) {
    console.log(`\nZ-Index Stack Order (low -> high):`);
    for (const z of report.metrics.zIndexLayers) {
      console.log(`  - ${z}`);
    }
  }
}
