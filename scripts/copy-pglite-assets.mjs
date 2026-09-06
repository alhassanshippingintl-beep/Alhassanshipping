import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const dests = [
  join(root, ".vercel/output/functions/__server.func/_libs"),
  join(root, ".vercel/output/functions/__server.func"),
];
const files = ["pglite.data", "pglite.wasm", "initdb.wasm"];

for (const dest of dests) {
  mkdirSync(dest, { recursive: true });
  for (const name of files) {
    const from = join(srcDir, name);
    if (!existsSync(from)) continue;
    copyFileSync(from, join(dest, name));
  }
}

console.log("[copy-pglite] bundled pglite data into Vercel function output");
