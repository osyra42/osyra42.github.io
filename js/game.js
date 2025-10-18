class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadingScreen = document.getElementById('loading-screen');
        
        // Game state
        this.player = null;
        this.lastTime = 0;
        this.animationId = null;
        this.zoom = 1;
        this.cameraX = 0;
        this.cameraY = 0;
        this.enemies = [];
        this.items = [];
        
        // Initialize game
        this.init();
    }

    init() {
        // Create player in the center of the canvas
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        
        // Create some test enemies and items
        this.createTestEntities();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Hide loading screen and start game loop
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.startGameLoop();
        }, 1000);
    }

    createTestEntities() {
        // Create some test enemies
        for (let i = 0; i < 5; i++) {
            this.enemies.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                width: 15,
                height: 15,
                color: '#FF6B6B',
                type: 'slime'
            });
        }

        // Create some test items
        for (let i = 0; i < 3; i++) {
            this.items.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                width: 12,
                height: 12,
                color: '#FFD166',
                type: 'health_potion'
            });
        }
    }

    setupEventListeners() {
        // Left click to move
        this.canvas.addEventListener('click', (e) => {
            const { x, y } = this.getCanvasCoordinates(e);
            this.player.setTarget(x, y);
        });

        // Right click to perform action
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.player.performAction(this.player.selectedAction);
        });

        // Mouse wheel to cycle through actions
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                this.player.cycleAction();
            } else {
                this.player.selectedAction = (this.player.selectedAction - 1 + this.player.actions.length) % this.player.actions.length;
            }
        });

        // Double click for special action (like interact)
        this.canvas.addEventListener('dblclick', (e) => {
            const { x, y } = this.getCanvasCoordinates(e);
            console.log('Double click at:', x, y);
            // Add interaction logic here (open chests, talk to NPCs, etc.)
        });

        // Prevent right-click menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    startGameLoop() {
        this.lastTime = performance.now();
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update game state
        this.update(deltaTime);
        
        // Render everything
        this.render();
        
        // Continue the game loop
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        this.player.update();
        this.checkCollisions();
    }

    checkCollisions() {
        // Simple collision detection with enemies
        this.enemies.forEach(enemy => {
            const distance = Math.sqrt(
                Math.pow(this.player.x - enemy.x, 2) + 
                Math.pow(this.player.y - enemy.y, 2)
            );
            
            if (distance < (this.player.width + enemy.width) / 2) {
                // Collision detected
                enemy.color = '#FF0000'; // Flash red
                setTimeout(() => {
                    enemy.color = '#FF6B6B';
                }, 200);
            }
        });
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0f0f1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid for visual reference
        this.drawGrid();
        
        // Draw enemies
        this.drawEnemies();
        
        // Draw items
        this.drawItems();
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw UI information
        this.drawUI();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 40;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
            
            // Draw enemy type label
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = '10px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(enemy.type, enemy.x, enemy.y + 15);
        });
    }

    drawItems() {
        this.items.forEach(item => {
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(item.x - item.width / 2, item.y - item.height / 2, item.width, item.height);
            
            // Draw item type label
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = '8px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.type, item.x, item.y + 12);
        });
    }

    drawUI() {
        this.ctx.fillStyle = '#e6e6e6';
        this.ctx.font = '14px Courier New';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText(`Position: ${Math.floor(this.player.x)}, ${Math.floor(this.player.y)}`, 10, 20);
        this.ctx.fillText(`Health: ${this.player.health}/${this.player.maxHealth}`, 10, 40);
        this.ctx.fillText(`Level: ${this.player.level}`, 10, 60);
        this.ctx.fillText(`Action: ${this.player.actions[this.player.selectedAction]}`, 10, 80);
        
        // Draw controls help
        this.ctx.fillStyle = 'rgba(160, 160, 192, 0.8)';
        this.ctx.font = '12px Courier New';
        this.ctx.fillText('Left-click: Move', this.canvas.width - 150, 20);
        this.ctx.fillText('Right-click: Use Action', this.canvas.width - 150, 40);
        this.ctx.fillText('Mouse Wheel: Change Action', this.canvas.width - 150, 60);
        this.ctx.fillText('Double-click: Interact', this.canvas.width - 150, 80);
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});