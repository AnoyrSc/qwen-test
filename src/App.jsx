import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './ui/Preloader'
import Cursor from './ui/Cursor'
import { scrollState } from './state'

gsap.registerPlugin(ScrollTrigger)

const Scene = lazy(() => import('./three/Scene'))
const CardCanvas = lazy(() => import('./three/CardCanvas'))

/* ------------------------------------------------------------------ */
/*  data                                                               */
/* ------------------------------------------------------------------ */

const PROJECTS = [
  {
    index: '01',
    title: 'Aurora Grid',
    client: 'Nordlys Energy',
    desc: 'A real-time control universe for renewable grids — 3D telemetry mapped to cinematic spatial interfaces.',
    tags: ['WebGL', 'Data Viz', 'Art Direction'],
  },
  {
    index: '02',
    title: 'Vantablack',
    client: 'Maison Obscura',
    desc: 'An e-commerce flagship built as a walk-through gallery. Product reveals choreographed by scroll velocity.',
    tags: ['R3F', 'E-commerce', 'Motion'],
  },
  {
    index: '03',
    title: 'Signal / Noise',
    client: 'Kessler Audio',
    desc: 'Generative soundscapes sculpted into living geometry — every frequency drives the mesh in real time.',
    tags: ['Generative', 'Audio Reactor', 'Shader'],
  },
]

const SERVICES = [
  ['Real-time 3D', 'Immersive WebGL experiences engineered for narrative, not spectacle — 60fps on the devices people actually use.'],
  ['Creative Development', 'Custom front-ends where motion is architecture: scroll systems, transitions and interaction design as one language.'],
  ['Art Direction', 'World-building, lighting and material studies that give digital products a physical, cinematic presence.'],
  ['Brand Systems', 'Identity kits designed to live in motion — typography, rhythm and space carried across every touchpoint.'],
]

const STEPS = [
  ['01', 'Discover', 'We map the story before the pixels. Workshops, references and constraints become a single creative brief.'],
  ['02', 'Design', 'Styleframes and spatial prototypes. Every scene is lit, blocked and timed before a line of shader code exists.'],
  ['03', 'Build', 'Real-time engineering — custom renderers, physics-feel interactions and performance budgets kept honest.'],
  ['04', 'Launch', 'Optimised, instrumented and shipped. Then iterated — the first week of data is just the opening act.'],
]

const MARQUEE_WORDS = ['Immersive', 'Cinematic', 'Real-time', 'Generative', 'Spatial', 'Crafted']

/* ------------------------------------------------------------------ */
/*  sections                                                           */
/* ------------------------------------------------------------------ */

function Nav() {
  return (
    <header className="nav">
      <a href="#top" className="nav__logo">NOCTURNE✦</a>
      <nav className="nav__links">
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#process">Process</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="nav__cta">Start a project</button>
    </header>
  )
}

function Hero() {
  const root = useRef()
  return (
    <section className="hero wrap" ref={root} id="top">
      <h1 className="h-display h-hero hero__title" aria-label="We build worlds, not websites">
        <span className="hero__line">
          <span className="hero__word" data-word>We build</span>
        </span>
        <span className="hero__line">
          <span className="hero__word outline-text" data-word>worlds,</span>
        </span>
        <span className="hero__line">
          <span className="hero__word" data-word>not websites<span className="accent">.</span></span>
        </span>
      </h1>
      <div className="hero__sub">
        <p className="hero__desc" data-hero-fade>
          Nocturne is an independent creative studio designing immersive, real-time
          experiences for brands that refuse the flat web.
        </p>
        <div className="hero__scroll" data-hero-fade>
          <span className="hero__scroll-line" />
          Scroll to enter
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const track = useRef()
  useEffect(() => {
    const el = track.current
    if (!el) return
    const tween = gsap.to(el, {
      xPercent: -50,
      ease: 'none',
      duration: 26,
      repeat: -1,
    })
    // subtle acceleration tied to scroll velocity
    const st = ScrollTrigger.create({
      onUpdate(self) {
        const v = gsap.utils.clamp(-60, 60, self.getVelocity() / 40)
        tween.timeScale(1 + Math.abs(v) / 60)
        gsap.to(tween, { timeScale: 1, duration: 0.8, overwrite: true })
      },
    })
    return () => {
      tween.kill()
      st.kill()
    }
  }, [])

  const row = MARQUEE_WORDS.map((w, i) => (
    <span className="marquee__item" key={i}>{w}</span>
  ))
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={track}>
        {row}
        {row}
      </div>
    </div>
  )
}

function Manifesto() {
  const root = useRef()
  const text = 'Digital experiences should feel like places — with depth, gravity and light. We compose them frame by frame.'
  const words = text.split(' ')
  return (
    <section className="section wrap" ref={root}>
      <p className="kicker" data-reveal>The studio</p>
      <h2 className="manifesto" style={{ marginTop: 'clamp(28px, 4vw, 56px)' }}>
        {words.map((w, i) => (
          <span className="word" key={i} data-word-mani>
            {i > words.length - 5 ? <span className="accent">{w}</span> : w}{' '}
          </span>
        ))}
      </h2>
      <div className="manifesto-foot">
        <div className="stat-grid">
          {[['12+', 'Years crafting real-time'], ['98', 'Projects shipped'], ['7', 'Design awards']].map((s, i) => (
            <div key={i} data-stat>
              <div className="stat__num accent">{s[0]}</div>
              <div className="stat__label">{s[1]}</div>
            </div>
          ))}
        </div>
        <p className="muted" style={{ maxWidth: '34ch', fontSize: 14, lineHeight: 1.7 }} data-reveal>
          Based between Berlin and Jakarta. Working worldwide, in your timezone.
        </p>
      </div>
    </section>
  )
}

function Work() {
  const root = useRef()
  return (
    <section className="section wrap" id="work" ref={root}>
      <div className="work-head">
        <div>
          <p className="kicker" data-reveal>Selected work</p>
          <h2 className="h-display h-section" data-reveal>Case Files</h2>
        </div>
        <p className="muted" style={{ maxWidth: '30ch', fontSize: 14, lineHeight: 1.7 }} data-reveal>
          Three recent transmissions. Each one rendered live in your browser.
        </p>
      </div>

      <div className="card-stack">
        {PROJECTS.map((p, i) => (
          <article className="work-card" key={p.index} data-card>
            <div className="work-card__inner">
              <div className="work-card__text">
                <div>
                  <p className="work-card__index">{p.index} — {p.client}</p>
                  <h3 className="h-display work-card__title" style={{ marginTop: 18 }}>{p.title}</h3>
                </div>
                <div>
                  <p className="work-card__desc">{p.desc}</p>
                  <div className="work-card__meta" style={{ marginTop: 20 }}>
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <a className="work-card__link" href="#contact">
                  View case <i>→</i>
                </a>
              </div>
              <div className="work-card__viz">
                <Suspense fallback={null}>
                  <CardCanvas variant={i} />
                </Suspense>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="section wrap" id="services">
      <p className="kicker" data-reveal>Capabilities</p>
      <h2 className="h-display h-section" style={{ margin: 'clamp(24px,3vw,48px) 0 clamp(40px,6vw,80px)' }} data-reveal>
        What we <span className="outline-text">do</span>
      </h2>
      <div className="services-list">
        {SERVICES.map(([name, desc], i) => (
          <div className="service-row" key={name} data-service>
            <span className="service-row__num">0{i + 1}</span>
            <h3 className="service-row__name">{name}</h3>
            <p className="service-row__desc">{desc}</p>
            <span className="service-row__arrow">↗</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Process() {
  const root = useRef()
  return (
    <section className="process" id="process" ref={root}>
      <div className="process__stage">
        <div className="process__wrap">
          <p className="kicker" data-reveal>Method</p>
          <h2 className="h-display h-section" style={{ marginTop: 'clamp(16px,2vw,32px)' }} data-reveal>
            Four acts<span className="accent">.</span>
          </h2>
          <div className="process__steps">
            {STEPS.map(([num, name, desc]) => (
              <div className="step" key={num} data-step>
                <span className="step__num">{num}</span>
                <div>
                  <h3 className="step__name">{name}</h3>
                  <p className="step__desc" style={{ marginTop: 12 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="process__progress"><span data-progress /></div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact wrap" id="contact">
      <p className="kicker" style={{ justifyContent: 'center' }} data-reveal>Next</p>
      <h2 className="h-display h-hero" data-reveal style={{ fontSize: 'clamp(48px, 9vw, 140px)' }}>
        Let’s make<br /><span className="outline-text">space</span> together
      </h2>
      <a className="contact__mail" href="mailto:hello@nocturne.studio" data-reveal>hello@nocturne.studio</a>
      <div className="contact__socials" data-reveal>
        <a href="#top">Instagram</a>
        <a href="#top">X</a>
        <a href="#top">Dribbble</a>
        <a href="#top">LinkedIn</a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>© 2026 Nocturne Studio</span>
        <span>Berlin — Jakarta</span>
        <span>Rendered in real-time ✦</span>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  global scroll animations                                           */
/* ------------------------------------------------------------------ */

function useScrollAnimations(ready) {
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      /* master page progress → feeds the 3D camera rig */
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scrollState.progress = self.progress
        },
      })

      /* hero progress + parallax exit */
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          scrollState.hero = self.progress
        },
      })

      gsap.to('.hero__word', {
        yPercent: -110,
        rotate: -3,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: 0.6 },
      })
      gsap.to('[data-hero-fade]', {
        opacity: 0,
        y: -60,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 60%', scrub: 0.6 },
      })

      /* generic reveals */
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        )
      })

      /* manifesto word cascade */
      gsap.fromTo(
        '[data-word-mani]',
        { opacity: 0.12, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          ease: 'none',
          scrollTrigger: {
            trigger: '.manifesto',
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: 0.8,
          },
        },
      )

      /* stats count-in */
      gsap.utils.toArray('[data-stat]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          },
        )
      })

      /* work cards: rise + gentle depth tilt while in view */
      gsap.utils.toArray('[data-card]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 120, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
        gsap.fromTo(
          el,
          { rotateX: 4, transformPerspective: 1200 },
          {
            rotateX: -2,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
          },
        )
      })

      /* service rows slide in */
      gsap.utils.toArray('[data-service]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          },
        )
      })

      /* process pinned sequence */
      const steps = gsap.utils.toArray('[data-step]')
      const progressEl = document.querySelector('[data-progress]')
      gsap.set(steps, { opacity: 0.25, y: 30 })
      ScrollTrigger.create({
        trigger: '.process',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          if (progressEl) progressEl.style.transform = `scaleX(${self.progress})`
        },
      })
      steps.forEach((el, i) => {
        const s = i / steps.length
        const e = (i + 1) / steps.length
        gsap.timeline({
          scrollTrigger: {
            trigger: '.process',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        })
          .to(el, { opacity: 1, y: 0, ease: 'power2.out' }, s)
          .call(() => el.classList.add('is-active'), null, s + 0.001)
          .to(el, { opacity: 0.25, y: -18, ease: 'power2.in' }, e - 0.08)
          .call(() => el.classList.remove('is-active'), null, e - 0.02)
      })

      /* contact headline split lines */
      gsap.fromTo(
        '.contact .h-display',
        { opacity: 0, y: 90 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.contact', start: 'top 75%' },
        },
      )
    })
    return () => ctx.revert()
  }, [ready])
}

/* ------------------------------------------------------------------ */
/*  app                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [loaded, setLoaded] = useState(false)
  useScrollAnimations(loaded)

  return (
    <>
      <Preloader onDone={() => setLoaded(true)} />
      <Cursor />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <div className="content">
        <Nav />
        <Hero />
        <Marquee />
        <Manifesto />
        <Work />
        <Services />
        <Process />
        <Contact />
        <Footer />
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  )
}
