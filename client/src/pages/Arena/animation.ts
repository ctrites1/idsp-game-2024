const sparkle = document.querySelector<HTMLElement>(".sparkle");

let currentStarCount = 0;

const MAX_STARS = 60;
const STAR_INTERVAL = 16;

const MAX_STAR_LIFE = 3;
const MIN_STAR_LIFE = 1;

const MAX_STAR_SIZE = 70;
const MIN_STAR_SIZE = 30;

const MIN_STAR_TRAVEL_X = 100;
const MIN_STAR_TRAVEL_Y = 100;

class Star {
  size: number;
  x: number;
  y: number;
  xDir: number;
  yDir: number;
  xMaxTravel: number;
  yMaxTravel: number;
  xTravelDist: number;
  yTravelDist: number;
  xEnd: number;
  yEnd: number;
  life: number;
  star: HTMLDivElement;

  constructor() {
    if (!sparkle) throw new Error("Sparkle element not found");

    this.size = this.random(MAX_STAR_SIZE, MIN_STAR_SIZE);

    this.x = this.random(
      sparkle.offsetWidth * 0.75,
      sparkle.offsetWidth * 0.25
    );
    this.y = sparkle.offsetHeight / 2 - this.size / 2;

    this.xDir = this.randomMinus();
    this.yDir = this.randomMinus();

    this.xMaxTravel =
      this.xDir === -1 ? this.x : sparkle.offsetWidth - this.x - this.size;
    this.yMaxTravel = sparkle.offsetHeight / 2 - this.size;

    this.xTravelDist = this.random(this.xMaxTravel, MIN_STAR_TRAVEL_X);
    this.yTravelDist = this.random(this.yMaxTravel, MIN_STAR_TRAVEL_Y);

    this.xEnd = this.x + this.xTravelDist * this.xDir;
    this.yEnd = this.y + this.yTravelDist * this.yDir;

    this.life = this.random(MAX_STAR_LIFE, MIN_STAR_LIFE);

    this.star = document.createElement("div");
    this.star.classList.add("star");

    this.star.style.setProperty("--start-left", this.x + "px");
    this.star.style.setProperty("--start-top", this.y + "px");

    this.star.style.setProperty("--end-left", this.xEnd + "px");
    this.star.style.setProperty("--end-top", this.yEnd + "px");

    this.star.style.setProperty("--star-life", this.life + "s");
    this.star.style.setProperty("--star-life-num", this.life.toString());

    this.star.style.setProperty("--star-size", this.size + "px");
    this.star.style.setProperty("--star-color", this.randomRainbowColor());
  }

  draw() {
    if (!sparkle) throw new Error("Sparkle element not found");
    sparkle.appendChild(this.star);
  }

  pop() {
    if (!sparkle) throw new Error("Sparkle element not found");
    sparkle.removeChild(this.star);
  }

  random(max: number, min: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomRainbowColor(): string {
    return `hsla(${this.random(360, 0)}, 100%, 50%, 1)`;
  }

  randomMinus(): number {
    return Math.random() > 0.5 ? 1 : -1;
  }
}

setInterval(() => {
  if (currentStarCount >= MAX_STARS) {
    return;
  }

  currentStarCount++;

  const newStar = new Star();

  newStar.draw();

  setTimeout(() => {
    currentStarCount--;

    newStar.pop();
  }, newStar.life * 1000);
}, STAR_INTERVAL);
