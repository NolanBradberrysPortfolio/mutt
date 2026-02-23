// FlappyScene - Parrot Flappy Bird
// Fly through 30 hoops per level. Co-op: each player controls their own parrot.

import { InputManager } from '../../systems/InputManager.js';
import { gameState } from '../../systems/GameState.js';

export class FlappyScene extends Phaser.Scene {
    constructor() {
        super('FlappyScene');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.input_mgr = new InputManager(this);
        this.input_mgr.init(gameState.playerCount);

        // Sky background
        this.add.rectangle(w / 2, h / 2, w, h, 0x87CEEB);

        // Clouds (decorative)
        for (let i = 0; i < 8; i++) {
            const cloud = this.add.rectangle(
                Math.random() * w, Math.random() * h * 0.6,
                Math.random() * 80 + 40, Math.random() * 20 + 10,
                0xffffff, 0.7
            );
            this.tweens.add({
                targets: cloud,
                x: cloud.x - 50,
                duration: Math.random() * 5000 + 5000,
                yoyo: true,
                repeat: -1
            });
        }

        // Game state
        this.score = 0;
        this.hoopsCleared = 0;
        this.totalHoops = 15;
        this.gameOver = false;
        this.started = false;
        this.scrollSpeed = 3;
        this.gravity = 0.35;
        this.flapStrength = -7;

        // Create parrots for each player
        this.parrots = [];
        const playerColors = [0x00cc44, 0xff4444, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff];

        for (let i = 0; i < gameState.playerCount; i++) {
            const parrot = this.add.sprite(150, 200 + i * 50, 'parrot').setScale(1.5);
            parrot.playerIndex = i;
            parrot.alive = true;
            parrot.vy = 0;
            if (i > 0) parrot.setTint(playerColors[i]);
            this.parrots.push(parrot);
        }

        // Hoops (pipes/rings to fly through)
        this.hoops = [];
        this.hoopPairs = [];
        this.nextHoopX = 400;
        this.generateHoops();

        // Ground
        this.ground = this.add.rectangle(w / 2, h - 15, w, 30, 0x44aa44);

        // UI
        this.scoreText = this.add.text(w / 2, 30, '0 / ' + this.totalHoops, {
            fontSize: '24px', fill: '#000000', fontFamily: 'monospace',
            fontStyle: 'bold', stroke: '#ffffff', strokeThickness: 3
        }).setOrigin(0.5).setDepth(50);

        this.instructionText = this.add.text(w / 2, h / 2, 'Press SPACE to flap!', {
            fontSize: '20px', fill: '#333333', fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(50);

        this.cameras.main.fadeIn(400);
    }

    generateHoops() {
        for (let i = 0; i < this.totalHoops; i++) {
            const x = this.nextHoopX + i * 280;
            const gapY = Phaser.Math.Between(150, 400);
            const gapSize = 180;

            // Top pipe
            const topPipeHeight = gapY - gapSize / 2;
            const topPipe = this.add.rectangle(x, topPipeHeight / 2, 48, topPipeHeight, 0x44aa44)
                .setStrokeStyle(2, 0x338833);

            // Bottom pipe
            const bottomPipeTop = gapY + gapSize / 2;
            const bottomPipeHeight = 600 - bottomPipeTop - 30;
            const bottomPipe = this.add.rectangle(x, bottomPipeTop + bottomPipeHeight / 2, 48, bottomPipeHeight, 0x44aa44)
                .setStrokeStyle(2, 0x338833);

            // Hoop ring in the gap (visual indicator)
            const hoop = this.add.sprite(x, gapY, 'hoop').setScale(2.5);

            this.hoopPairs.push({
                topPipe, bottomPipe, hoop,
                x: x, gapY: gapY, gapSize: gapSize,
                scored: false
            });
        }
    }

    update(time, delta) {
        if (this.gameOver) return;

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Check for flap to start
        if (!this.started) {
            for (let i = 0; i < gameState.playerCount; i++) {
                const input = this.input_mgr.getInput(i);
                if (input.action1Down) {
                    this.started = true;
                    this.instructionText.destroy();
                    break;
                }
            }
            if (!this.started) return;
        }

        // Player input & physics
        let anyAlive = false;
        for (let i = 0; i < gameState.playerCount; i++) {
            const parrot = this.parrots[i];
            if (!parrot.alive) continue;
            anyAlive = true;

            const input = this.input_mgr.getInput(i);

            // Flap
            if (input.action1Down) {
                parrot.vy = this.flapStrength;
                try { this.sound.play('sfx_flap', { volume: 0.3, rate: 0.9 + Math.random() * 0.2 }); } catch(e) {}

                // Tilt up animation
                parrot.setAngle(-20);
                this.tweens.add({
                    targets: parrot,
                    angle: 30,
                    duration: 600,
                    ease: 'Linear'
                });
            }

            // Gravity
            parrot.vy += this.gravity;
            parrot.y += parrot.vy;

            // Ground/ceiling collision
            if (parrot.y > h - 45) {
                this.killParrot(parrot);
            }
            if (parrot.y < 15) {
                parrot.y = 15;
                parrot.vy = 0;
            }
        }

        // Scroll hoops
        for (const pair of this.hoopPairs) {
            pair.topPipe.x -= this.scrollSpeed;
            pair.bottomPipe.x -= this.scrollSpeed;
            pair.hoop.x -= this.scrollSpeed;
            pair.x -= this.scrollSpeed;

            // Score when passing through
            if (!pair.scored && pair.x < 150) {
                pair.scored = true;
                let allThrough = true;

                // Check all alive parrots are in the gap
                for (const parrot of this.parrots) {
                    if (!parrot.alive) continue;
                    const dy = Math.abs(parrot.y - pair.gapY);
                    if (dy > pair.gapSize / 2 - 10) {
                        // Hit pipe
                        this.killParrot(parrot);
                        allThrough = false;
                    }
                }

                if (allThrough && this.parrots.some(p => p.alive)) {
                    this.hoopsCleared++;
                    this.score += 100;
                    this.scoreText.setText(this.hoopsCleared + ' / ' + this.totalHoops);

                    // Hoop cleared effect
                    pair.hoop.setTint(0x00ff00);
                    try { this.sound.play('sfx_score', { volume: 0.3 }); } catch(e) {}

                    if (this.hoopsCleared >= this.totalHoops) {
                        this.completeLevel();
                        return;
                    }
                }
            }

            // Collision check for pipes
            for (const parrot of this.parrots) {
                if (!parrot.alive) continue;
                if (Math.abs(parrot.x - pair.x) < 30) {
                    const dy = Math.abs(parrot.y - pair.gapY);
                    if (dy > pair.gapSize / 2 - 15) {
                        this.killParrot(parrot);
                    }
                }
            }
        }

        // Check all dead
        if (!anyAlive && !this.gameOver) {
            this.gameOver = true;
            this.endGame(false);
        }

        // Increase speed gradually
        this.scrollSpeed = 3 + this.hoopsCleared * 0.05;
    }

    killParrot(parrot) {
        if (!parrot.alive) return;
        parrot.alive = false;
        parrot.setTint(0x666666);
        parrot.vy = 0;
        try { this.sound.play('sfx_death', { volume: 0.4 }); } catch(e) {}
        this.cameras.main.shake(100, 0.01);
    }

    completeLevel() {
        this.gameOver = true;
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const complete = this.add.text(w / 2, h / 2, 'ALL HOOPS CLEARED!', {
            fontSize: '28px', fill: '#ffff00', fontFamily: 'monospace',
            fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);

        try { this.sound.play('sfx_powerup', { volume: 0.5 }); } catch(e) {}

        this.time.delayedCall(2500, () => this.endGame(true));
    }

    endGame(won) {
        const scores = {};
        for (let i = 0; i < gameState.playerCount; i++) {
            scores[i] = this.score;
        }
        gameState.recordScore('flappy', scores);

        this.input_mgr.cleanup();

        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('ResultsScene', {
                gameName: 'Parrot Flappy Bird',
                scores: scores,
                won: won,
                nextScene: gameState.mode === 'story' ? 'story_next' : 'MenuScene'
            });
        });
    }
}
