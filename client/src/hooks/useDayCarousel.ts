import { useState, useRef, useCallback, useEffect } from 'react';
import { DAYS_OF_WEEK } from '../constants';

const RECENTER_THRESHOLD = 14;

export function useDayCarousel(initialDay: string = DAYS_OF_WEEK[0]) {
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [carouselPos, setCarouselPos] = useState(() => DAYS_OF_WEEK.indexOf(initialDay));
  const [animated, setAnimated] = useState(true);
  const touchStartX = useRef(0);

  // Recenter when position drifts too far — keeps carousel infinite
  useEffect(() => {
    if (Math.abs(carouselPos) <= RECENTER_THRESHOLD) return;

    // Find equivalent position near 0 that maps to the same day
    const recentered = ((carouselPos % 7) + 7) % 7;
    const timer = setTimeout(() => {
      setAnimated(false);
      setCarouselPos(recentered);
      // Re-enable transition on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimated(true));
      });
    }, 500); // wait for current transition to finish
    return () => clearTimeout(timer);
  }, [carouselPos]);

  const selectDay = useCallback(
    (day: string, targetPos?: number) => {
      if (targetPos !== undefined) {
        setCarouselPos(targetPos);
      } else {
        const currentIdx = DAYS_OF_WEEK.indexOf(selectedDay);
        const targetIdx = DAYS_OF_WEEK.indexOf(day);
        let delta = targetIdx - currentIdx;
        if (delta > 3) delta -= 7;
        if (delta < -3) delta += 7;
        setCarouselPos((prev) => prev + delta);
      }
      setSelectedDay(day);
    },
    [selectedDay]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) {
        const direction = delta > 0 ? 1 : -1;
        const currentIdx = DAYS_OF_WEEK.indexOf(selectedDay);
        const nextIdx = (((currentIdx + direction) % 7) + 7) % 7;
        setCarouselPos((prev) => prev + direction);
        setSelectedDay(DAYS_OF_WEEK[nextIdx]);
      }
    },
    [selectedDay]
  );

  return {
    selectedDay,
    carouselPos,
    animated,
    selectDay,
    handleTouchStart,
    handleTouchEnd,
  };
}
