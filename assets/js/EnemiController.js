import Enemi from "./enemi.js";

export default class EnemiController {
  //tiempo min y max que aparecen los enemigos
  ENEMI_INTERVAL_MIN = 400;
  ENEMI_INTERVAL_MAX = 2000;

  nextEnemiInterval = null;
  enemigos = [];

  constructor(ctx, enemiImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.enemiImages = enemiImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextEnemiTime();
  }

  //agarra numero random, y aparece un nuevo enemigo
  setNextEnemiTime() {
    const num = this.getRandomNumber(
      this.ENEMI_INTERVAL_MIN,
      this.ENEMI_INTERVAL_MAX
    );

    this.nextEnemiInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
//crea nuevo enemigo y lo agrega al array de enemigos
  createEnemi() {
    const index = this.getRandomNumber(0, this.enemiImages.length - 1);
    const enemiImage = this.enemiImages[index];
    const x = this.canvas.width * 2;
    const y = this.canvas.height - enemiImage.height;
    const Enemigos = new Enemi(
      this.ctx,
      x,
      y,
      enemiImage.width,
      enemiImage.height,
      enemiImage.image
    );

    this.enemigos.push(Enemigos);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextEnemiInterval <= 0) {
      this.createEnemi();
      this.setNextEnemiTime();
    }
    this.nextEnemiInterval -= frameTimeDelta;

    this.enemigos.forEach((Enemigos) => {
      Enemigos.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.enemigos = this.enemigos.filter((Enemigos) => Enemigos.x > -Enemigos.width);
  }

  draw() {
    this.enemigos.forEach((Enemigos) => Enemigos.draw());
  }
//comprueba si enemigo toca al personaje
  collideWith(sprite) {
    return this.enemigos.some((Enemigos) => Enemigos.collideWith(sprite));
  }
//al reiniciar, elimina los enemigos 
  reset() {
    this.enemigos = [];
  }
}
