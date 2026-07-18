import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CONTACT } from '../../../constants/contact'
import { usePortfolio } from '../../../context/PortfolioContext'
import { useInView } from '../../../hooks/useInView'
import Container from '../../ui/Container'
import Heading from '../../ui/Heading'
import ResumeDownloadButton from '../../ui/ResumeDownloadButton'
import ContactBackground from './ContactBackground'
import ContactForm from './ContactForm'
import { AvailabilityCard, ContactRow } from './ContactInfo'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const inView = useInView(sectionRef, { rootMargin: '80px', threshold: 0.04 })
  const { profile, mailtoHref, whatsappHref } = usePortfolio()

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const leftItems = leftRef.current?.querySelectorAll('[data-contact-reveal]') ?? []
    const right = rightRef.current

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([...leftItems, right], { opacity: 1, y: 0, x: 0 })
        return
      }

      gsap.set(leftItems, { opacity: 0, y: 28 })
      if (right) gsap.set(right, { opacity: 0, y: 36 })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 74%',
            toggleActions: 'play none none reverse',
          },
        })
        .to(leftItems, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
        })
        .to(
          right,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
          },
          '-=0.45',
        )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding relative overflow-hidden scroll-mt-24"
      aria-labelledby="contact-title"
      data-contact-active={inView || undefined}
    >
      <ContactBackground sectionRef={sectionRef} />

      <Container className="relative z-10 overflow-x-clip">
        <div className="contact-layout grid max-w-full items-start gap-11 max-md:gap-12 md:grid-cols-2 md:gap-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:gap-12 xl:gap-16">
          {/* LEFT — 45% desktop / stacked on mobile */}
          <div ref={leftRef} className="contact-left min-w-0 max-w-full">
            <p
              data-contact-reveal
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-secondary sm:text-sm"
            >
              {CONTACT.badge}
            </p>

            <Heading
              as="h2"
              id="contact-title"
              data-contact-reveal
              gradient
              className="mb-4 text-[1.85rem] leading-[1.12] max-md:max-w-[18ch] sm:mb-5 sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08]"
            >
              {CONTACT.heading}
            </Heading>

            <p
              data-contact-reveal
              className="mb-7 max-w-md text-[0.975rem] leading-[1.75] text-muted sm:mb-8 sm:text-base"
            >
              {CONTACT.description}
            </p>

            <div data-contact-reveal className="mb-8 sm:mb-9">
              <AvailabilityCard label={profile?.availability || CONTACT.availability} />
            </div>

            <div data-contact-reveal className="mb-8 space-y-0.5 border-t border-white/[0.06] pt-6 sm:mb-9 sm:space-y-1">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
                Contact Information
              </p>
              <ContactRow icon="map" label="Location" value={profile?.location || CONTACT.location} />
              <ContactRow
                icon="mail"
                label="Email"
                value={profile?.email || CONTACT.email.value}
                href={mailtoHref || CONTACT.email.href}
              />
              <ContactRow
                icon="whatsapp"
                label="WhatsApp"
                value={profile?.phone || CONTACT.whatsapp.value}
                href={whatsappHref || CONTACT.whatsapp.href}
              />
              <ContactRow
                icon="folder"
                label={profile?.github?.label || CONTACT.github.label}
                value={profile?.github?.display || CONTACT.github.value}
                href={profile?.github?.href || CONTACT.github.href}
              />
              <ContactRow
                icon="linkedin"
                label={profile?.linkedin?.label || CONTACT.linkedin.label}
                value={profile?.linkedin?.display || CONTACT.linkedin.value}
                href={profile?.linkedin?.href || CONTACT.linkedin.href}
              />
            </div>

            <div data-contact-reveal>
              <ResumeDownloadButton
                magnetic
                variant="outline"
                size="lg"
                className="min-h-14 w-full max-md:text-base sm:min-h-12 sm:w-auto"
              />
            </div>
          </div>

          {/* RIGHT — 55% / full-width form on mobile */}
          <div
            ref={rightRef}
            className="contact-right min-w-0 w-full max-w-full md:sticky md:top-28"
          >
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}
