import { useEffect, useRef } from 'react';

const lerp = (a, b, t) => (1 - t) * a + t * b;

export default function useSmoothScroll(scrollableRef) {
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    if (!scrollableElement) return;

    const animateScroll = () => {
      currentScroll.current = lerp(currentScroll.current, targetScroll.current, 0.1);
      scrollableElement.scrollTop = currentScroll.current;

      if (Math.abs(currentScroll.current - targetScroll.current) < 0.5) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      } else {
        animationFrameId.current = requestAnimationFrame(animateScroll);
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      targetScroll.current += e.deltaY;
      targetScroll.current = Math.max(0, targetScroll.current);
      targetScroll.current = Math.min(targetScroll.current, scrollableElement.scrollHeight - scrollableElement.clientHeight);

      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(animateScroll);
      }
    };

    scrollableElement.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      scrollableElement.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [scrollableRef]);
}
