/** Portfolio sort: explicit displayOrder first, then newest createdAt */
export function sortPortfolioProjects(projects) {
  return [...projects].sort((a, b) => {
    const aOrder = Number(a.displayOrder) || 0
    const bOrder = Number(b.displayOrder) || 0
    const aRanked = aOrder > 0
    const bRanked = bOrder > 0

    if (aRanked && bRanked && aOrder !== bOrder) return aOrder - bOrder
    if (aRanked && !bRanked) return -1
    if (!aRanked && bRanked) return 1

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
