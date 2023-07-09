const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

const mousePosText = document.getElementById('mouse-pos');
let mousePos = { x: undefined, y: undefined };

window.addEventListener('mousemove', (e) => {
    if (e.target == canvas) {
        var rect = e.target.getBoundingClientRect();
        mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        mousePosText.textContent = `(${mousePos.x}, ${mousePos.y})`;
    }

});

document.addEventListener('keydown', keydown)
document.addEventListener('keyup', keyup)

canvas.width = 600;
canvas.height = 400;
const player = {
    x: canvas.width / 2 - 30,
    y: canvas.height / 2 - 30,
    size: 30,
    speed: 5,
    dx: 0,
    dy: 0
}

function drawLine() {
    if (mousePos.x) {
        ctx.beginPath();
        ctx.moveTo(player.x + player.size / 2, player.y + player.size / 2)
        ctx.lineTo(mousePos.x, mousePos.y)
        ctx.stroke()
    }
}

function drawPlayer() {
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function move() {
    player.x += player.dx;
    player.y += player.dy;
}

function detectWalls() {
    // Left wall
    if (player.x < 0) {
        player.x = 0;
    }

    // Right Wall
    if (player.x + player.size > canvas.width) {
        player.x = canvas.width - player.size;
    }

    // Top wall
    if (player.y < 0) {
        player.y = 0;
    }

    // Bottom Wall
    if (player.y + player.size > canvas.height) {
        player.y = canvas.height - player.size;
    }
}

function dirDown() {
    player.dy = player.speed
}
function dirUp() {
    player.dy = -player.speed
}
function dirLeft() {
    player.dx = -player.speed
}
function dirRight() {
    player.dx = player.speed
}

function keydown(e) {
    if (e.key === "ArrowLeft") {
        dirLeft();
    } else if (e.key === "ArrowRight") {
        dirRight();
    } else if (e.key === "ArrowUp") {
        dirUp();
    } else if (e.key === "ArrowDown") {
        dirDown();
    }
}
function keyup(e) {
    if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
    ) {
        player.dx = 0
        player.dy = 0
    }
}





function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer()
    drawLine()
    move();
    detectWalls()
    requestAnimationFrame(update)
}


update()