import { NAV_LINKS } from '../../constants/navigation'
import { SITE_NAME } from '../../constants/seo'
import { usePortfolio } from '../../context/PortfolioContext'
import { Container, IconLink, SocialIcon } from '../ui'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { profile, hasResume, resumeUrl, resumeFileName, mailtoHref } = usePortfolio()

  const socialLinks = [
    profile?.github?.href ? { label: 'GitHub', href: profile.github.href, icon: 'github' } : null,
    profile?.linkedin?.href ? { label: 'LinkedIn', href: profile.linkedin.href, icon: 'linkedin' } : null,
    mailtoHref ? { label: 'Email', href: mailtoHref, icon: 'email' } : null,
  ].filter(Boolean)

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[min(90%,40rem)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative z-10 py-12 sm:py-14">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="max-w-sm text-center lg:text-left">
            <p className="text-lg font-semibold tracking-tight text-text">{SITE_NAME}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {profile?.shortBio ||
                (profile?.location
                  ? `MERN Stack Developer based in ${profile.location}. Building modern, scalable web applications.`
                  : 'Building modern, scalable web applications.')}
            </p>
          </div>

          <nav aria-label="Footer navigation" className="text-center lg:text-left">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
              Navigate
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={`/${link.href}`}
                    className="text-sm font-medium text-muted transition-colors duration-300 hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social links" className="text-center lg:text-left">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-secondary">
              Connect
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <IconLink href={social.href} label={social.label} className="footer-social">
                    <SocialIcon name={social.icon} />
                  </IconLink>
                </li>
              ))}
              <li>
                <IconLink
                  href={hasResume ? resumeUrl : undefined}
                  label="Download Resume"
                  download={hasResume ? resumeFileName : undefined}
                  disabled={!hasResume}
                  disabledTitle="Resume not uploaded yet"
                  className="footer-social"
                >
                  <SocialIcon name="resume" />
                </IconLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/[0.06] pt-6 text-center">
          <p className="text-sm text-muted">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
