import React from 'react'
import type { Theme } from '../App'

export type BlockType = 'hero' | 'features' | 'gallery' | 'testimonials' | 'pricing' | 'contact'

export interface BlockDefinition<P = any> {
  type: BlockType
  label: string
  createDefaultProps: () => P
  render: (props: P, theme: Theme) => React.ReactNode
  toHTML: (props: P, theme: Theme) => string
}

export interface BlockInstance<P = any> {
  id: string
  type: BlockType
  props: P
}

// Utilities
const escapeHtml = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')

// Hero
type HeroProps = { eyebrow: string; title: string; subtitle: string; ctaText: string; ctaLink: string }
const Hero: BlockDefinition<HeroProps> = {
  type: 'hero',
  label: 'Hero',
  createDefaultProps: () => ({
    eyebrow: 'Introducing',
    title: 'Build beautiful pages fast',
    subtitle: 'A no‑code landing page/portfolio builder with exportable HTML/CSS',
    ctaText: 'Get Started',
    ctaLink: '#contact',
  }),
  render: (p, theme) => (
    <section className="b-hero">
      <div className="eyebrow">{p.eyebrow}</div>
      <h1>{p.title}</h1>
      <p className="subtitle">{p.subtitle}</p>
      <a className="btn" href={p.ctaLink} style={{ background: theme.primary }}> {p.ctaText} </a>
    </section>
  ),
  toHTML: (p, theme) => `
<section class="b-hero">
  <div class="eyebrow">${escapeHtml(p.eyebrow)}</div>
  <h1>${escapeHtml(p.title)}</h1>
  <p class="subtitle">${escapeHtml(p.subtitle)}</p>
  <a class="btn" href="${escapeHtml(p.ctaLink)}" style="background:${theme.primary}">${escapeHtml(p.ctaText)}</a>
</section>`
}

// Features
type Feature = { title: string; text: string }
type FeaturesProps = { heading: string; items: Feature[] }
const Features: BlockDefinition<FeaturesProps> = {
  type: 'features',
  label: 'Features',
  createDefaultProps: () => ({
    heading: 'Why choose this?',
    items: [
      { title: 'No‑Code', text: 'Assemble sections and export static HTML/CSS.' },
      { title: 'Beautiful', text: 'Modern, responsive, themeable components.' },
      { title: 'Portable', text: 'No backend required. Works anywhere.' },
    ],
  }),
  render: (p) => (
    <section className="b-features">
      <h2>{p.heading}</h2>
      <div className="grid">
        {p.items.map((it, i)=> (
          <div className="card" key={i}>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  ),
  toHTML: (p) => `
<section class="b-features">
  <h2>${escapeHtml(p.heading)}</h2>
  <div class="grid">
    ${p.items.map(it => `
    <div class="card">
      <h3>${escapeHtml(it.title)}</h3>
      <p>${escapeHtml(it.text)}</p>
    </div>`).join('\n')}
  </div>
</section>`
}

// Gallery
type GalleryProps = { heading: string; images: string[] }
const Gallery: BlockDefinition<GalleryProps> = {
  type: 'gallery',
  label: 'Gallery',
  createDefaultProps: () => ({
    heading: 'Showcase',
    images: [
      'https://picsum.photos/seed/a/640/400',
      'https://picsum.photos/seed/b/640/400',
      'https://picsum.photos/seed/c/640/400',
      'https://picsum.photos/seed/d/640/400',
      'https://picsum.photos/seed/e/640/400',
      'https://picsum.photos/seed/f/640/400'
    ],
  }),
  render: (p) => (
    <section className="b-gallery">
      <h2>{p.heading}</h2>
      <div className="masonry">
        {p.images.map((src,i)=> <img key={i} src={src} alt="" />)}
      </div>
    </section>
  ),
  toHTML: (p) => `
<section class="b-gallery">
  <h2>${escapeHtml(p.heading)}</h2>
  <div class="masonry">
    ${p.images.map(src=> `<img src="${escapeHtml(src)}" alt="" />`).join('\n')}
  </div>
</section>`
}

// Testimonials
type Testimonial = { quote: string; author: string }
type TestimonialsProps = { heading: string; items: Testimonial[] }
const Testimonials: BlockDefinition<TestimonialsProps> = {
  type: 'testimonials',
  label: 'Testimonials',
  createDefaultProps: () => ({
    heading: 'What users say',
    items: [
      { quote: 'Exactly what I needed to launch quickly.', author: 'Sofia' },
      { quote: 'Clean export and easy to customize.', author: 'Liam' },
    ],
  }),
  render: (p) => (
    <section className="b-testimonials">
      <h2>{p.heading}</h2>
      <div className="list">
        {p.items.map((t,i)=> (
          <blockquote key={i}>
            <p>“{t.quote}”</p>
            <cite>— {t.author}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  ),
  toHTML: (p) => `
<section class="b-testimonials">
  <h2>${escapeHtml(p.heading)}</h2>
  <div class="list">
    ${p.items.map(t=> `
    <blockquote>
      <p>“${escapeHtml(t.quote)}”</p>
      <cite>— ${escapeHtml(t.author)}</cite>
    </blockquote>`).join('\n')}
  </div>
</section>`
}

// Pricing
type Plan = { name: string; price: string; features: string[]; highlight?: boolean; ctaText: string; ctaLink: string }
type PricingProps = { heading: string; plans: Plan[] }
const Pricing: BlockDefinition<PricingProps> = {
  type: 'pricing',
  label: 'Pricing',
  createDefaultProps: () => ({
    heading: 'Pricing',
    plans: [
      { name: 'Starter', price: '$9', features: ['1 project', 'Basic support'], ctaText: 'Choose Starter', ctaLink: '#contact' },
      { name: 'Pro', price: '$29', features: ['Unlimited', 'Priority support'], highlight: true, ctaText: 'Choose Pro', ctaLink: '#contact' },
      { name: 'Team', price: '$79', features: ['Team access', 'SSO'], ctaText: 'Contact Sales', ctaLink: '#contact' },
    ],
  }),
  render: (p, theme) => (
    <section className="b-pricing">
      <h2>{p.heading}</h2>
      <div className="plans">
        {p.plans.map((pl,i)=> (
          <div className={"plan" + (pl.highlight? ' highlight':'')} key={i}>
            <div className="name">{pl.name}</div>
            <div className="price">{pl.price}</div>
            <ul>
              {pl.features.map((f,fi)=> <li key={fi}>{f}</li>)}
            </ul>
            <a className="btn" href={pl.ctaLink} style={{ background: pl.highlight? theme.secondary: theme.primary }}>{pl.ctaText}</a>
          </div>
        ))}
      </div>
    </section>
  ),
  toHTML: (p, theme) => `
<section class="b-pricing">
  <h2>${escapeHtml(p.heading)}</h2>
  <div class="plans">
    ${p.plans.map(pl=> `
    <div class="plan${pl.highlight? ' highlight':''}">
      <div class="name">${escapeHtml(pl.name)}</div>
      <div class="price">${escapeHtml(pl.price)}</div>
      <ul>
        ${pl.features.map(f=> `<li>${escapeHtml(f)}</li>`).join('')}
      </ul>
      <a class="btn" href="${escapeHtml(pl.ctaLink)}" style="background:${pl.highlight? theme.secondary: theme.primary}">${escapeHtml(pl.ctaText)}</a>
    </div>`).join('\n')}
  </div>
</section>`
}

// Contact
type ContactProps = { heading: string; subtext: string; emailTo?: string; handler?: 'none'|'formspree'|'netlify'; formspreeId?: string; successRedirect?: string }
const Contact: BlockDefinition<ContactProps> = {
  type: 'contact',
  label: 'Contact',
  createDefaultProps: () => ({
    heading: 'Contact us',
    subtext: 'Send us a message and we will get back to you soon.',
    emailTo: 'you@example.com',
    handler: 'none',
    formspreeId: '',
    successRedirect: '',
  }),
  render: (p, theme) => (
    <section id="contact" className="b-contact">
      <h2>{p.heading}</h2>
      <p className="sub">{p.subtext}</p>
      <form className="form" onSubmit={(e)=>{ e.preventDefault(); alert('This is a static demo. Configure Formspree or Netlify forms in export.') }} data-netlify={p.handler==='netlify' ? true : undefined} name={p.handler==='netlify' ? 'contact' : undefined} method="POST" action={p.handler==='formspree' && p.formspreeId ? `https://formspree.io/f/${p.formspreeId}` : undefined}>
        <input placeholder="Your name" required />
        <input type="email" placeholder="Your email" required />
        <textarea placeholder="Message" rows={5} required />
        {p.handler==='netlify' && (<input type="hidden" name="form-name" value="contact" />)}
        {p.successRedirect && (<input type="hidden" name="redirect" value={p.successRedirect} />)}
        <button type="submit" style={{ background: theme.primary }}>Send</button>
      </form>
    </section>
  ),
  toHTML: (p, theme) => `
<section id="contact" class="b-contact">
  <h2>${escapeHtml(p.heading)}</h2>
  <p class="sub">${escapeHtml(p.subtext)}</p>
  <form class="form" ${p.handler==='netlify'? 'data-netlify="true" name="contact" method="POST"' : ''} ${p.handler==='formspree' && p.formspreeId? `method="POST" action="https://formspree.io/f/${escapeHtml(p.formspreeId)}"` : ''}>
    <input placeholder="Your name" required>
    <input type="email" placeholder="Your email" required>
    <textarea placeholder="Message" rows="5" required></textarea>
    ${p.handler==='netlify'? '<input type="hidden" name="form-name" value="contact">' : ''}
    ${p.successRedirect? `<input type="hidden" name="redirect" value="${escapeHtml(p.successRedirect)}">` : ''}
    <button type="submit" style="background:${theme.primary}">Send</button>
  </form>
</section>`
}

export const BLOCKS: BlockDefinition[] = [Hero, Features, Gallery, Testimonials, Pricing, Contact]
