import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FLOATING_COMMANDS } from '../../../../constants/heroDashboard'

export default function FloatingCommands({ active = true }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !active) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const nodes = root.querySelectorAll('[data-cmd]')
    const ctx = gsap.context(() => {
      nodes.forEach((node, i) => {
        const meta = FLOATING_COMMANDS[i]
        if (!meta) return
        gsap.to(node, {
          x: meta.x,
          y: meta.y,
          duration: meta.duration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.8,
        })
      })
    }, root)

    return () => ctx.revert()
  }, [active])

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FLOATING_COMMANDS.map((cmd) => (
        <span
          key={cmd.text}
          data-cmd
          className="absolute font-mono text-[0.625rem] font-medium text-secondary select-none sm:text-xs"
          style={{ left: cmd.left, top: cmd.top, opacity: cmd.opacity }}
        >
          {cmd.text}
        </span>
      ))}
    </div>
  )
}
