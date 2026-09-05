import { useRef, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

const THRESHOLD = 80;
export function SwipeCard({ children, onSwipeRight, onSwipeLeft }: { children: ComponentChildren; onSwipeRight: () => void; onSwipeLeft: () => void }) {
  const startX = useRef<number | null>(null);
  const [dx, setDx] = useState(0);
  return (
    <div
      class="touch-pan-y select-none transition-transform"
      style={{ transform: `translateX(${dx}px)`, opacity: 1 - Math.min(Math.abs(dx) / 300, 0.5) }}
      onPointerDown={(e) => { startX.current = e.clientX; }}
      onPointerMove={(e) => { if (startX.current !== null) setDx(e.clientX - startX.current); }}
      onPointerUp={() => {
        if (dx >= THRESHOLD) onSwipeRight(); else if (dx <= -THRESHOLD) onSwipeLeft();
        startX.current = null; setDx(0);
      }}
      onPointerCancel={() => { startX.current = null; setDx(0); }}
    >
      {children}
    </div>
  );
}
