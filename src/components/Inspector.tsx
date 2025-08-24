import React from 'react'
import type { BlockInstance } from '../blocks/blocks'
import type { Seo } from '../App'

export function Inspector({ block, onChange, seo, onSeoChange }:{ block: BlockInstance | null; onChange: (props:any)=>void; seo: Seo; onSeoChange: (s: Seo)=>void }){
  if(!block){
    return (
      <div className="inspector-pane">
        <div className="title">SEO & Meta</div>
        <label className="field">
          <div className="label">Page Title</div>
          <input value={seo.title} onChange={e=> onSeoChange({ ...seo, title: e.target.value })} />
        </label>
        <label className="field">
          <div className="label">Description</div>
          <textarea rows={4} value={seo.description} onChange={e=> onSeoChange({ ...seo, description: e.target.value })} />
        </label>
        <label className="field">
          <div className="label">OG Image URL (optional)</div>
          <input value={seo.ogImage ?? ''} onChange={e=> onSeoChange({ ...seo, ogImage: e.target.value })} />
        </label>
        <div className="muted">Select a block to edit its content with forms, or keep editing SEO here.</div>
      </div>
    )
  }

  // Helper renderers per block type
  function renderHero(){
    const p = block.props as any
    return (
      <>
        <label className="field"><div className="label">Eyebrow</div><input value={p.eyebrow} onChange={e=> onChange({ ...p, eyebrow: e.target.value })} /></label>
        <label className="field"><div className="label">Title</div><input value={p.title} onChange={e=> onChange({ ...p, title: e.target.value })} /></label>
        <label className="field"><div className="label">Subtitle</div><textarea rows={3} value={p.subtitle} onChange={e=> onChange({ ...p, subtitle: e.target.value })} /></label>
        <label className="field"><div className="label">CTA Text</div><input value={p.ctaText} onChange={e=> onChange({ ...p, ctaText: e.target.value })} /></label>
        <label className="field"><div className="label">CTA Link</div><input value={p.ctaLink} onChange={e=> onChange({ ...p, ctaLink: e.target.value })} /></label>
      </>
    )
  }

  function renderFeatures(){
    const p = block.props as any
    return (
      <>
        <label className="field"><div className="label">Heading</div><input value={p.heading} onChange={e=> onChange({ ...p, heading: e.target.value })} /></label>
        <div className="label" style={{ marginTop:8 }}>Items</div>
        {p.items.map((it: any, i: number)=> (
          <div key={i} className="field" style={{ border:'1px solid rgba(255,255,255,.12)', padding:8, borderRadius:8 }}>
            <label className="field"><div className="label">Title</div><input value={it.title} onChange={e=>{
              const items = p.items.slice(); items[i] = { ...it, title: e.target.value }; onChange({ ...p, items })
            }} /></label>
            <label className="field"><div className="label">Text</div><input value={it.text} onChange={e=>{
              const items = p.items.slice(); items[i] = { ...it, text: e.target.value }; onChange({ ...p, items })
            }} /></label>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>{ const items = p.items.filter((_:any, idx:number)=> idx!==i); onChange({ ...p, items }) }}>Remove</button>
              <button onClick={()=>{ const items = p.items.slice(); items.splice(i+1,0,{ title:'New feature', text:'Describe it' }); onChange({ ...p, items }) }}>Add Below</button>
            </div>
          </div>
        ))}
        <button onClick={()=> onChange({ ...p, items: [...p.items, { title:'New feature', text:'Describe it' }] })}>Add Item</button>
      </>
    )
  }

  function renderGallery(){
    const p = block.props as any
    return (
      <>
        <label className="field"><div className="label">Heading</div><input value={p.heading} onChange={e=> onChange({ ...p, heading: e.target.value })} /></label>
        <div className="label" style={{ marginTop:8 }}>Image URLs</div>
        {p.images.map((src: string, i: number)=> (
          <div key={i} className="field" style={{ display:'flex', gap:6 }}>
            <input style={{ flex:1 }} value={src} onChange={e=>{ const images = p.images.slice(); images[i] = e.target.value; onChange({ ...p, images }) }} />
            <button onClick={()=>{ const images = p.images.filter((_:any, idx:number)=> idx!==i); onChange({ ...p, images }) }}>Remove</button>
          </div>
        ))}
        <div style={{ display:'flex', gap:8, marginTop:8 }}>
          <button onClick={()=> onChange({ ...p, images: [...p.images, 'https://picsum.photos/seed/new/640/400'] })}>Add Image by URL</button>
          <label className="button" style={{ cursor:'pointer' }}>
            Upload Images
            <input type="file" accept="image/*" multiple style={{ display:'none' }} onChange={async (e)=>{
              const files = Array.from(e.target.files || [])
              if(files.length===0) return
              const toDataUrl = (file: File) => new Promise<string>((resolve, reject)=>{
                const fr = new FileReader()
                fr.onload = ()=> resolve(String(fr.result))
                fr.onerror = reject
                fr.readAsDataURL(file)
              })
              const urls: string[] = []
              for(const f of files){
                try{ urls.push(await toDataUrl(f)) }catch{}
              }
              onChange({ ...p, images: [...p.images, ...urls] })
              e.currentTarget.value = '' // reset
            }} />
          </label>
        </div>
      </>
    )
  }

  function renderTestimonials(){
    const p = block.props as any
    return (
      <>
        <label className="field"><div className="label">Heading</div><input value={p.heading} onChange={e=> onChange({ ...p, heading: e.target.value })} /></label>
        {p.items.map((it: any, i: number)=> (
          <div key={i} className="field" style={{ border:'1px solid rgba(255,255,255,.12)', padding:8, borderRadius:8 }}>
            <label className="field"><div className="label">Quote</div><textarea rows={2} value={it.quote} onChange={e=>{ const items=p.items.slice(); items[i]={ ...it, quote:e.target.value }; onChange({ ...p, items }) }} /></label>
            <label className="field"><div className="label">Author</div><input value={it.author} onChange={e=>{ const items=p.items.slice(); items[i]={ ...it, author:e.target.value }; onChange({ ...p, items }) }} /></label>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>{ const items = p.items.filter((_:any, idx:number)=> idx!==i); onChange({ ...p, items }) }}>Remove</button>
              <button onClick={()=>{ const items = p.items.slice(); items.splice(i+1,0,{ quote:'Great!', author:'User' }); onChange({ ...p, items }) }}>Add Below</button>
            </div>
          </div>
        ))}
        <button onClick={()=> onChange({ ...p, items: [...p.items, { quote:'Great!', author:'User' }] })}>Add Testimonial</button>
      </>
    )
  }

  function renderPricing(){
    const p = block.props as any
    return (
      <>
        <label className="field"><div className="label">Heading</div><input value={p.heading} onChange={e=> onChange({ ...p, heading: e.target.value })} /></label>
        {p.plans.map((pl: any, i: number)=> (
          <div key={i} className="field" style={{ border:'1px solid rgba(255,255,255,.12)', padding:8, borderRadius:8 }}>
            <label className="field"><div className="label">Name</div><input value={pl.name} onChange={e=>{ const plans=p.plans.slice(); plans[i]={ ...pl, name:e.target.value }; onChange({ ...p, plans }) }} /></label>
            <label className="field"><div className="label">Price</div><input value={pl.price} onChange={e=>{ const plans=p.plans.slice(); plans[i]={ ...pl, price:e.target.value }; onChange({ ...p, plans }) }} /></label>
            <label className="field"><div className="label">CTA Text</div><input value={pl.ctaText} onChange={e=>{ const plans=p.plans.slice(); plans[i]={ ...pl, ctaText:e.target.value }; onChange({ ...p, plans }) }} /></label>
            <label className="field"><div className="label">CTA Link</div><input value={pl.ctaLink} onChange={e=>{ const plans=p.plans.slice(); plans[i]={ ...pl, ctaLink:e.target.value }; onChange({ ...p, plans }) }} /></label>
            <label className="field"><div className="label">Highlight</div><input type="checkbox" checked={!!pl.highlight} onChange={e=>{ const plans=p.plans.slice(); plans[i]={ ...pl, highlight:e.target.checked }; onChange({ ...p, plans }) }} /></label>
            <div className="label">Features</div>
            {(pl.features||[]).map((f:string, fi:number)=> (
              <div key={fi} className="field" style={{ display:'flex', gap:6 }}>
                <input style={{ flex:1 }} value={f} onChange={e=>{ const plans=p.plans.slice(); const fs = (plans[i].features||[]).slice(); fs[fi]=e.target.value; plans[i] = { ...plans[i], features: fs }; onChange({ ...p, plans }) }} />
                <button onClick={()=>{ const plans=p.plans.slice(); const fs=(plans[i].features||[]).filter((_:any,idx:number)=> idx!==fi); plans[i]={ ...plans[i], features: fs }; onChange({ ...p, plans }) }}>Remove</button>
              </div>
            ))}
            <button onClick={()=>{ const plans=p.plans.slice(); const fs=(plans[i].features||[]).slice(); fs.push('New feature'); plans[i]={ ...plans[i], features: fs }; onChange({ ...p, plans }) }}>Add Feature</button>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <button onClick={()=>{ const plans = p.plans.filter((_:any, idx:number)=> idx!==i); onChange({ ...p, plans }) }}>Remove Plan</button>
              <button onClick={()=>{ const plans = p.plans.slice(); plans.splice(i+1,0,{ name:'New', price:'$0', features:['Feature'], ctaText:'Choose', ctaLink:'#' }); onChange({ ...p, plans }) }}>Add Plan Below</button>
            </div>
          </div>
        ))}
        <button onClick={()=> onChange({ ...p, plans: [...p.plans, { name:'New', price:'$0', features:['Feature'], ctaText:'Choose', ctaLink:'#' }] })}>Add Plan</button>
      </>
    )
  }

  function renderContact(){
    const p = block.props as any
    return (
      <>
        <label className="field"><div className="label">Heading</div><input value={p.heading} onChange={e=> onChange({ ...p, heading: e.target.value })} /></label>
        <label className="field"><div className="label">Subtext</div><textarea rows={3} value={p.subtext} onChange={e=> onChange({ ...p, subtext: e.target.value })} /></label>
        <label className="field"><div className="label">Email To (for docs)</div><input value={p.emailTo||''} onChange={e=> onChange({ ...p, emailTo: e.target.value })} /></label>
        <label className="field"><div className="label">Form Handler</div>
          <select value={p.handler || 'none'} onChange={e=> onChange({ ...p, handler: e.target.value })}>
            <option value="none">None (static demo)</option>
            <option value="formspree">Formspree</option>
            <option value="netlify">Netlify Forms</option>
          </select>
        </label>
        {p.handler==='formspree' && (
          <label className="field"><div className="label">Formspree Form ID</div><input placeholder="e.g. abcdwxyz" value={p.formspreeId||''} onChange={e=> onChange({ ...p, formspreeId: e.target.value })} /></label>
        )}
        <label className="field"><div className="label">Success Redirect (optional)</div><input placeholder="https://..." value={p.successRedirect||''} onChange={e=> onChange({ ...p, successRedirect: e.target.value })} /></label>
        <div className="help">Export note: Formspree requires a valid form ID. Netlify requires hosting on Netlify with forms enabled.</div>
      </>
    )
  }

  const title = block.type.charAt(0).toUpperCase() + block.type.slice(1)
  return (
    <div className="inspector-pane">
      <div className="title">Inspector</div>
      <div className="muted">Editing: <strong>{title}</strong></div>

      {block.type==='hero' && renderHero()}
      {block.type==='features' && renderFeatures()}
      {block.type==='gallery' && renderGallery()}
      {block.type==='testimonials' && renderTestimonials()}
      {block.type==='pricing' && renderPricing()}
      {block.type==='contact' && renderContact()}

      <div className="field">
        <div className="label">Advanced: Raw JSON</div>
        <textarea className="code" rows={12} value={JSON.stringify(block.props, null, 2)} onChange={e=>{
          const text = e.target.value
          try { onChange(JSON.parse(text)) } catch {}
        }} />
      </div>
    </div>
  )
}
