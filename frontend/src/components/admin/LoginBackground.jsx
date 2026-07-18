import { useRef } from 'react'
import { HeroBackground } from '../sections/hero/background'

/** Reuses portfolio hero atmosphere for the login screen */
export default function LoginBackground() {
  const sectionRef = useRef(null)

  return (
    <div
      ref={sectionRef}
      className="pointer-events-none absolute inset-0 min-h-dvh overflow-hidden"
      aria-hidden="true"
    >
      <HeroBackground sectionRef={sectionRef} />
    </div>
  )
}
