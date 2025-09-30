class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadingScreen = document.getElementById('loading-screen');
        
        // Game state
        this.player = null;
        this.lastTime = 0;
        this.animationId = null;
        
        // Initialize game
        this.init();
    }

    init() {
        // Create player in the center of the canvas
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Hide loading screen and start game loop
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.startGameLoop();
        }, 1000);
    }

    setupEventListeners() {
        // Click to move
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            const clickX = (e.clientX - rect.left) * scaleX;
            const clickY = (e.clientY - rect.top) * scaleY;
            
            this.player.setTarget(clickX, clickY);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            // You could add responsive scaling here if needed
        });
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
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0f0f1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid for visual reference (optional)
        this.drawGrid();
        
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

    drawUI() {
        this.ctx.fillStyle = '#e6e6e6';
        this.ctx.font = '14px Courier New';
        this.ctx.fillText(`Position: ${Math.floor(this.player.x)}, ${Math.floor(this.player.y)}`, 10, 20);
        this.ctx.fillText(`Target: ${Math.floor(this.player.targetX)}, ${Math.floor(this.player.targetY)}`, 10, 40);
        this.ctx.fillText(`Moving: ${this.player.isMoving ? 'Yes' : 'No'}`, 10, 60);
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