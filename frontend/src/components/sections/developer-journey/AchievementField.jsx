import { JOURNEY_ACHIEVEMENTS } from '../../../constants/journey'
import AchievementPanel from './AchievementPanel'
import JourneyExtras from './JourneyExtras'

export default function AchievementField() {
  return (
    <div className="relative w-full overflow-x-hidden" aria-label="Developer achievements">
      {/* Mobile & tablet — full-width stack (desktop design untouched) */}
      <div className="flex w-full flex-col gap-4 sm:gap-5 lg:hidden">
        {JOURNEY_ACHIEVEMENTS.map((achievement) => (
          <AchievementPanel
            key={achievement.id}
            achievement={achievement}
            layout="mobile"
            className="w-full"
          />
        ))}
        <div className="w-full">
          <JourneyExtras layout="stacked" />
        </div>
      </div>

      {/* Desktop — asymmetric floating field (unchanged) */}
      <div className="relative hidden min-h-[680px] lg:block xl:min-h-[720px]">
        {JOURNEY_ACHIEVEMENTS.map((achievement) => (
          <AchievementPanel
            key={achievement.id}
            achievement={achievement}
            layout="desktop"
          />
        ))}
        <JourneyExtras layout="floating" />
      </div>
    </div>
  )
}
