/** Single source of truth for real contact & social details */

export const PROFILE = {
  name: 'Syed Ahmad Mohayyudin',
  location: 'Multan, Pakistan',
  email: 'syedahmadmohayyudin@gmail.com',
  phoneDisplay: '+92 313 7363725',
  phoneE164: '923137363725',
  github: {
    label: 'GitHub',
    username: 'samagenticai',
    href: 'https://github.com/samagenticai',
    display: 'github.com/samagenticai',
  },
  linkedin: {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/syed-ahmad-mohayyudin-bukhri-003b9b38b',
    display: 'linkedin.com/in/syed-ahmad-mohayyudin-bukhri',
  },
}

export const mailtoHref = `mailto:${PROFILE.email}`
export const whatsappHref = `https://wa.me/${PROFILE.phoneE164}`
