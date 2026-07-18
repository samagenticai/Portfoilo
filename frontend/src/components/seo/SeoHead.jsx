import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  DEFAULT_AUTHOR,
  DEFAULT_OG_IMAGE,
  GITHUB_URL,
  HOME_DESCRIPTION,
  SEO_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
} from '../../constants/seo'
import { applySeoMeta } from '../../lib/seoMeta'

export default function SeoHead({
  title,
  description = HOME_DESCRIPTION,
  keywords = SEO_KEYWORDS,
  author = DEFAULT_AUTHOR,
  robots = 'index, follow',
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  ogImageAlt = 'Ahmad Stack — MERN Stack Developer preview',
  jsonLd,
}) {
  const location = useLocation()
  const canonical = absoluteUrl(path ?? location.pathname)

  useEffect(() => {
    applySeoMeta({
      title,
      description,
      keywords,
      author,
      robots,
      canonical,
      ogTitle: title,
      ogDescription: description,
      ogImage: ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage),
      ogUrl: canonical,
      ogType,
      ogSiteName: SITE_NAME,
      ogImageAlt,
      githubUrl: GITHUB_URL,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage),
      jsonLd,
    })
  }, [title, description, keywords, author, robots, canonical, ogImage, ogType, ogImageAlt, jsonLd])

  return null
}
