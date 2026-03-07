import { DAYS_OF_WEEK } from '../../constants';
import { getTodayName } from '../../utils';

const BUFFER_HALF = 24;
const ITEM_WIDTH = 68; // 60px button + 8px gap

interface DayCarouselProps {
  carouselPos: number;
  animated?: boolean;
  onSelectDay: (day: string, pos?: number) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

const todayName = getTodayName();

export default function DayCarousel({
  carouselPos,
  animated = true,
  onSelectDay,
  onTouchStart,
  onTouchEnd,
}: DayCarouselProps) {
  return (
    <div className="overflow-hidden py-3" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div
        className="flex gap-2 items-center will-change-transform"
        style={{
          transform: `translateX(calc(50% - ${(BUFFER_HALF + carouselPos) * ITEM_WIDTH}px - 30px))`,
          transition: animated ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
        }}
      >
        {Array.from({ length: BUFFER_HALF * 2 + 1 }, (_, i) => {
          const pos = i - BUFFER_HALF;
          const dayIdx = ((pos % 7) + 7) % 7;
          const day = DAYS_OF_WEEK[dayIdx];
          const distance = Math.abs(pos - carouselPos);
          const isSelected = distance === 0;
          const isToday = day === todayName;
          const scale = isSelected ? 1.15 : Math.max(0.8, 1 - distance * 0.06);
          const itemOpacity = isSelected ? 1 : Math.max(0.2, 0.7 - distance * 0.15);

          return (
            <button
              key={pos}
              onClick={() => onSelectDay(day, pos)}
              style={{
                transform: `scale(${scale})`,
                opacity: itemOpacity,
                transition:
                  'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, background-color 0.25s ease, color 0.25s ease, box-shadow 0.4s ease',
                width: '60px',
                flexShrink: 0,
              }}
              className={`py-2.5 rounded-xl text-sm font-bold text-center ${
                isSelected
                  ? 'bg-lime text-obsidian shadow-lg shadow-lime/30'
                  : isToday
                    ? 'bg-graphite text-lime border-2 border-lime/60'
                    : 'bg-graphite text-silver border border-steel'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
