import { absoluteUrl, DEFAULT_AUTHOR, HOME_DESCRIPTION, SITE_NAME, SITE_URL } from '../constants/seo'

export function buildPortfolioJsonLd({ profile, projects = [], pageUrl, pageName, pageDescription }) {
  const personName = profile?.fullName || DEFAULT_AUTHOR
  const github = profile?.github?.href || 'https://github.com/samagenticai'
  const linkedin = profile?.linkedin?.href || ''
  const email = profile?.email || ''
  const image = profile?.profileImage ? absoluteUrl(profile.profileImage) : absoluteUrl('/og-image.svg')

  const person = {
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: personName,
    url: SITE_URL,
    image,
    email: email || undefined,
    jobTitle: profile?.professionalTitle || 'MERN Stack Developer',
    address: profile?.location
      ? { '@type': 'PostalAddress', addressLocality: profile.location }
      : undefined,
    sameAs: [github, linkedin, profile?.website].filter(Boolean),
    knowsAbout: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'JavaScript',
      'Tailwind CSS',
      'Full Stack Development',
    ],
  }

  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/favicon.svg'),
    founder: { '@id': `${SITE_URL}/#person` },
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: HOME_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
  }

  const webPage = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageName,
    description: pageDescription,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    inLanguage: 'en',
  }

  const profilePage = {
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: `${SITE_NAME} — ${personName}`,
    mainEntity: { '@id': `${SITE_URL}/#person` },
  }

  const portfolio = {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#portfolio`,
    name: `${SITE_NAME} Projects`,
    itemListElement: projects.slice(0, 12).map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description || project.shortDescription,
        url: project.liveUrl || project.githubUrl || absoluteUrl('/projects'),
        image: project.coverImage ? absoluteUrl(project.coverImage) : undefined,
      },
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [person, organization, website, webPage, profilePage, portfolio],
  }
}
