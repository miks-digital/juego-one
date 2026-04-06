document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');

    // Game variables
    let score = 0;
    let currentLevel = 1;
    let levelCompleted = false;
    const gravity = 0.5;
    const jumpStrength = -12;
    const playerSpeed = 5;

    // Levels definition
    const levels = [
        {
            platforms: [
                { x: 0, y: 350, width: 200, height: 50 },
                { x: 250, y: 300, width: 150, height: 50 },
                { x: 450, y: 250, width: 150, height: 50 },
                { x: 650, y: 200, width: 150, height: 50 }
            ],
            coins: [
                { x: 100, y: 320, width: 10, height: 10, collected: false },
                { x: 300, y: 270, width: 10, height: 10, collected: false },
                { x: 500, y: 220, width: 10, height: 10, collected: false },
                { x: 700, y: 190, width: 10, height: 10, collected: false }
            ],
            spikes: []
        },
        {
            platforms: [
                { x: 0, y: 350, width: 150, height: 50 },
                { x: 200, y: 300, width: 100, height: 50 },
                { x: 350, y: 250, width: 100, height: 50 },
                { x: 500, y: 200, width: 100, height: 50 },
                { x: 650, y: 150, width: 150, height: 50 }
            ],
            coins: [
                { x: 50, y: 320, width: 10, height: 10, collected: false },
                { x: 250, y: 270, width: 10, height: 10, collected: false },
                { x: 400, y: 220, width: 10, height: 10, collected: false },
                { x: 550, y: 120, width: 10, height: 10, collected: false },
                { x: 700, y: 120, width: 10, height: 10, collected: false }
            ],
            spikes: [
                { x: 300, y: 280, width: 100, height: 20 }
            ]
        },
        {
            platforms: [
                { x: 0, y: 350, width: 100, height: 50 },
                { x: 150, y: 300, width: 100, height: 50 },
                { x: 300, y: 250, width: 100, height: 50 },
                { x: 450, y: 200, width: 100, height: 50 },
                { x: 600, y: 150, width: 100, height: 50 },
                { x: 750, y: 100, width: 50, height: 50 }
            ],
            coins: [
                { x: 50, y: 320, width: 10, height: 10, collected: false },
                { x: 200, y: 270, width: 10, height: 10, collected: false },
                { x: 350, y: 220, width: 10, height: 10, collected: false },
                { x: 500, y: 170, width: 10, height: 10, collected: false },
                { x: 650, y: 120, width: 10, height: 10, collected: false },
                { x: 760, y: 70, width: 10, height: 10, collected: false }
            ],
            spikes: []
        }
    ];

    let platforms = levels[0].platforms;
    let coins = levels[0].coins;
    let spikes = levels[0].spikes;

    // Player
    const player = {
        x: 50,
        y: 300,
        width: 30,
        height: 30,
        velocityX: 0,
        velocityY: 0,
        onGround: false
    };

    // Input
    const keys = {};
    document.addEventListener('keydown', (e) => keys[e.code] = true);
    document.addEventListener('keyup', (e) => keys[e.code] = false);

    // Reset keys when window loses focus
    window.addEventListener('blur', () => {
        Object.keys(keys).forEach(key => keys[key] = false);
    });

    function resetToLevel1() {
        currentLevel = 1;
        platforms = levels[0].platforms;
        coins = levels[0].coins.map(coin => ({ ...coin, collected: false }));
        spikes = levels[0].spikes;
        player.x = 50;
        player.y = 300;
        player.velocityX = 0;
        player.velocityY = 0;
        levelElement.textContent = currentLevel;
        levelCompleted = false;
    }

    function nextLevel() {
        currentLevel++;
        if (currentLevel > levels.length) {
            // Show congratulations screen
            document.getElementById('game-container').style.display = 'none';
            document.getElementById('congratulations').style.display = 'block';
            document.getElementById('final-score').textContent = score;
            return; // Don't reset yet
        }
        platforms = levels[currentLevel - 1].platforms;
        coins = levels[currentLevel - 1].coins.map(coin => ({ ...coin, collected: false }));
        spikes = levels[currentLevel - 1].spikes;
        player.x = 50;
        player.y = 300;
        player.velocityX = 0;
        player.velocityY = 0;
        levelElement.textContent = currentLevel;
        levelCompleted = false;
    }

    function update() {
        // Player movement
        if (keys['ArrowLeft']) {
            player.velocityX = -playerSpeed;
        } else if (keys['ArrowRight']) {
            player.velocityX = playerSpeed;
        } else {
            player.velocityX = 0;
        }

        if (keys['Space'] && player.onGround) {
            player.velocityY = jumpStrength;
            player.onGround = false;
        }

        // Apply gravity
        player.velocityY += gravity;

        // Update position
        player.x += player.velocityX;
        player.y += player.velocityY;

        // Platform collision
        player.onGround = false;
        platforms.forEach(platform => {
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y + platform.height &&
                player.y + player.height > platform.y) {
                if (player.velocityY > 0 && player.y < platform.y) {
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    player.onGround = true;
                }
            }
        });

        // Coin collision
        coins.forEach(coin => {
            if (!coin.collected &&
                player.x < coin.x + coin.width &&
                player.x + player.width > coin.x &&
                player.y < coin.y + coin.height &&
                player.y + player.height > coin.y) {
                coin.collected = true;
                score += 10;
                scoreElement.textContent = score;
            }
        });

        // Spike collision
        spikes.forEach(spike => {
            if (player.x < spike.x + spike.width &&
                player.x + player.width > spike.x &&
                player.y < spike.y + spike.height &&
                player.y + player.height > spike.y) {
                resetToLevel1();
            }
        });

        // Check if all coins collected
        if (!levelCompleted && coins.every(coin => coin.collected)) {
            levelCompleted = true;
            nextLevel(); // Advance immediately
        }

        // Keep player in bounds
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        // Reset if fallen off
        if (player.y > canvas.height) {
            player.x = 50;
            player.y = 300;
            player.velocityX = 0;
            player.velocityY = 0;
        }
    }

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw platforms
        ctx.fillStyle = '#8B4513';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });

        // Draw spikes
        ctx.fillStyle = '#FF0000';
        spikes.forEach(spike => {
            ctx.fillRect(spike.x, spike.y, spike.width, spike.height);
        });

        // Draw coins
        ctx.fillStyle = '#FFD700';
        coins.forEach(coin => {
            if (!coin.collected) {
                ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
            }
        });

        // Draw player
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function restartGame() {
        currentLevel = 1;
        score = 0;
        platforms = levels[0].platforms;
        coins = levels[0].coins.map(coin => ({ ...coin, collected: false }));
        spikes = levels[0].spikes;
        player.x = 50;
        player.y = 300;
        player.velocityX = 0;
        player.velocityY = 0;
        levelElement.textContent = currentLevel;
        scoreElement.textContent = score;
        levelCompleted = false;
        document.getElementById('game-container').style.display = 'block';
        document.getElementById('congratulations').style.display = 'none';
    }

    // Add event listener for restart button
    document.getElementById('restart-btn').addEventListener('click', restartGame);

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
