export default class Plataforma {
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;
        this.x = 0;
        this.y = this.canvas.height - this.height;

        this.plataformaImage = new Image();
        this.plataformaImage.src = "./assets/img/Plataforma.png";
       
    }

    update(gameSpeed, frameTimeDelta) {
        this.x -= gameSpeed * frameTimeDelta * this.speed * this.scaleRatio;
    }
//dibuja la plataforma
    draw() {
        this.ctx.drawImage(
            this.plataformaImage,
            this.x,
            this.y,
            this.width,
            this.height
        );
//plataforma sigue de largo
        this.ctx.drawImage(
            this.plataformaImage,
            this.x + this.width,
            this.y,
            this.width,
            this.height
        );

        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    reset() {
        this.x = 0;
    }
}