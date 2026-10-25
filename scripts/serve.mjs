// Zero-dependency loopback-only static server. Never binds a public network interface.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, normalize, extname, sep, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const types = {".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".md":"text/plain; charset=utf-8"};
const port = Number(process.env.PORT || 8080);
const server = createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {res.writeHead(405).end();return;}
    const raw = decodeURIComponent((req.url || "/").split("?")[0]);
    const path = normalize(join(root, raw === "/" ? "index.html" : raw.replace(/^\/+/, "")));
    if (path !== root && !path.startsWith(root + sep)) {res.writeHead(403).end();return;}
    if (raw.includes("\\") || raw.split("/").some(p => p.startsWith(".")) || !types[extname(path)]) {res.writeHead(404).end();return;}
    const file = await stat(path);
    if (!file.isFile()) {res.writeHead(404).end();return;}
    const bytes = await readFile(path);
    res.writeHead(200,{"Content-Type":types[extname(path)],"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; style-src 'self'; script-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"});
    res.end(req.method === "HEAD" ? undefined : bytes);
  } catch {res.writeHead(404).end("Not found");}
});
server.listen(port,"127.0.0.1",()=>console.log("MSyoU local demo: http://127.0.0.1:"+port));
