import FloatPiece from '../FloatPiece'
import LiveBrowser from '../LiveBrowser'
import {
  ArchitectureChip,
  ConnectorSpine,
  DeployStatus,
  FeatureHighlights,
  InsightNote,
  ProjectActions,
  ProjectDescription,
  ProjectMetrics,
  ProjectTitle,
  TechPills,
} from '../GalleryPieces'

/**
 * Layout A — Editorial Ledger
 * Browser left · narrative right · satellites fill remaining voids
 */
export default function LayoutLedger({ project, index }) {
  return (
    <div className="relative mx-auto hidden min-h-[min(90vh,52rem)] w-full max-w-6xl lg:block xl:max-w-7xl">
      <ConnectorSpine className="left-[49%] top-[10%] h-[72%] w-px" />

      <FloatPiece depth={1.35} delay={0} tilt surface={false} className="absolute left-0 top-[6%] z-20 w-[51%]">
        <LiveBrowser project={project} />
      </FloatPiece>

      <FloatPiece depth={0.4} delay={0.3} surface={false} className="absolute right-0 top-[6%] z-30 w-[43%]">
        <ProjectTitle project={project} index={index} />
      </FloatPiece>

      <FloatPiece depth={0.65} delay={0.45} surface={false} className="absolute right-[1%] top-[30%] z-20 w-[41%]">
        <ProjectDescription project={project} />
      </FloatPiece>

      <FloatPiece depth={0.5} delay={0.55} className="absolute right-[2%] top-[48%] z-20 w-[28%]">
        <InsightNote label="Problem Solved" icon="target" className="p-0.5">
          {project.problem}
        </InsightNote>
      </FloatPiece>

      <FloatPiece depth={0.75} delay={0.6} className="absolute right-[2%] bottom-[28%] z-20 w-[26%]">
        <FeatureHighlights project={project} limit={3} className="p-0.5" />
      </FloatPiece>

      <FloatPiece depth={0.9} delay={0.2} className="absolute bottom-[24%] left-[2%] z-10 w-[40%]">
        <TechPills project={project} />
      </FloatPiece>

      <FloatPiece depth={0.55} delay={0.7} className="absolute bottom-[10%] left-[4%] z-20">
        <div className="flex flex-wrap items-center gap-2.5">
          <ProjectMetrics project={project} />
          <DeployStatus project={project} />
        </div>
      </FloatPiece>

      <FloatPiece depth={0.35} delay={0.5} className="absolute bottom-[36%] left-[42%] z-10 w-[20%]">
        <ArchitectureChip project={project} className="p-0.5" />
      </FloatPiece>

      <FloatPiece depth={0.25} delay={0.85} surface={false} className="absolute bottom-[5%] right-[3%] z-30">
        <ProjectActions project={project} />
      </FloatPiece>
    </div>
  )
}
