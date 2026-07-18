function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (value == null || value === '') {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, value)
    }
  })
  return el
}

function upsertLink(rel, href, extra = {}) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  Object.entries(extra).forEach(([key, value]) => el.setAttribute(key, value))
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function applySeoMeta({
  title,
  description,
  keywords,
  author,
  robots = 'index, follow',
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  ogSiteName,
  ogImageAlt,
  githubUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  jsonLd,
}) {
  if (title) document.title = title

  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords })
  upsertMeta('meta[name="author"]', { name: 'author', content: author })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })

  if (canonical) upsertLink('canonical', canonical)

  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: ogTitle || title })
  upsertMeta('meta[property="og:description"]', {
    property: 'og:description',
    content: ogDescription || description,
  })
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: ogType })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: ogUrl || canonical })
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: ogSiteName })
  if (ogImage) {
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: ogImageAlt || ogTitle || title,
    })
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' })
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' })
  }

  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_US' })

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: twitterCard })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: twitterTitle || title })
  upsertMeta('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: twitterDescription || description,
  })
  if (twitterImage || ogImage) {
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: twitterImage || ogImage,
    })
    upsertMeta('meta[name="twitter:image:alt"]', {
      name: 'twitter:image:alt',
      content: ogImageAlt || twitterTitle || title,
    })
  }

  if (githubUrl) upsertLink('me', githubUrl)

  if (jsonLd) upsertJsonLd('portfolio-json-ld', jsonLd)
}
