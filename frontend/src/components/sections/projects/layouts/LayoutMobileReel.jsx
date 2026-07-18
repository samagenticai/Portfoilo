import FloatPiece from '../FloatPiece'
import LiveBrowser from '../LiveBrowser'
import {
  ArchitectureChip,
  CapabilityTags,
  DeployStatus,
  FeatureHighlights,
  GitPulse,
  ProjectActions,
  ProjectDescription,
  ProjectMetrics,
  ProjectTitle,
  TechPills,
} from '../GalleryPieces'

/**
 * Dedicated mobile / tablet experience — vertical product reel.
 * Intentionally designed; not a shrunk desktop layout.
 */
export default function LayoutMobileReel({ project, index }) {
  return (
    <div className="flex w-full flex-col gap-5 overflow-x-hidden sm:gap-6 lg:hidden">
      <FloatPiece depth={0} delay={0} tilt={false} surface={false} className="w-full">
        <LiveBrowser project={project} />
      </FloatPiece>

      <FloatPiece depth={0} delay={0.05} surface={false} className="w-full">
        <ProjectTitle project={project} index={index} />
      </FloatPiece>

      <FloatPiece depth={0} delay={0.08} surface={false} className="w-full">
        <ProjectDescription project={project} />
      </FloatPiece>

      <FloatPiece depth={0} delay={0.1} className="w-full">
        <div className="flex flex-wrap gap-2.5">
          <ProjectMetrics project={project} className="flex-1" />
          <DeployStatus project={project} />
          <GitPulse project={project} />
        </div>
      </FloatPiece>

      <FloatPiece depth={0} delay={0.12} className="w-full">
        <ArchitectureChip project={project} className="p-0.5" />
      </FloatPiece>

      <FloatPiece depth={0} delay={0.14} className="w-full">
        <FeatureHighlights project={project} limit={4} className="p-0.5" />
      </FloatPiece>

      <FloatPiece depth={0} delay={0.16} className="w-full">
        <div className="space-y-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-secondary">
            Technology Stack
          </p>
          <TechPills project={project} />
          <CapabilityTags project={project} />
        </div>
      </FloatPiece>

      <FloatPiece depth={0} delay={0.18} surface={false} className="w-full pt-1">
        <ProjectActions project={project} fullWidth />
      </FloatPiece>
    </div>
  )
}
