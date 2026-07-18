import FloatPiece from '../FloatPiece'
import LiveBrowser from '../LiveBrowser'
import {
  ArchitectureChip,
  CapabilityTags,
  ConnectorSpine,
  GitPulse,
  InsightNote,
  ProjectActions,
  ProjectDescription,
  ProjectMetrics,
  ProjectTitle,
  TechPills,
} from '../GalleryPieces'

/**
 * Layout B — Spotlight Overlap
 * Title-led composition · angled browser · constellation of satellites
 */
export default function LayoutSpotlight({ project, index }) {
  return (
    <div className="relative mx-auto hidden min-h-[min(92vh,54rem)] w-full max-w-6xl lg:block xl:max-w-7xl">
      <ConnectorSpine className="left-[16%] top-[18%] h-px w-[68%]" />

      <FloatPiece depth={0.35} delay={0.1} surface={false} className="absolute left-[2%] top-[3%] z-30 w-[56%]">
        <ProjectTitle project={project} index={index} />
      </FloatPiece>

      <FloatPiece depth={0.55} delay={0.35} surface={false} className="absolute left-[4%] top-[24%] z-20 w-[32%]">
        <ProjectDescription project={project} />
      </FloatPiece>

      <FloatPiece depth={0.7} delay={0.45} className="absolute left-[4%] top-[44%] z-20 w-[24%]">
        <InsightNote label="Solution" icon="sparkles" className="p-0.5">
          {project.solution}
        </InsightNote>
      </FloatPiece>

      <FloatPiece
        depth={1.4}
        delay={0}
        tilt
        surface={false}
        className="absolute right-0 top-[14%] z-40 w-[52%] rotate-[1.25deg]"
      >
        <LiveBrowser project={project} />
      </FloatPiece>

      <FloatPiece depth={0.8} delay={0.5} className="absolute bottom-[30%] left-[6%] z-20">
        <div className="flex flex-wrap gap-2.5">
          <ProjectMetrics project={project} />
          <GitPulse project={project} />
        </div>
      </FloatPiece>

      <FloatPiece depth={0.45} delay={0.4} className="absolute right-[4%] bottom-[34%] z-30 w-[22%]">
        <ArchitectureChip project={project} className="p-0.5" />
      </FloatPiece>

      <FloatPiece depth={0.5} delay={0.65} className="absolute bottom-[16%] left-[3%] right-[28%] z-10">
        <div className="space-y-3">
          <TechPills project={project} />
          <CapabilityTags project={project} />
        </div>
      </FloatPiece>

      <FloatPiece depth={0.3} delay={0.8} surface={false} className="absolute bottom-[4%] right-[3%] z-30">
        <ProjectActions project={project} />
      </FloatPiece>
    </div>
  )
}
