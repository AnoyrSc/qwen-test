import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/* Dual-layer cursor: instant dot + lagging ring, GSAP-lerped in one ticker */
export default function Cursor() {
  const dot = useRef()
  const ring = useRef()

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.body.style.cursor = 'none'

    // hide native-cursor while custom cursor is active
    const style = document.createElement('style')
    style.textContent =
      'a,button,.work-card,.service-row,[data-word],.nav,.nav *{cursor:none !important}'
    document.head.appendChild(style)

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { x: pos.x, y: pos.y }

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const setX = gsap.quickSetter(dot.current, 'x', 'px')
    const setY = gsap.quickSetter(dot.current, 'y', 'px')
    setX(pos.x)
    setY(pos.y)

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      gsap.set(ring.current, { x: ringPos.x, y: ringPos.y })
    }
    gsap.ticker.add(tick)

    const onEnter = (e) => {
      const t = e.target
      if (t.closest('a, button, .work-card, .service-row')) ring.current.classList.add('is-hover')
    }
    const onLeave = () => ring.current.classList.remove('is-hover')
    document.addEventListener('pointerover', onEnter)
    document.addEventListener('pointerout', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onEnter)
      document.removeEventListener('pointerout', onLeave)
      gsap.ticker.remove(tick)
      document.body.style.cursor = ''
      style.remove()
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  )
}
