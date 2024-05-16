// type extended = MouseEvent {
//     clientX: number;
//     clientY: number;
//   };
  
  let fallDirection = 1;
  document
    .querySelectorAll<HTMLInputElement>('input[name="trailside"]')
    .forEach(input => {
      input.addEventListener('change', e => {
        fallDirection = parseInt((e.target as HTMLInputElement).value, 10);
      });
    });
  
  let x1 = 0, y1 = 0;
  
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
        dist_to_draw = 50,
        delay = 1000,
        fsize = ['1.1rem', '1.4rem', '.8rem', '1.7rem'],
        colors = ['#E23636', '#F9F3EE', '#E1F8DC', '#B8AFE6', '#AEE1CD', '#5EB0E5'];
  
  const rand = (min: number, max: number): number => 
      Math.floor(Math.random() * (max - min + 1)) + min;
  
  const selRand = <T>(options: T[]): T => 
      options[rand(0, options.length - 1)];
  
  const distanceTo = (x1: number, y1: number, x2: number, y2: number): number => 
      Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)));
  
  const shouldDraw = (x: number, y: number): boolean => 
      distanceTo(x1, y1, x, y) >= dist_to_draw;
  
  const addStr = (x: number, y: number): void => {
      const str = document.createElement("div");
      str.innerHTML = '&#10022;';
      str.className = 'star';
      str.style.top = `${y + rand(-20, 20)}px`;
      str.style.left = `${x}px`;
      str.style.color = selRand(colors);
      str.style.fontSize = selRand(fsize);
      document.body.appendChild(str);
  
      const fs = 10 + 5 * parseFloat(getComputedStyle(str).fontSize);
      str.animate({
          transform: [
            `${rand(-5, 5)}px ${((y + fs) > vh ? vh - y : fs) * fallDirection * 0.3}px`,
            `${rand(-20, 20)}px ${((y + fs) > vh ? vh - y : fs) * fallDirection}px`
          ],
          opacity: [1, 0]
        }, {
          duration: delay,
          fill: 'forwards'
      });
  
      setTimeout(() => str.remove(), delay);
  }
  
  window.addEventListener("mousemove", (e: MouseEvent) => {
    const { clientX, clientY } = e;
    if (shouldDraw(clientX, clientY)) {
      addStr(clientX, clientY);
      x1 = clientX;
      y1 = clientY;
    }
  });
  