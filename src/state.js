// Shared mutable state between DOM scroll listeners (GSAP) and the R3F loop.
// Mutating plain objects avoids React re-renders on every scroll tick.

export const scrollState = {
  progress: 0, // 0..1 across whole page
  hero: 0, // 0..1 through hero section
  sectionIndex: 0,
}

export const pointerState = {
  x: 0, // -1..1
  y: 0, // -1..1
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}
