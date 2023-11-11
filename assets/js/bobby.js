export default class Bobby {
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    bobbyRunImages = [];
    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.4;
    GRAVITY = 0.4;
    

    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 20 * scaleRatio;
        this.y = this.canvas.height - this.height - 20 * scaleRatio;
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = "./assets/img/personaje.png";
        this.image = this.standingStillImage;

        const bobbyRunImage1 = new Image();
        bobbyRunImage1.src = "./assets/img/personaje.png";

        const bobbyRunImage2 = new Image();
        bobbyRunImage2.src = "./assets/img/personaje.png";

        this.bobbyRunImages.push(bobbyRunImage1);
        this.bobbyRunImages.push(bobbyRunImage2);

        //teclado
        window.removeEventListener("keydown", this.keydown);
        window.removeEventListener("keyup", this.keyup);

        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);

        //toque
        window.removeEventListener("touchstart", this.touchstart);
        window.removeEventListener("touchend", this.touchend);

     
    }
//si presiona espacio=true
    touchstart = () => {
        this.jumpPressed = true;
    };
//si no presiona espacio=false
    touchend = () => {
        this.jumpPressed = false;
    };
//por cada toque
    keydown = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = true;
        }
    };
//por cada toque
    keyup = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = false;
        }
    };

    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);

        if (this.jumpInProgress) {
            this.image = this.standingStillImage;
        }

        this.jump(frameTimeDelta);
    }

    jump(frameTimeDelta) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        if (this.jumpInProgress && !this.falling) {
            if (
                this.y > this.canvas.height - this.minJumpHeight ||
                (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
            ) {
                this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
            } else {
                this.falling = true;
            }
        } else {
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;
                }
            } else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }

    run(gameSpeed, frameTimeDelta) {
        if (this.walkAnimationTimer <= 0) {
            if (this.image === this.bobbyRunImages[0]) {
                this.image = this.bobbyRunImages[1];
            } else {
                this.image = this.bobbyRunImages[0];
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}