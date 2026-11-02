// Serveur statique minimal pour comparer visuellement avec l'export Webflow (/reference).
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../reference/kosmo-site-export/', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.ico': 'image/x-icon' };

http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/kosmocgi.webflow.io/index.html';
  const file = normalize(join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const s = await stat(file);
    const f = s.isDirectory() ? join(file, 'index.html') : file;
    res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' });
    let body = await readFile(f);
    // L'export a réécrit les chemins des fichiers : les empreintes SRI ne correspondent plus.
    if (extname(f) === '.html') body = body.toString().replace(/ integrity="[^"]*"/g, '');
    res.end(body);
  } catch { res.writeHead(404).end('not found'); }
}).listen(4400, () => console.log('reference on http://localhost:4400'));
