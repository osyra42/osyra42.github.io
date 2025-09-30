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

    draw(ctx) {
        // Draw player
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
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
    }
}