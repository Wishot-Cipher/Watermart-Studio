import { useEffect, useRef } from 'react';

export interface GestureHandlers {
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: (x: number, y: number) => void;
}

export function useTouchGestures(handlers: GestureHandlers) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const initialDistanceRef = useRef<number | null>(null);
  const initialAngleRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Single touch - track for swipe or long press
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };

        // Start long press timer
        longPressTimerRef.current = window.setTimeout(() => {
          if (handlers.onLongPress && touchStartRef.current) {
            handlers.onLongPress(touchStartRef.current.x, touchStartRef.current.y);
          }
        }, 500);
      } else if (e.touches.length === 2) {
        // Two finger touch - track for pinch and rotate
        cancelLongPress();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialDistanceRef.current = distance;

        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        ) * 180 / Math.PI;
        initialAngleRef.current = angle;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      cancelLongPress();

      if (e.touches.length === 2 && initialDistanceRef.current !== null) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // Pinch to zoom
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const scale = currentDistance / initialDistanceRef.current;
        if (handlers.onPinch) {
          handlers.onPinch(scale);
        }

        // Two finger rotation
        const currentAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        ) * 180 / Math.PI;
        if (initialAngleRef.current !== null && handlers.onRotate) {
          const angleDiff = currentAngle - initialAngleRef.current;
          handlers.onRotate(angleDiff);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      cancelLongPress();

      if (e.changedTouches.length === 1 && touchStartRef.current) {
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;
        const deltaTime = Date.now() - touchStartRef.current.time;

        // Swipe detection (fast horizontal movement)
        if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 50 && deltaTime < 300) {
          if (deltaX > 0 && handlers.onSwipeRight) {
            handlers.onSwipeRight();
          } else if (deltaX < 0 && handlers.onSwipeLeft) {
            handlers.onSwipeLeft();
          }
        }
      }

      // Reset refs
      touchStartRef.current = null;
      initialDistanceRef.current = null;
      initialAngleRef.current = null;
    };

    const cancelLongPress = () => {
      if (longPressTimerRef.current !== null) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      cancelLongPress();
    };
  }, [handlers]);
}
