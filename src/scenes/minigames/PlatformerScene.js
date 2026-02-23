// PlatformerScene - Wiener Dog Mario
// Side-scrolling platformer. Enemies are wiener dogs that become hot dogs when stomped.

import { InputManager } from '../../systems/InputManager.js';
import { gameState } from '../../systems/GameState.js';

export class PlatformerScene extends Phaser.Scene {
    constructor() {
        super('PlatformerScene');
    }

    create() {
        const w = this.cameras.main.width;

        this.input_mgr = new InputManager(this);
        this.input_mgr.init(gameState.playerCount);

        // Sky background
        this.add.rectangle(400, 300, 2400, 600, 0x87CEEB);

        // Level dimensions
        this.levelWidth = 2400;
        this.levelHeight = 600;

        // Physics settings
        this.physics.world.gravity.y = 800;
        this.physics.world.setBounds(0, 0, this.levelWidth, this.levelHeight);

        // Game state
        this.score = [];
        this.lives = [];
        this.gameOver = false;
        this.levelComplete = false;

        // Create ground and platforms
        this.platforms = this.physics.add.staticGroup();
        this.buildLevel();

        // Create players
        this.players = [];
        for (let i = 0; i < gameState.playerCount; i++) {
            const charIndex = gameState.characters[i] || 0;
            const player = this.physics.add.sprite(100 + i * 40, 400, 'dog_' + charIndex).setScale(2);
            player.setBounce(0.1);
            player.setCollideWorldBounds(true);
            player.playerIndex = i;
            player.alive = true;
            player.hasFire = false;
            player.isGiant = false;
            player.jumpHeld = false;
            this.players.push(player);
            this.score.push(0);
            this.lives.push(3);

            this.physics.add.collider(player, this.platforms);
        }

        // Enemies
        this.enemyGroup = this.physics.add.group();
        this.hotDogGroup = this.physics.add.group();
        this.spawnEnemies();

        // Power-ups
        this.powerUpGroup = this.physics.add.group();
        this.spawnPowerUps();

        // Collisions
        for (const player of this.players) {
            this.physics.add.collider(player, this.enemyGroup, (p, e) => this.playerEnemyCollision(p, e));
            this.physics.add.collider(player, this.hotDogGroup, (p, h) => this.playerHotDogCollision(p, h));
            this.physics.add.overlap(player, this.powerUpGroup, (p, pu) => this.collectPowerUp(p, pu));
        }
        this.physics.add.collider(this.enemyGroup, this.platforms);
        this.physics.add.collider(this.hotDogGroup, this.platforms);
        this.physics.add.collider(this.powerUpGroup, this.platforms);

        // Hot dogs hitting enemies
        this.physics.add.collider(this.hotDogGroup, this.enemyGroup, (h, e) => {
            this.destroyEnemyWithEffect(e);
            h.destroy();
        });

        // Fire breath projectiles
        this.fireBreaths = [];

        // Camera follows first alive player
        this.cameras.main.setBounds(0, 0, this.levelWidth, this.levelHeight);
        this.cameras.main.startFollow(this.players[0], true, 0.1, 0.1);

        // Goal flag at end
        this.goalFlag = this.add.rectangle(this.levelWidth - 60, 350, 10, 100, 0xff0000);
        this.goalFlagTop = this.add.rectangle(this.levelWidth - 45, 305, 30, 20, 0xff0000);
        this.physics.add.existing(this.goalFlag, true);
        for (const player of this.players) {
            this.physics.add.overlap(player, this.goalFlag, () => {
                if (!this.levelComplete) {
                    this.levelComplete = true;
                    this.completeLevel();
                }
            });
        }

        // UI
        this.scoreTexts = [];
        this.lifeTexts = [];
        for (let i = 0; i < gameState.playerCount; i++) {
            const st = this.add.text(10 + i * 150, 10, 'P' + (i+1) + ': 0', {
                fontSize: '14px', fill: '#000000', fontFamily: 'monospace',
                backgroundColor: '#ffffffaa', padding: { x: 4, y: 2 }
            }).setScrollFactor(0).setDepth(50);
            this.scoreTexts.push(st);

            const lt = this.add.text(10 + i * 150, 30, 'Lives: 3', {
                fontSize: '11px', fill: '#cc0000', fontFamily: 'monospace',
                backgroundColor: '#ffffffaa', padding: { x: 4, y: 2 }
            }).setScrollFactor(0).setDepth(50);
            this.lifeTexts.push(lt);
        }

        this.cameras.main.fadeIn(400);
    }

    buildLevel() {
        // Ground
        for (let x = 0; x < this.levelWidth; x += 32) {
            // Gaps in ground
            if ((x > 400 && x < 480) || (x > 900 && x < 960) || (x > 1500 && x < 1580)) continue;
            const tile = this.platforms.create(x + 16, 568, 'ground_tile');
        }

        // Platforms
        const platPositions = [
            [200, 450, 4], [350, 380, 3], [500, 420, 3],
            [650, 350, 4], [800, 300, 3], [950, 420, 5],
            [1100, 350, 3], [1250, 280, 4], [1400, 400, 3],
            [1550, 350, 5], [1700, 300, 3], [1850, 380, 4],
            [2000, 320, 3], [2150, 400, 5]
        ];

        for (const [x, y, width] of platPositions) {
            for (let i = 0; i < width; i++) {
                this.platforms.create(x + i * 32, y, 'platform_tile');
            }
        }
    }

    spawnEnemies() {
        const positions = [
            [350, 340], [550, 380], [750, 500], [950, 380],
            [1100, 310], [1300, 500], [1500, 500], [1700, 260],
            [1900, 340], [2100, 500]
        ];

        for (const [x, y] of positions) {
            const enemy = this.enemyGroup.create(x, y, 'wiener_dog');
            enemy.setScale(1.5);
            enemy.setBounce(0);
            enemy.setVelocityX(Phaser.Math.Between(-60, 60) || 40);
            enemy.moveDir = enemy.body.velocity.x > 0 ? 1 : -1;
            enemy.setFlipX(enemy.moveDir < 0);

            // Patrol bounds
            enemy.patrolLeft = x - 80;
            enemy.patrolRight = x + 80;
        }
    }

    spawnPowerUps() {
        // Chili peppers
        const chilies = [[400, 350], [1000, 350], [1800, 250]];
        for (const [x, y] of chilies) {
            const pu = this.powerUpGroup.create(x, y, 'chili_pepper');
            pu.setScale(1.5);
            pu.powerType = 'fire';
            pu.body.setAllowGravity(false);

            // Float animation
            this.tweens.add({
                targets: pu, y: y - 8, duration: 800, yoyo: true, repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Greenies
        const greenies = [[700, 300], [1500, 320]];
        for (const [x, y] of greenies) {
            const pu = this.powerUpGroup.create(x, y, 'greenie');
            pu.setScale(1.5);
            pu.powerType = 'giant';
            pu.body.setAllowGravity(false);

            this.tweens.add({
                targets: pu, y: y - 8, duration: 800, yoyo: true, repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    playerEnemyCollision(player, enemy) {
        if (!player.alive) return;

        // Check if player is falling onto enemy (stomp)
        if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
            // Stomp! Turn into hot dog
            const hotDog = this.hotDogGroup.create(enemy.x, enemy.y, 'hot_dog');
            hotDog.setScale(1.5);
            hotDog.setBounce(0.5);
            hotDog.setVelocityX(0);
            hotDog.kicked = false;

            enemy.destroy();
            player.setVelocityY(-300); // Bounce up

            this.score[player.playerIndex] += 200;
            this.scoreTexts[player.playerIndex].setText('P' + (player.playerIndex+1) + ': ' + this.score[player.playerIndex]);

            try { this.sound.play('sfx_stomp', { volume: 0.4 }); } catch(e) {}

            // Score popup
            const popup = this.add.text(enemy.x, enemy.y - 20, '+200', {
                fontSize: '14px', fill: '#ffff00', fontFamily: 'monospace', fontStyle: 'bold'
            }).setOrigin(0.5);
            this.tweens.add({
                targets: popup, y: enemy.y - 50, alpha: 0, duration: 600,
                onComplete: () => popup.destroy()
            });
        } else if (!player.isGiant) {
            // Player hit
            this.hitPlayer(player);
        } else {
            // Giant player destroys enemy on contact
            this.destroyEnemyWithEffect(enemy);
            this.score[player.playerIndex] += 300;
            this.scoreTexts[player.playerIndex].setText('P' + (player.playerIndex+1) + ': ' + this.score[player.playerIndex]);
        }
    }

    playerHotDogCollision(player, hotDog) {
        if (!hotDog.kicked) {
            // Kick the hot dog like a shell
            const dir = player.x < hotDog.x ? 1 : -1;
            hotDog.setVelocityX(dir * 400);
            hotDog.kicked = true;
            try { this.sound.play('sfx_hit', { volume: 0.3 }); } catch(e) {}
        } else {
            // Moving hot dog hits player
            if (Math.abs(hotDog.body.velocity.x) > 100 && !player.isGiant) {
                this.hitPlayer(player);
            }
        }
    }

    collectPowerUp(player, powerUp) {
        try { this.sound.play('sfx_powerup', { volume: 0.5 }); } catch(e) {}

        if (powerUp.powerType === 'fire') {
            player.hasFire = true;
            player.setTint(0xff4400);
            // Fire wears off after 10 seconds
            this.time.delayedCall(10000, () => {
                player.hasFire = false;
                player.clearTint();
            });
        } else if (powerUp.powerType === 'giant') {
            player.isGiant = true;
            player.setScale(4);
            // Giant wears off after 8 seconds
            this.time.delayedCall(8000, () => {
                player.isGiant = false;
                player.setScale(2);
            });
        }

        // Flash effect
        this.cameras.main.flash(200, 255, 255, 255);
        powerUp.destroy();
    }

    destroyEnemyWithEffect(enemy) {
        for (let p = 0; p < 5; p++) {
            const part = this.add.sprite(enemy.x, enemy.y, 'explosion_particle')
                .setTint(0x8B4513);
            this.tweens.add({
                targets: part,
                x: enemy.x + (Math.random() - 0.5) * 60,
                y: enemy.y + (Math.random() - 0.5) * 60,
                alpha: 0, duration: 400,
                onComplete: () => part.destroy()
            });
        }
        try { this.sound.play('sfx_hit', { volume: 0.3 }); } catch(e) {}
        enemy.destroy();
    }

    hitPlayer(player) {
        const i = player.playerIndex;
        this.lives[i]--;
        this.lifeTexts[i].setText('Lives: ' + Math.max(0, this.lives[i]));

        try { this.sound.play('sfx_death', { volume: 0.4 }); } catch(e) {}
        this.cameras.main.shake(150, 0.01);

        if (this.lives[i] <= 0) {
            player.alive = false;
            player.setAlpha(0.2);
            player.body.enable = false;
        } else {
            // Brief invincibility
            player.setAlpha(0.5);
            player.body.enable = false;
            this.time.delayedCall(1000, () => {
                if (player.alive) {
                    player.setAlpha(1);
                    player.body.enable = true;
                }
            });
            // Knock back
            player.setVelocityY(-200);
        }

        // Check if all dead
        if (this.players.every(p => !p.alive) && !this.gameOver) {
            this.gameOver = true;
            this.endGame(false);
        }
    }

    shootFire(player) {
        const dir = player.flipX ? -1 : 1;
        const fire = this.add.sprite(player.x + dir * 20, player.y, 'fire_breath').setScale(1.5);
        fire.vx = dir * 6;
        fire.life = 60; // frames
        this.fireBreaths.push(fire);
        try { this.sound.play('sfx_shoot', { volume: 0.3 }); } catch(e) {}
    }

    update(time, delta) {
        if (this.gameOver || this.levelComplete) return;

        // Player input
        for (let i = 0; i < gameState.playerCount; i++) {
            const player = this.players[i];
            if (!player.alive) continue;

            const input = this.input_mgr.getInput(i);

            // Horizontal movement
            const speed = player.isGiant ? 150 : 200;
            player.setVelocityX(input.x * speed);

            // Flip sprite based on direction
            if (input.x < 0) player.setFlipX(true);
            else if (input.x > 0) player.setFlipX(false);

            // Jump
            if (input.action1Down && player.body.onFloor()) {
                player.setVelocityY(player.isGiant ? -420 : -480);
                try { this.sound.play('sfx_jump', { volume: 0.3 }); } catch(e) {}
            }

            // Fire breath
            if (input.action2Down && player.hasFire) {
                this.shootFire(player);
            }
        }

        // Update enemy patrol
        for (const enemy of this.enemyGroup.getChildren()) {
            if (enemy.x < enemy.patrolLeft) {
                enemy.setVelocityX(60);
                enemy.setFlipX(false);
            } else if (enemy.x > enemy.patrolRight) {
                enemy.setVelocityX(-60);
                enemy.setFlipX(true);
            }
        }

        // Update fire breaths
        for (let i = this.fireBreaths.length - 1; i >= 0; i--) {
            const fire = this.fireBreaths[i];
            fire.x += fire.vx;
            fire.life--;
            if (fire.life <= 0) {
                fire.destroy();
                this.fireBreaths.splice(i, 1);
                continue;
            }

            // Check collision with enemies
            for (const enemy of this.enemyGroup.getChildren()) {
                if (Math.abs(fire.x - enemy.x) < 25 && Math.abs(fire.y - enemy.y) < 20) {
                    this.destroyEnemyWithEffect(enemy);
                    fire.destroy();
                    this.fireBreaths.splice(i, 1);
                    break;
                }
            }
        }

        // Camera follow first alive player
        const alivePlayer = this.players.find(p => p.alive);
        if (alivePlayer) {
            this.cameras.main.startFollow(alivePlayer, true, 0.1, 0.1);
        }

        // Fall death
        for (const player of this.players) {
            if (player.alive && player.y > this.levelHeight - 10) {
                this.hitPlayer(player);
                if (player.alive) {
                    player.setPosition(100, 300);
                }
            }
        }
    }

    completeLevel() {
        try { this.sound.play('sfx_score', { volume: 0.5 }); } catch(e) {}

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const complete = this.add.text(w / 2, h / 2, 'LEVEL COMPLETE!', {
            fontSize: '32px', fill: '#ffff00', fontFamily: 'monospace',
            fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.tweens.add({
            targets: complete,
            scaleX: 1.2, scaleY: 1.2, duration: 300, yoyo: true, repeat: 2
        });

        this.time.delayedCall(2500, () => this.endGame(true));
    }

    endGame(won) {
        this.gameOver = true;
        const scores = {};
        for (let i = 0; i < gameState.playerCount; i++) {
            scores[i] = this.score[i];
        }
        gameState.recordScore('platformer', scores);

        this.input_mgr.cleanup();

        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('ResultsScene', {
                gameName: 'Wiener Dog Mario',
                scores: scores,
                won: won,
                nextScene: gameState.mode === 'story' ? 'story_next' : 'MenuScene'
            });
        });
    }
}
