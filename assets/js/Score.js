export default class Score {
  score = 0;
  HIGH_SCORE_KEY = "highscore";
  gameWon = false; //  si el juego ha sido ganado

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(frameTimeDelta) {
    if (!this.gameWon) {
      this.score += frameTimeDelta * 0.01;
      // verifica si el puntaje alcanza los 100 puntos
      if (this.score >= 100) {
        this.gameWon = true;
      }
    }
  }

  reset() {
    this.score = 0;
    this.gameWon = false; 
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }
//puntajes
  draw() {
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px Common Pixel`;
    this.ctx.fillStyle = "#525250";
    const scoreX = this.canvas.width - 75 * this.scaleRatio;

    // mostrar el mensaje de ganaste si el juego ha sido ganado
    if (this.gameWon) {
      const text = "YOU WIN";
      
      const textX = this.canvas.width / 2 - this.ctx.measureText(text).width / 2;
      this.ctx.fillText(text, textX, y);
     showGameOver()
    } else {
      const text = "META 100";
      
      const textZ = this.canvas.width / 2 - this.ctx.measureText(text).width / 3;
      this.ctx.fillText(text, textZ, y);
      const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
     
      this.ctx.fillText(scorePadded, scoreX, y);
     
    }
  }
}