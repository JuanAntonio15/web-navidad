const cover = document.getElementById("cover");
const content = document.getElementById("content");

const gameArea = document.getElementById("game-area");
const prizeText = document.getElementById("prize-text");
const scratchCanvas = document.getElementById("scratchCanvas");

let currentPrize = null;

cover.addEventListener("click", start);

function start() {
    cover.style.display = "none";
    content.style.display = "flex";
    startGame();
}

function startGame() {
    prizeText.classList.remove("winner");

    // Genera número aleatorio del 1 al 5
    currentPrize = Math.floor(Math.random() * 5) + 1;

    // Mostrar número (o texto si quieres)
    prizeText.innerText = currentPrize === 5
        ? "¡GANASTE! 🥳🎉"
        : "SIGA PARTICIPANDO 😢";

    initScratch();
}

function initScratch() {
    const ctx = scratchCanvas.getContext("2d");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#999";
    ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    let drawing = false;

    function scratch(e) {
        if (!drawing) return;

        const rect = scratchCanvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
    }

    scratchCanvas.onmousedown = () => drawing = true;
    scratchCanvas.ontouchstart = () => drawing = true;
    window.onmouseup = () => drawing = false;
    window.ontouchend = () => drawing = false;

    scratchCanvas.onmousemove = scratch;
    scratchCanvas.ontouchmove = scratch;

    checkReveal(ctx);
}

function checkReveal(ctx) {
    const interval = setInterval(() => {
        const pixels = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
        let cleared = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) cleared++;
        }

        // Si raspó ~40%
        if (cleared > pixels.length / 10) {
            clearInterval(interval);
            finishGame();
        }
    }, 500);
}

function finishGame() {
    if (currentPrize === 5) {
        prizeText.classList.add("winner");
        launchConfetti();

        // Después de 5 segundos → pantalla 3
        setTimeout(showWinnerScreen, 5000);
    } else {
        setTimeout(startGame, 5000);
    }
}

function launchConfetti() {
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.background = i % 2 ? "#d4af37" : "#f3d58a";
        confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

function showWinnerScreen() {
    content.style.display = "none";

    const winnerScreen = document.getElementById("winner-screen");
    winnerScreen.style.display = "flex";

    // Confetti continuo
    launchConfetti();
    setInterval(launchConfetti, 3000);
}