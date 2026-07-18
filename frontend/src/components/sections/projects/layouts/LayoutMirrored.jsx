import FloatPiece from '../FloatPiece'
import LiveBrowser from '../LiveBrowser'
import {
  ArchitectureChip,
  ConnectorSpine,
  DeployStatus,
  FeatureHighlights,
  GitPulse,
  InsightNote,
  ProjectActions,
  ProjectDescription,
  ProjectMetrics,
  ProjectTitle,
  TechPills,
} from '../GalleryPieces'

/**
 * Layout C — Mirrored Rail
 * Narrative islands left · browser right · balanced satellite ring
 */
export default function LayoutMirrored({ project, index }) {
  return (
    <div className="relative mx-auto hidden min-h-[min(90vh,52rem)] w-full max-w-6xl lg:block xl:max-w-7xl">
      <ConnectorSpine className="right-[47%] top-[12%] h-[68%] w-px" />

      <FloatPiece depth={0.4} delay={0.15} surface={false} className="absolute left-0 top-[5%] z-30 w-[44%]">
        <ProjectTitle project={project} index={index} />
      </FloatPiece>

      <FloatPiece depth={0.6} delay={0.35} surface={false} className="absolute left-[1%] top-[30%] z-20 w-[38%]">
        <ProjectDescription project={project} />
      </FloatPiece>

      <FloatPiece depth={0.8} delay={0.5} className="absolute left-[2%] top-[48%] z-20">
        <div className="flex flex-wrap gap-2.5">
          <ProjectMetrics project={project} />
          <DeployStatus project={project} />
        </div>
      </FloatPiece>

      <FloatPiece depth={0.55} delay={0.55} className="absolute left-[3%] bottom-[26%] z-20 w-[30%]">
        <FeatureHighlights project={project} limit={3} className="p-0.5" />
      </FloatPiece>

      <FloatPiece
        depth={1.35}
        delay={0}
        tilt
        surface={false}
        className="absolute right-0 top-[8%] z-40 w-[49%] -rotate-[0.75deg]"
      >
        <LiveBrowser project={project} />
      </FloatPiece>

      <FloatPiece depth={0.45} delay={0.4} className="absolute right-[2%] top-[58%] z-20 w-[24%]">
        <InsightNote label="Challenge" icon="zap" className="p-0.5">
          {project.challenges}
        </InsightNote>
      </FloatPiece>

      <FloatPiece depth={0.7} delay={0.3} className="absolute bottom-[14%] right-[2%] z-20 w-[40%]">
        <div className="space-y-3">
          <TechPills project={project} />
          <div className="flex flex-wrap gap-2.5">
            <GitPulse project={project} />
            <ArchitectureChip project={project} className="max-w-[14rem]" />
          </div>
        </div>
      </FloatPiece>

      <FloatPiece depth={0.25} delay={0.75} surface={false} className="absolute bottom-[4%] left-[2%] z-30">
        <ProjectActions project={project} />
      </FloatPiece>
    </div>
  )
}
