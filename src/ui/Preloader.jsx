import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Preloader({ onDone }) {
  const root = useRef()
  const countRef = useRef()
  const barRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      const tl = gsap.timeline({
        onComplete: () => {
          root.current.style.display = 'none'
          onDone()
        },
      })

      tl.to(counter, {
        v: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      })
        .to(barRef.current, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, '<')
        .to('.preloader__row, .preloader__bar', { y: -40, opacity: 0, duration: 0.5, ease: 'power2.in' }, '-=0.15')
        .set(root.current, { display: 'none' })
    }, root)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__row">
        <div className="preloader__count" ref={countRef}>000</div>
        <div className="preloader__label">Loading the space — Nocturne Studio</div>
      </div>
      <div className="preloader__bar">
        <span ref={barRef} />
      </div>
    </div>
  )
}
