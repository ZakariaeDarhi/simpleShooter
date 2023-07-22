const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

class Player {
    constructor(x, y, size, speed, dx, dy) {
        this.x = x
        this.y = y
        this.size = size
        this.speed = speed
        this.dx = dx
        this.dy = dy
    }
    drawPlayer() {
        ctx.fillStyle = 'black'
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    move() {
        this.drawPlayer();

        this.x += this.dx;
        this.y += this.dy;

        this.detectWalls()
    }
    detectWalls() {
        // Left wall
        if (this.x < 0) {
            this.x = 0;
        }

        // Right Wall
        if (this.x + this.size > canvas.width) {
            this.x = canvas.width - this.size;
        }

        // Top wall
        if (this.y < 0) {
            this.y = 0;
        }

        // Bottom Wall
        if (this.y + this.size > canvas.height) {
            this.y = canvas.height - this.size;
        }
    }
    dirDown() {
        this.dy = this.speed
    }
    dirUp() {
        this.dy = -this.speed
    }
    dirLeft() {
        this.dx = -this.speed
    }
    dirRight() {
        this.dx = this.speed
    }
}

class Bullet {
    constructor(x, y, radius, speed, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.speed = speed
        this.velocity = velocity
    }
    drawBullet() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = 'black'
        ctx.fill()
    }
    move() {
        this.drawBullet();
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
    }
    detectWalls() {
        // Left wall
        if (this.x < 0) {
            this.x = 0;
        }

        // Right Wall
        if (this.x + this.size > canvas.width) {
            this.x = canvas.width - this.size;
        }

        // Top wall
        if (this.y < 0) {
            this.y = 0;
        }

        // Bottom Wall
        if (this.y + this.size > canvas.height) {
            this.y = canvas.height - this.size;
        }
    }
}

class Enemy {
    constructor(x, y, radius, speed, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.speed = speed
        this.color = color
        this.velocity = velocity
    }
    drawEnemy() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color;
        ctx.fill()
    }
    move() {
        this.drawEnemy();
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
        this.updateDir()
    }
    updateDir() {
        const angle = Math.atan2(player.y + player.size / 2 - this.y, player.x + player.size / 2 - this.x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        this.velocity = velocity;
    }

}

const player = new Player(canvas.width / 2 - 30, canvas.height / 2 - 30, 30, 3, 0, 0)
const bullets = [];
const enemies = []
let id;

function spawnEnemies() {
    id = setInterval(() => {
        const random = Math.random() * 20
        const radius = random > 10 ? random : 10;
        const x = Math.random() < 0.5 ? 0 - radius : canvas.width
        const y = Math.random() < 0.5 ? 0 - radius : canvas.height
        const color = '#595959'

        const angle = Math.atan2(player.y - player.size / 2 - y, player.x - player.size / 2 - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(
            new Enemy(x, y, radius, 1, color, velocity)
        )
        if (enemies.length > 10) {
            clearInterval(id)
        }
    }, 1000)
}

document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") {
        player.dirLeft();
    } else if (e.key === "ArrowRight") {
        player.dirRight();
    } else if (e.key === "ArrowUp") {
        player.dirUp();
    } else if (e.key === "ArrowDown") {
        player.dirDown();
    }
})
document.addEventListener('keyup', (e) => {
    if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
    ) {
        player.dx = 0
        player.dy = 0
    }
})

window.addEventListener('click', (e) => {
    if (e.target == canvas) {
        var rect = e.target.getBoundingClientRect();
        const mousePos = { x: Math.floor(e.clientX - rect.left), y: Math.floor(e.clientY - rect.top) };
        const angle = Math.atan2(mousePos.y - player.y - player.size / 2, mousePos.x - player.x - player.size / 2)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        bullets.push(
            new Bullet(
                player.x + player.size / 2,
                player.y + player.size / 2,
                5,
                5,
                velocity
            )
        )
    }

});


let updateID;
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateID = requestAnimationFrame(update)
    player.move();
    bullets.forEach((bullet) => {
        bullet.move();
    })
    enemies.forEach((enemy, Eindex) => {
        enemy.move();

        const distance = Math.hypot(player.x + player.size/2 - enemy.x, player.y + player.size/2 - enemy.y)
        
        if (distance - enemy.radius - player.size/2 < 1) {
            cancelAnimationFrame(updateID)
        }
        bullets.forEach((bullet, Bindex) => {
            const distance = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y)
            if (distance - enemy.radius - bullet.radius < 1) {
                setTimeout(()=>{
                    enemies.splice(Eindex, 1)
                    bullets.splice(Bindex, 1)
                },0)
            }
        })
    })
}
function start() {
    update()
    spawnEnemies()
}
