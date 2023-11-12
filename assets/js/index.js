let sonido=new Audio ("./assets/audio/gnork-party-improved-171719.mp3")
sonido.play();
import Bobby from "./bobby.js";
import Plataforma from "./plataforma.js";
import EnemiController from "./EnemiController.js";
import Score from "./Score.js"; 

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const BOBBY_WIDTH = 58
const BOBBY_HEIGHT = 62;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const PLATAFORMA_WIDTH = 2400;
const PLATAFORMA_HEIGHT = 24;
const PLATAFORMA_AND_ENEMI_SPEED =0.8;
const META_ENTRY_SPEED = 2;
const ENEMI_CONFIG = [
    { width: 48 / 1.5, height: 100 / 1.2, image: "./assets/img/serpiente.png" },
    { width: 98 / 1.5, height: 100 / 1.2, image: "./assets/img/abeja.png" },
];

//Objetos del juego

let bobby = null;
let plataforma = null;
let enemiController = null;
let score = null 
let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
    const bobbyWidthInGame = BOBBY_WIDTH * scaleRatio;
    const bobbyHeightInGame = BOBBY_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;
    const plataformaWidthInGame = PLATAFORMA_WIDTH * scaleRatio;
    const plataformaHeightInGame = PLATAFORMA_HEIGHT * scaleRatio;
    
    
    bobby = new Bobby(
        ctx,
        bobbyWidthInGame,
        bobbyHeightInGame,
        minJumpHeightInGame,
        maxJumpHeightInGame,
        scaleRatio
    );

    plataforma = new Plataforma(
        ctx,
        plataformaWidthInGame,
        plataformaHeightInGame,
        PLATAFORMA_AND_ENEMI_SPEED,
        scaleRatio
    );

    const enemiImages = ENEMI_CONFIG.map((Enemigos) => {
        const image = new Image();
        image.src = Enemigos.image;
        return {
            image: image,
            width: Enemigos.width * scaleRatio,
            height: Enemigos.height * scaleRatio,
        };
    });

    enemiController = new EnemiController(
        ctx,
        enemiImages,
        scaleRatio,
        PLATAFORMA_AND_ENEMI_SPEED
    );

    score = new Score(ctx, scaleRatio);
}
//Dimensiona el tamaño del canva 
function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}

setScreen();
//cambia la orientacion del canva
window.addEventListener("resize", () => setTimeout(setScreen, 500));

if (screen.orientation) {
    screen.orientation.addEventListener("change", setScreen);
}

//escala 
function getScaleRatio() {
    const screenHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
    );

    const screenWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth
    );

    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    } else {
        return screenHeight / GAME_HEIGHT;
    }
}

function showGameOver() {
    const fontSize = 20 * scaleRatio;
    ctx.font = `${fontSize}px Common Pixel`;
    ctx.fillStyle = "grey";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText("Replay?(presione espacio)", x, y);
}

function setupGameReset() {
    if (!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart = true;

        setTimeout(() => {
            window.addEventListener("keyup", reset, { once: true });
            window.addEventListener("touchstart", reset, { once: true });
        }, 1000);
    }
}

//reinicia el juego
function reset() {
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    waitingToStart = false;
    plataforma.reset();
    enemiController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;
   
}


function showStartGameText() {
    const fontSize = 20 * scaleRatio;
    ctx.font = `${fontSize}px Common Pixel`;
    ctx.fillStyle = "grey";
    const x = canvas.width / 14;
    const y = canvas.height / 2;
    ctx.fillText("Presione espacio para comenzar", x, y);
   
}

//actualizar la velocidad 
function updateGameSpeed(frameTimeDelta) {
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}


function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//loop 
function gameLoop(currentTime) {
    if (previousTime === null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen();

    if (!gameOver && !waitingToStart) {
        //subir objetos del juego 
        plataforma.update(gameSpeed, frameTimeDelta);
        enemiController.update(gameSpeed, frameTimeDelta);
        bobby.update(gameSpeed, frameTimeDelta);
        score.update(frameTimeDelta);
        updateGameSpeed(frameTimeDelta);
    }

    if (!gameOver && enemiController.collideWith(bobby)) {
        gameOver = true;
        setupGameReset();
        score.setHighScore();
    }
    plataforma.draw();
    enemiController.draw();
    bobby.draw();
    score.draw();

    if (gameOver) {
        showGameOver();
    }

    if (waitingToStart) {
        showStartGameText();
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });

