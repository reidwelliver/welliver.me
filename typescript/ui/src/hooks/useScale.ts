import { useState, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';
import { BASE_WIDTH, BASE_HEIGHT } from '../config/grid';

export function useScale(containerRef: RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const scaleX = clientWidth / BASE_WIDTH;
    const scaleY = clientHeight / BASE_HEIGHT;
    setScale(Math.min(scaleX, scaleY));
  }, [containerRef]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  return scale;
}
