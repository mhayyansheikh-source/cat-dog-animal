"use client";

import { useEffect, useRef } from "react";

export function useAutoScroll({ interval = 3000, pauseOnHover = true } = {}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let timer;
    let isHovered = false;

    const startAutoScroll = () => {
      timer = setInterval(() => {
        if (isHovered) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = el;
        
        // If we've reached the end (or very close to it), scroll back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by the width of the first child item
          // This plays nicely with CSS scroll-snap-type
          const childWidth = el.children[0]?.clientWidth || 300;
          el.scrollBy({ left: childWidth, behavior: 'smooth' });
        }
      }, interval);
    };

    const handleMouseEnter = () => { if (pauseOnHover) isHovered = true; };
    const handleMouseLeave = () => { if (pauseOnHover) isHovered = false; };
    const handleTouchStart = () => { if (pauseOnHover) isHovered = true; };
    const handleTouchEnd = () => {
        if (pauseOnHover) {
            // Delay resuming slightly after touch
            setTimeout(() => { isHovered = false; }, 1000);
        }
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    startAutoScroll();

    return () => {
      clearInterval(timer);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [interval, pauseOnHover]);

  return scrollRef;
}
