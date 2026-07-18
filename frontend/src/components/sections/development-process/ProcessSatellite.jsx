import { cn } from '../../../lib/cn'
import AppIcon from '../../ui/AppIcon'

/** Unique satellite UI per step — fills space without duplicating the main copy */
export default function ProcessSatellite({ type, className }) {
  switch (type) {
    case 'plan':
      return (
        <div className={cn('process-sat space-y-1.5 font-mono text-[10px] text-slate-400', className)}>
          <p className="text-secondary">// sprint board</p>
          <p><span className="text-emerald-400">✓</span> Define success metrics</p>
          <p><span className="text-emerald-400">✓</span> Map user journeys</p>
          <p><span className="text-amber-400">○</span> Choose stack</p>
        </div>
      )
    case 'wireframe':
      return (
        <div className={cn('process-sat grid grid-cols-3 gap-1.5', className)} aria-hidden="true">
          <div className="col-span-2 h-8 rounded-md border border-white/10 bg-white/[0.04]" />
          <div className="h-8 rounded-md border border-white/10 bg-white/[0.04]" />
          <div className="h-6 rounded-md border border-white/10 bg-white/[0.03]" />
          <div className="col-span-2 h-6 rounded-md border border-white/10 bg-white/[0.03]" />
        </div>
      )
    case 'snippet':
      return (
        <pre className={cn('process-sat overflow-hidden font-mono text-[10px] leading-relaxed text-slate-400', className)}>
          <code>
            <span className="text-secondary">const</span> App = () =&gt; {'{\n'}
            {'  '}<span className="text-emerald-400">return</span> &lt;UI /&gt;{'\n'}
            {'}'}
          </code>
        </pre>
      )
    case 'api':
      return (
        <div className={cn('process-sat space-y-1.5 font-mono text-[10px]', className)}>
          <p><span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-emerald-300">GET</span> <span className="text-slate-400">/api/projects</span></p>
          <p><span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-sky-300">POST</span> <span className="text-slate-400">/api/auth</span></p>
          <p><span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300">PUT</span> <span className="text-slate-400">/api/users/:id</span></p>
        </div>
      )
    case 'schema':
      return (
        <div className={cn('process-sat space-y-1 font-mono text-[10px] text-slate-400', className)}>
          <p className="text-secondary">User {'{'}</p>
          <p className="pl-3">email: String,</p>
          <p className="pl-3">role: Enum,</p>
          <p>{'}'}</p>
        </div>
      )
    case 'checks':
      return (
        <ul className={cn('process-sat space-y-1.5 text-[11px] text-slate-300', className)}>
          {['Auth flows', 'Error states', 'Mobile QA'].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <AppIcon name="check" size={12} className="text-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'deploy':
      return (
        <div className={cn('process-sat inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5', className)}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-emerald-300">Production Ready</span>
        </div>
      )
    case 'perf':
      return (
        <div className={cn('process-sat flex gap-3', className)}>
          {[
            { label: 'LCP', value: '1.2s' },
            { label: 'CLS', value: '0.01' },
            { label: 'Score', value: '98' },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-[9px] uppercase tracking-wider text-secondary">{m.label}</p>
              <p className="text-sm font-bold tabular-nums text-text">{m.value}</p>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}
