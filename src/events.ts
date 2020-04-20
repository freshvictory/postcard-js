export function onDrag(
  element: HTMLElement,
  direction: 'x' | 'y',
  delta: number,
  callbacks: {
    start: () => void;
    drag: (val: number, diff: number) => void;
    end: (val: number, diff: number) => void;
  }
): void {
  let startX = 0, startY = 0, endX = 0, endY = 0;

  let started = false;

  element.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    [startX, startY] = [touch.screenX, touch.screenY];
  });

  element.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    [endX, endY] = [touch.screenX, touch.screenY];
    const end = direction === 'x' ? endX : endY;
    const start = direction === 'x' ? startX : startY;
    if (started || Math.abs(end - start) > delta) {
      e.stopPropagation();
      if (!started) {
        callbacks.start();
        started = true;
      } else {
        callbacks.drag(end, end - start);
      }
    }
  });

  element.addEventListener('touchend', (e) => {
    const end = direction === 'x' ? endX : endY;
    const start = direction === 'x' ? startX : startY;
    callbacks.end(end, end - start);
    startX = startY = endX = endY = 0;
    started = false;
  });
}
