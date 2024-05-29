const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const spaceshipImg = new Image();
const asteroidImg = new Image();
const backgroundImg = new Image();
spaceshipImg.src = 'spaceship.png';
asteroidImg.src = 'asteroid.png';
backgroundImg.src = 'space-bg.jpg';

// Player object
const player = {
    x: 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    dx: 0,
    dy: 0,
    speed: 5,
    gravity: 1,
    jumpPower: -20,
    isJumping: false
};

// Background position
let backgroundX = 0;

// Obstacles array
let obstacles = [];
let frame = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameOver = false;

// Draw player function
function drawPlayer() {
    ctx.drawImage(spaceshipImg, player.x, player.y, player.width, player.height);
}

// Draw obstacles function
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(asteroidImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Update player function
function updatePlayer() {
    player.y += player.dy;
    player.x += player.dx;

    // Apply gravity
    if (player.y + player.height < canvas.height) {
        player.dy += player.gravity;
    } else {
        player.dy = 0;
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }

    // Prevent the player from moving out of bounds
    if (player.y < 0) player.y = 0;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Create obstacle function
function createObstacle() {
    if (frame % 120 === 0) {
        const obstacle = {
            x: canvas.width,
            y: Math.random() * (canvas.height - 50),
            width: 50,
            height: 50,
            speed: 5
        };
        obstacles.push(obstacle);
    }
}

// Update obstacles function
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacle.speed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Detect collision function
function detectCollision() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            endGame();
        }
    });
}

// End game function
function endGame() {
    gameOver = true;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    gameOverScreen.style.display = 'block';
}

// Draw background function
function drawBackground() {
    // Move the background to the left
    backgroundX -= 2;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }

    // Draw the background image twice for a continuous loop
    ctx.drawImage(backgroundImg, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);
}

// Game loop function
function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawPlayer();
        drawObstacles();
        updatePlayer();
        createObstacle();
        updateObstacles();
        detectCollision();
        score++;
        scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
        frame++;
        requestAnimationFrame(gameLoop);
    }
}

// Restart game function
function restartGame() {
    player.x = 50;
    player.y = canvas.height - 150;
    player.dx = 0;
    player.dy = 0;
    obstacles = [];
    frame = 0;
    score = 0;
    gameOver = false;
    gameOverScreen.style.display = 'none';
    gameLoop();
}

// Handle keydown event
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Space':
            if (!player.isJumping) {
                player.dy = player.jumpPower;
                player.isJumping = true;
            }
            break;
        case 'ArrowUp':
            player.dy = -player.speed;
            break;
        case 'ArrowDown':
            player.dy = player.speed;
            break;
        case 'ArrowLeft':
            player.dx = -player.speed;
            break;
        case 'ArrowRight':
            player.dx = player.speed;
            break;
    }
});

// Handle keyup event
document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'ArrowUp':
        case 'ArrowDown':
            player.dy = 0;
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            player.dx = 0;
            break;
    }
});

// Start the game after images are loaded
spaceshipImg.onload = () => {
    asteroidImg.onload = () => {
        backgroundImg.onload = () => {
            gameLoop();
        };
    };
};
