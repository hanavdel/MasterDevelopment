'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { buildSnapshot } = require('./lib/snapshot-builder');

const WEB_ROOT = path.join(__dirname, '..', '..');
const DASHBOARD_DIR = __dirname;
const MD_ROOT = path.join(WEB_ROOT, 'MasterDevelopment');
const PORT = Number(process.env.PORT || process.env.HTTP_PLATFORM_PORT || process.env.IISNODE_HTTP_PORT || 3282);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const NO_CACHE = new Set(['.html', '.js', '.css', '.json']);

function readTextKey(key) {
  try {
    if (key === 'WORK_QUEUE.md') return fs.readFileSync(path.join(MD_ROOT, 'WORK_QUEUE.md'), 'utf8');
    if (key === 'SCAN_LOG.md') return fs.readFileSync(path.join(MD_ROOT, 'SCAN_LOG.md'), 'utf8');
    return fs.readFileSync(path.join(WEB_ROOT, key), 'utf8');
  } catch {
    return null;
  }
}

function getSnapshot() {
  return buildSnapshot(readTextKey);
}

function resolveStatic(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  if (clean === '/' || clean === '') {
    return { file: path.join(DASHBOARD_DIR, 'index.html'), monorepoRoot: true };
  }

  const dashRel = clean.replace(/^\//, '').replace(/\//g, path.sep);
  const dashFile = path.join(DASHBOARD_DIR, dashRel);
  if (dashFile.startsWith(DASHBOARD_DIR + path.sep) && fs.existsSync(dashFile) && fs.statSync(dashFile).isFile()) {
    return { file: dashFile, monorepoRoot: false };
  }

  if (clean.toLowerCase().startsWith('/repo/')) {
    const rel = clean.slice(6).replace(/^\//, '').replace(/\//g, path.sep);
    return { file: path.join(WEB_ROOT, rel), monorepoRoot: true };
  }
  if (clean.toLowerCase().startsWith('/coord/')) {
    const rel = clean.slice(7).replace(/^\//, '').replace(/\//g, path.sep);
    return { file: path.join(MD_ROOT, rel), monorepoRoot: false };
  }
  if (clean.toLowerCase().startsWith('/dashboard/')) {
    return { file: path.join(DASHBOARD_DIR, clean.slice(10).replace(/\//g, path.sep)), monorepoRoot: false };
  }
  if (clean.toLowerCase().startsWith('/masterdevelopment/dashboard/')) {
    return { file: path.join(DASHBOARD_DIR, clean.slice(28).replace(/\//g, path.sep)), monorepoRoot: false };
  }
  if (clean.toLowerCase().startsWith('/_masterdevelopment/dashboard/')) {
    return { file: path.join(DASHBOARD_DIR, clean.slice(28).replace(/\//g, path.sep)), monorepoRoot: false };
  }
  return { file: path.join(WEB_ROOT, dashRel), monorepoRoot: true };
}

function isAllowed(filePath) {
  const roots = [DASHBOARD_DIR, WEB_ROOT];
  return roots.some((root) => filePath === root || filePath.startsWith(root + path.sep));
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (req.method === 'GET' && urlPath === '/api/dashboard/snapshot') {
    const body = JSON.stringify(getSnapshot(), null, 0);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(body);
    return;
  }

  const resolved = resolveStatic(urlPath);
  const filePath = resolved.file;
  if (!isAllowed(filePath)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    if (NO_CACHE.has(ext)) {
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
    }
    if (ext === '.html' && path.basename(filePath) === 'index.html') {
      data = Buffer.from(
        data
          .toString()
          .replace('data-web-base="../.."', 'data-web-base=""')
          .replace('data-load-mode="iis"', 'data-load-mode="node"')
      );
    } else if (ext === '.html' && resolved.monorepoRoot) {
      data = Buffer.from(
        data.toString().replace('data-web-base="../.."', 'data-web-base=""')
      );
    }
    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Master Development Dashboard → http://127.0.0.1:${PORT}/`);
  console.log(`API snapshot → /api/dashboard/snapshot`);
  if (Number(PORT) === 3283) {
    console.log(`(IIS statik 3282 + API 3283 modu — tarayıcı otomatik dener)`);
  }
});
