export default function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
      <span className="sr-only">Loading page…</span>
    </div>
  )
}
