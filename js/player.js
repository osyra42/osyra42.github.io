class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 3;
        this.color = '#4ECDC4';
        this.targetX = x;
        this.targetY = y;
        this.isMoving = false;
        this.health = 100;
        this.maxHealth = 100;
        this.level = 1;
        this.experience = 0;
        this.actions = ['Attack', 'Defend', 'Use Item'];
        this.selectedAction = 0;
    }

    setTarget(targetX, targetY) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.isMoving = true;
    }

    update() {
        if (!this.isMoving) return;

        // Calculate direction to target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If we're close enough to the target, stop moving
        if (distance < this.speed) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.isMoving = false;
            return;
        }

        // Move towards target
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
    }

    performAction(actionIndex) {
        const actions = {
            0: () => this.attack(),
            1: () => this.defend(),
            2: () => this.useItem()
        };
        
        if (actions[actionIndex]) {
            actions[actionIndex]();
        }
    }

    attack() {
        console.log('Player attacks!');
        // Add attack logic here
    }

    defend() {
        console.log('Player defends!');
        // Add defend logic here
    }

    useItem() {
        console.log('Player uses item!');
        // Add item usage logic here
    }

    cycleAction() {
        this.selectedAction = (this.selectedAction + 1) % this.actions.length;
    }

    draw(ctx) {
        // Draw player
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Draw health bar
        this.drawHealthBar(ctx);
        
        // Draw target indicator if moving
        if (this.isMoving) {
            ctx.strokeStyle = 'rgba(78, 205, 196, 0.5)';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.targetX, this.targetY);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw target circle
            ctx.strokeStyle = '#4ECDC4';
            ctx.beginPath();
            ctx.arc(this.targetX, this.targetY, 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw selected action indicator
        this.drawActionIndicator(ctx);
    }

    drawHealthBar(ctx) {
        const barWidth = 40;
        const barHeight = 4;
        const x = this.x - barWidth / 2;
        const y = this.y - this.height / 2 - 10;
        
        // Background
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Health
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(x, y, healthWidth, barHeight);
        
        // Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    drawActionIndicator(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(this.actions[this.selectedAction], this.x, this.y + 25);
    }
}