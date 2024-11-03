const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 创建猫咪图像
const catImage = new Image();
catImage.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNMjU2IDI0MGMtMTMuMyAwLTI0IDEwLjctMjQgMjRzMTAuNyAyNCAyNCAyNCAyNC0xMC43IDI0LTI0LTEwLjctMjQtMjQtMjR6bS0xMjgtMjRjLTEzLjMgMC0yNCAxMC43LTI0IDI0czEwLjcgMjQgMjQgMjQgMjQtMTAuNyAyNC0yNC0xMC43LTI0LTI0LTI0em0yNTYgMGMtMTMuMyAwLTI0IDEwLjctMjQgMjRzMTAuNyAyNCAyNCAyNCAyNC0xMC43IDI0LTI0LTEwLjctMjQtMjQtMjR6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTI1NiAwQzExNC42IDAgMCAxMTQuNiAwIDI1NnMxMTQuNiAyNTYgMjU2IDI1NiAyNTYtMTE0LjYgMjU2LTI1NlMzOTcuNCAwIDI1NiAwem0xMjggMjg4YzAgNTMtNDMgOTYtOTYgOTZzLTk2LTQzLTk2LTk2YzAtODUuNSA0Mi45LTE2MCA5Ni0xNjBzOTYgNzQuNSA5NiAxNjB6Ii8+PC9zdmc+';

// 游戏对象
const player = {
    x: 50,
    y: 200,
    width: 40,
    height: 40,
    speed: 5,
    jumpForce: -12,
    velocityY: 0,
    isJumping: false,
    direction: 1
};

const platforms = [
    { x: 0, y: 350, width: 800, height: 50 },
    { x: 300, y: 250, width: 100, height: 20 },
    { x: 500, y: 150, width: 100, height: 20 },
];

const coins = [
    { x: 320, y: 200, width: 20, height: 20, collected: false },
    { x: 520, y: 100, width: 20, height: 20, collected: false }
];

// 游戏状态
let score = 0;
const gravity = 0.5;
const keys = {};

// 键盘事件监听
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 碰撞检测
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 更新玩家状态
function updatePlayer() {
    // 左右移动
    if (keys['ArrowLeft']) {
        player.x -= player.speed;
        player.direction = -1;
    }
    if (keys['ArrowRight']) {
        player.x += player.speed;
        player.direction = 1;
    }

    // 跳跃
    if (keys['ArrowUp'] && !player.isJumping) {
        player.velocityY = player.jumpForce;
        player.isJumping = true;
    }

    // 应用重力
    player.velocityY += gravity;
    player.y += player.velocityY;

    // 检测平台碰撞
    player.isJumping = true;
    for (let platform of platforms) {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0) {
                player.isJumping = false;
                player.velocityY = 0;
                player.y = platform.y - player.height;
            }
        }
    }

    // 检测金币收集
    for (let coin of coins) {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true;
            score += 10;
        }
    }

    // 边界检查
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
        player.velocityY = 0;
    }
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制猫咪
    ctx.save();
    if (player.direction === -1) {
        // 如果向左移动，翻转猫咪
        ctx.translate(player.x + player.width, player.y);
        ctx.scale(-1, 1);
        ctx.drawImage(catImage, 0, 0, player.width, player.height);
    } else {
        ctx.drawImage(catImage, player.x, player.y, player.width, player.height);
    }
    ctx.restore();

    // 绘制平台
    ctx.fillStyle = '#4CAF50';
    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }

    // 绘制金币
    ctx.fillStyle = '#FFD700';
    for (let coin of coins) {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, 
                   coin.width/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 绘制分数
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('得分: ' + score, 10, 30);
}

// 游戏主循环
function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
}

// 开始游戏
catImage.onload = () => {
    gameLoop();
};