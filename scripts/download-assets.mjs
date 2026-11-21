// Downloads every Figma asset in src/assets/assets.js into public/assets and rewrites
// src/assets/assets.js to use the local copies. Run once:  npm run assets
import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('src/assets/assets.js')
let text = fs.readFileSync(file, 'utf8')
const out = path.resolve('public/assets')
fs.mkdirSync(out, { recursive: true })

const re = /(\w+): F \+ '([0-9a-f-]+)\.(svg|png)'/g
const found = [...text.matchAll(re)]
if (!found.length) { console.log('No remote assets found (already local?).'); process.exit(0) }

for (const [full, key, id, ext] of found) {
  const res = await fetch(`https://www.figma.com/api/mcp/asset/${id}.${ext}`)
  if (!res.ok) { console.error(`FAILED ${key} (${res.status}) – URL may have expired`); process.exit(1) }
  fs.writeFileSync(path.join(out, `${key}.${ext}`), Buffer.from(await res.arrayBuffer()))
  text = text.replace(full, `${key}: '/assets/${key}.${ext}'`)
  console.log('saved', `${key}.${ext}`)
}
fs.writeFileSync(file, text)
console.log('Done – src/assets/assets.js now uses local files.')
