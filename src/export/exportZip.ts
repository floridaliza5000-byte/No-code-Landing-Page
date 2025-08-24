import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { Theme } from '../App'
import type { BlockInstance, BlockDefinition } from '../blocks/blocks'
import { BLOCKS } from '../blocks/blocks'

export interface ProjectData {
  title: string
  theme: Theme
  blocks: BlockInstance[]
  seo?: {
    title: string
    description: string
    ogImage?: string
  }
}

const exportedCss = `/* Exported styles */
:root{
  --bg: #0f172a;
  --text: #e2e8f0;
  --primary: #3b82f6;
  --secondary: #10b981;
  --font: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--text);font-family:var(--font);-webkit-font-smoothing:antialiased}
main{max-width:1100px;margin:0 auto;padding:40px 20px}
section{margin:56px 0}
.b-hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:72px 12px}
.b-hero .eyebrow{color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;font-size:.85rem}
.b-hero h1{font-size:2.4rem;margin:0}
.b-hero .subtitle{max-width:800px;color:#cbd5e1}
.btn{display:inline-block;padding:12px 18px;border-radius:10px;color:white;text-decoration:none;font-weight:600}
.b-features h2,.b-gallery h2,.b-testimonials h2,.b-pricing h2,.b-contact h2{font-size:1.6rem;margin:0 0 16px}
.b-features .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.b-features .card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);padding:16px;border-radius:12px}
.b-gallery .masonry{columns:3 280px;column-gap:12px}
.b-gallery img{width:100%;margin:0 0 12px;border-radius:10px}
.b-testimonials .list{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.b-testimonials blockquote{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);padding:16px;border-radius:12px}
.b-testimonials cite{display:block;margin-top:8px;color:#94a3b8}
.b-pricing .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.b-pricing .plan{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);padding:16px;border-radius:12px;display:flex;flex-direction:column;gap:10px}
.b-pricing .plan.highlight{outline:2px solid var(--secondary)}
.b-pricing .name{font-weight:700}
.b-pricing .price{font-size:1.8rem}
.b-contact .sub{color:#94a3b8}
.b-contact .form{display:flex;flex-direction:column;gap:10px;max-width:560px}
.b-contact input,.b-contact textarea{padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.02);color:var(--text)}
.b-contact button{padding:12px 16px;border:none;border-radius:10px;color:white;font-weight:600}
footer{max-width:1100px;margin:40px auto 20px;color:#94a3b8;padding:0 20px}
`;

function fontPrimaryName(fontFamily: string){
  // Extract the first family token before the comma
  const first = (fontFamily || '').split(',')[0].trim()
  return first.replace(/^"|"$/g,'')
}

function googleFontsHrefFor(fontFamily: string){
  const family = fontPrimaryName(fontFamily)
  const map: Record<string,string> = {
    'Inter': 'Inter:wght@400;600;800',
    'Poppins': 'Poppins:wght@400;600;800',
    'Roboto': 'Roboto:wght@400;700',
    'Montserrat': 'Montserrat:wght@400;700;900',
    'Lato': 'Lato:wght@400;700;900',
    'Open Sans': 'Open+Sans:wght@400;700;800',
    'Playfair Display': 'Playfair+Display:wght@400;700;900',
  }
  const spec = map[family] || 'Inter:wght@400;600;800'
  return `https://fonts.googleapis.com/css2?family=${spec}&display=swap`
}

function htmlDoc(title: string, theme: Theme, bodyHtml: string, seo?: ProjectData['seo']){
  // Inject theme as CSS variables on :root
  const themeVars = `:root{--bg:${theme.bg};--text:${theme.text};--primary:${theme.primary};--secondary:${theme.secondary};--font:${theme.fontFamily}}`;
  const metaDesc = seo?.description ? `    <meta name="description" content="${escapeAttr(seo.description)}" />\n` : ''
  const ogTitle = `    <meta property="og:title" content="${escapeAttr(seo?.title || title)}" />\n`
  const ogDesc = seo?.description ? `    <meta property=\"og:description\" content=\"${escapeAttr(seo.description)}\" />\n` : ''
  const ogImage = seo?.ogImage ? `    <meta property=\"og:image\" content=\"${escapeAttr(seo.ogImage)}\" />\n` : ''
  const fontHref = googleFontsHrefFor(theme.fontFamily)
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(seo?.title || title)}</title>
${metaDesc}${ogTitle}${ogDesc}${ogImage}    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${fontHref}" rel="stylesheet">
    <link rel="stylesheet" href="styles.css" />
    <style>${themeVars}</style>
  </head>
  <body>
    <main>
${bodyHtml}
    </main>
    <footer>Built with Landing Blocks — static export</footer>
  </body>
</html>`
}

const escapeHtml = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
const escapeAttr = (s: string) => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')

function deepClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)) }

function collectAndReplaceDataUrls(obj: any, adder: (mimeExt: string, data: string)=> string): any {
  if(obj==null) return obj
  if(typeof obj === 'string'){
    if(obj.startsWith('data:image/')){
      // data:image/png;base64,....
      const match = obj.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
      if(match){
        const mime = match[1]
        const data = match[2]
        const ext = mime.split('/')[1] || 'png'
        return adder(ext, data)
      }
    }
    return obj
  }
  if(Array.isArray(obj)) return obj.map(v=> collectAndReplaceDataUrls(v, adder))
  if(typeof obj === 'object'){
    const out: any = {}
    for(const k of Object.keys(obj)){
      out[k] = collectAndReplaceDataUrls(obj[k], adder)
    }
    return out
  }
  return obj
}

type ExportOptions = {
  optimizeImages?: boolean
  maxWidth?: number // px
  quality?: number // 0..1
}

async function optimizeDataImage(dataUrl: string, maxWidth: number, quality: number): Promise<{ ext: string; base64: string }>{
  return new Promise((resolve)=>{
    const img = new Image()
    img.onload = ()=>{
      const w = img.naturalWidth
      const h = img.naturalHeight
      const scale = w>maxWidth ? maxWidth / w : 1
      const outW = Math.max(1, Math.round(w*scale))
      const outH = Math.max(1, Math.round(h*scale))
      const canvas = document.createElement('canvas')
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, outW, outH)
      // Prefer WebP, fallback to JPEG where not supported
      const mime = 'image/webp'
      let out = canvas.toDataURL(mime, quality)
      if(!out.startsWith('data:image/webp')){
        out = canvas.toDataURL('image/jpeg', quality)
      }
      const m = out.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
      if(m){
        const ext = m[1].split('/')[1] || 'png'
        resolve({ ext, base64: m[2] })
      } else {
        // Fallback to original if parse failed
        const orig = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
        resolve({ ext: orig? (orig[1].split('/')[1] || 'png'):'png', base64: orig? orig[2]: '' })
      }
    }
    img.onerror = ()=>{
      const orig = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
      resolve({ ext: orig? (orig[1].split('/')[1] || 'png'):'png', base64: orig? orig[2]: '' })
    }
    img.src = dataUrl
  })
}

async function collectAndReplaceDataUrlsAsync(obj: any, adder: (mimeExt: string, data: string)=> Promise<string>, optimize: boolean, maxWidth: number, quality: number): Promise<any> {
  if(obj==null) return obj
  if(typeof obj === 'string'){
    if(obj.startsWith('data:image/')){
      const match = obj.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
      if(match){
        if(optimize){
          const { ext, base64 } = await optimizeDataImage(obj, maxWidth, quality)
          return await adder(ext, base64)
        } else {
          const mime = match[1]
          const data = match[2]
          const ext = mime.split('/')[1] || 'png'
          return await adder(ext, data)
        }
      }
    }
    return obj
  }
  if(Array.isArray(obj)){
    const out: any[] = []
    for(const v of obj){ out.push(await collectAndReplaceDataUrlsAsync(v, adder, optimize, maxWidth, quality)) }
    return out
  }
  if(typeof obj === 'object'){
    const out: any = {}
    for(const k of Object.keys(obj)){
      out[k] = await collectAndReplaceDataUrlsAsync(obj[k], adder, optimize, maxWidth, quality)
    }
    return out
  }
  return obj
}

export async function exportProjectAsZip(project: ProjectData, options: ExportOptions = {}){
  const zip = new JSZip()

  // Build body HTML from blocks
  let assetIndex = 1
  const addAsset = (ext: string, base64Data: string) => {
    const filename = `assets/image-${assetIndex++}.${ext}`
    zip.file(filename, base64Data, { base64: true })
    return filename
  }

  const optimize = !!options.optimizeImages
  const maxWidth = options.maxWidth ?? 1600
  const quality = options.quality ?? 0.82

  const blocksForExport: typeof project.blocks = []
  for(const b of project.blocks){
    const cloned = deepClone(b)
    cloned.props = await collectAndReplaceDataUrlsAsync(cloned.props, async (ext, data)=> addAsset(ext, data), optimize, maxWidth, quality)
    blocksForExport.push(cloned)
  }

  const sections = blocksForExport.map(b=>{
    const def: BlockDefinition | undefined = BLOCKS.find(d=> d.type===b.type)
    if(!def) return ''
    return def.toHTML(b.props as any, project.theme)
  }).join('\n\n')

  const indexHtml = htmlDoc(project.title, project.theme, sections, project.seo)

  zip.file('index.html', indexHtml)
  zip.file('styles.css', exportedCss)
  zip.folder('assets') // ensure folder exists if images added
  zip.file('README.txt', `Exported from Landing Blocks\nOpen index.html in your browser or host on any static server.\nAssets are located in /assets if you uploaded images.`)

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${sanitizeFilename(project.title || 'landing')}.zip`)
}

function sanitizeFilename(name: string){
  return name.replace(/[^a-z0-9\-\_\s]/gi, '').trim().replace(/\s+/g,'-').toLowerCase() || 'landing'
}
