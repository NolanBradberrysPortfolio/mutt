// GalagaScene - Amazon Galaga mini-game
// Daisy shoots carrots at Amazon delivery workers. Boss: Jeff Bezos in a truck.

import { InputManager } from '../../systems/InputManager.js';
import { gameState } from '../../systems/GameState.js';
import { DOG_CLASSES } from '../../data/classes.js';
import { PERKS } from '../../data/perks.js';

export class GalagaScene extends Phaser.Scene {
    constructor() {
        super('GalagaScene');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.input_mgr = new InputManager(this);
        this.input_mgr.init(gameState.playerCount);

        // Background - dark space
        this.add.rectangle(w / 2, h / 2, w, h, 0x0a0a1a);

        // Stars
        for (let i = 0; i < 60; i++) {
            this.add.rectangle(
                Math.random() * w, Math.random() * h,
                1, 1, 0xffffff, Math.random() * 0.6 + 0.2
            );
        }

        // Game state
        this.wave = 1;
        this.maxWaves = 5;
        this.score = [];
        this.lives = [];
        this.ships = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.bossActive = false;
        this.boss = null;
        this.bossHP = 0;
        this.bossMaxHP = 0;
        this.bossHPBar = null;
        this.gameOver = false;
        this.waveComplete = false;
        this.shootCooldowns = [];
        this.activePerks = [];
        this.choosingPerk = false;
        this.perkUI = null;
        this.perkOptions = [];
        this.perkSelectedIndex = 0;
        this.availablePerks = [...PERKS];

        // Create player ships
        const shipSpacing = w / (gameState.playerCount + 1);
        for (let i = 0; i < gameState.playerCount; i++) {
            const charIndex = gameState.characters[i] || 0;
            const shipTexture = 'ship_' + charIndex;
            const ship = this.add.sprite(shipSpacing * (i + 1), h - 60, shipTexture).setScale(2);
            ship.playerIndex = i;
            ship.alive = true;
            this.ships.push(ship);
            this.score.push(0);
            this.lives.push(3);
            this.shootCooldowns.push(0);
        }

        // UI
        this.waveText = this.add.text(w / 2, 20, 'WAVE 1', {
            fontSize: '20px', fill: '#ff6b9d', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(50);

        this.scoreTexts = [];
        this.lifeDisplays = [];
        for (let i = 0; i < gameState.playerCount; i++) {
            const x = 10 + i * 180;
            const st = this.add.text(x, h - 20, 'P' + (i+1) + ': 0', {
                fontSize: '12px', fill: '#ffffff', fontFamily: 'monospace'
            }).setDepth(50);
            this.scoreTexts.push(st);

            // Hearts for lives
            const hearts = [];
            for (let l = 0; l < 3; l++) {
                const heart = this.add.sprite(x + 10 + l * 18, h - 35, 'heart').setScale(1).setDepth(50);
                hearts.push(heart);
            }
            this.lifeDisplays.push(hearts);
        }

        // Physics groups
        this.bulletGroup = this.physics.add.group();
        this.enemyBulletGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();

        this.spawnWave();
        this.cameras.main.fadeIn(400);
    }

    spawnWave() {
        this.waveComplete = false;
        this.waveText.setText('WAVE ' + this.wave);

        // Flash wave text
        this.tweens.add({
            targets: this.waveText,
            alpha: 0, duration: 200, yoyo: true, repeat: 2,
            onComplete: () => this.waveText.setAlpha(1)
        });

        if (this.wave > this.maxWaves) {
            this.spawnBoss();
            return;
        }

        // Wave definitions: each wave has different enemy types and layouts
        const waveDefs = [
            { // Wave 1: Basic workers only
                label: 'WAVE 1 - Delivery Crew',
                enemies: [
                    { type: 'amazon_worker', hp: 1, shootRate: 4000, rows: 2, cols: 4 }
                ]
            },
            { // Wave 2: Drones swarm in
                label: 'WAVE 2 - Drone Strike',
                enemies: [
                    { type: 'amazon_drone', hp: 1, shootRate: 3000, rows: 2, cols: 5 }
                ]
            },
            { // Wave 3: Mix of workers and tanky vans
                label: 'WAVE 3 - Ground Assault',
                enemies: [
                    { type: 'amazon_worker', hp: 1, shootRate: 3500, rows: 1, cols: 4 },
                    { type: 'amazon_van', hp: 2, shootRate: 3000, rows: 1, cols: 3, yOffset: 1 }
                ]
            },
            { // Wave 4: Robots and drones
                label: 'WAVE 4 - Robo Fleet',
                enemies: [
                    { type: 'amazon_drone', hp: 1, shootRate: 2500, rows: 1, cols: 4 },
                    { type: 'amazon_robot', hp: 1, shootRate: 2000, rows: 2, cols: 3, yOffset: 1 }
                ]
            },
            { // Wave 5: All types mixed
                label: 'WAVE 5 - Full Assault',
                enemies: [
                    { type: 'amazon_drone', hp: 1, shootRate: 2500, rows: 1, cols: 3 },
                    { type: 'amazon_worker', hp: 1, shootRate: 2500, rows: 1, cols: 3, yOffset: 1 },
                    { type: 'amazon_van', hp: 2, shootRate: 2000, rows: 1, cols: 2, yOffset: 2 },
                    { type: 'amazon_robot', hp: 1, shootRate: 1800, rows: 1, cols: 2, yOffset: 3 }
                ]
            }
        ];

        const waveDef = waveDefs[this.wave - 1];
        this.waveText.setText(waveDef.label);

        for (const group of waveDef.enemies) {
            const startX = (800 - group.cols * 60) / 2 + 30;
            const baseY = group.yOffset ? 60 + group.yOffset * 50 : 60;

            for (let r = 0; r < group.rows; r++) {
                for (let c = 0; c < group.cols; c++) {
                    const x = startX + c * 60;
                    const y = baseY + r * 45;
                    const enemy = this.add.sprite(x, y, group.type).setScale(2.5);
                    enemy.hp = group.hp;
                    enemy.enemyType = group.type;
                    enemy.shootTimer = Math.random() * group.shootRate + 1000;
                    enemy.baseShootRate = group.shootRate;
                    enemy.moveDir = 1;
                    enemy.scoreValue = group.hp === 2 ? 200 : (group.type === 'amazon_robot' ? 150 : 100);
                    this.enemies.push(enemy);
                    this.enemyGroup.add(enemy);
                }
            }
        }

        // Enemy movement pattern
        this.enemyMoveTimer = 0;
        this.enemyMoveDir = 1;
        this.enemyDropAmount = 0;
    }

    spawnBoss() {
        this.bossActive = true;
        this.waveText.setText('BOSS FIGHT!');
        this.waveText.setColor('#ff0000');

        this.boss = this.add.sprite(400, -40, 'bezos_boss').setScale(2);
        this.bossHP = 50;
        this.bossMaxHP = 50;
        this.boss.moveTimer = 0;
        this.boss.attackTimer = 0;
        this.boss.moveDir = 1;

        // Entrance tween
        this.tweens.add({
            targets: this.boss,
            y: 80,
            duration: 2000,
            ease: 'Bounce.easeOut'
        });

        // Boss HP bar
        this.bossHPBg = this.add.rectangle(400, 15, 304, 14, 0x333333).setDepth(50);
        this.bossHPBar = this.add.rectangle(400, 15, 300, 10, 0xff0000).setDepth(50);
        this.bossHPLabel = this.add.text(400, 15, 'BEZOS', {
            fontSize: '9px', fill: '#ffffff', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(51);

        try { this.sound.play('sfx_boss_hit', { volume: 0.5 }); } catch(e) {}
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Perk selection mode - only handle perk input
        if (this.choosingPerk) {
            this.updatePerkSelection();
            return;
        }

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Update shoot cooldowns
        for (let i = 0; i < this.shootCooldowns.length; i++) {
            if (this.shootCooldowns[i] > 0) this.shootCooldowns[i] -= delta;
        }

        // Player input
        for (let i = 0; i < gameState.playerCount; i++) {
            const ship = this.ships[i];
            if (!ship.alive) continue;

            const input = this.input_mgr.getInput(i);

            // Move ship
            const speed = 300 * (delta / 1000);
            ship.x += input.x * speed;
            ship.x = Phaser.Math.Clamp(ship.x, 20, w - 20);

            // Shoot carrot
            if (input.action1 && this.shootCooldowns[i] <= 0) {
                this.shootCarrot(ship, i);
                this.shootCooldowns[i] = 200; // 200ms cooldown
            }
        }

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.y -= 8;
            if (b.y < -10) {
                b.destroy();
                this.bullets.splice(i, 1);
                continue;
            }

            // Check collision with enemies
            for (let e = this.enemies.length - 1; e >= 0; e--) {
                const enemy = this.enemies[e];
                if (Math.abs(b.x - enemy.x) < 30 && Math.abs(b.y - enemy.y) < 30) {
                    enemy.hp--;
                    if (enemy.hp <= 0) {
                        this.destroyEnemy(enemy, e, b.playerIndex);
                    }
                    b.destroy();
                    this.bullets.splice(i, 1);
                    break;
                }
            }

            // Check collision with boss
            if (this.bossActive && this.boss && this.bullets[i]) {
                const b2 = this.bullets[i];
                if (b2 && Math.abs(b2.x - this.boss.x) < 60 && Math.abs(b2.y - this.boss.y) < 50) {
                    this.bossHP--;
                    this.updateBossHP();
                    try { this.sound.play('sfx_boss_hit', { volume: 0.3, rate: 1 + Math.random() * 0.3 }); } catch(e) {}

                    // Boss flash
                    this.boss.setTint(0xff0000);
                    this.time.delayedCall(100, () => {
                        if (this.boss) this.boss.clearTint();
                    });

                    b2.destroy();
                    this.bullets.splice(i, 1);

                    if (this.bossHP <= 0) {
                        this.defeatBoss();
                    }
                }
            }
        }

        // Update enemy bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const b = this.enemyBullets[i];
            b.y += 5;
            if (b.y > h + 10) {
                b.destroy();
                this.enemyBullets.splice(i, 1);
                continue;
            }

            // Check collision with player ships
            for (const ship of this.ships) {
                if (!ship.alive) continue;
                if (Math.abs(b.x - ship.x) < 20 && Math.abs(b.y - ship.y) < 18) {
                    this.hitPlayer(ship);
                    b.destroy();
                    this.enemyBullets.splice(i, 1);
                    break;
                }
            }
        }

        // Enemy movement and shooting
        if (!this.bossActive) {
            this.enemyMoveTimer += delta;
            if (this.enemyMoveTimer > 500 - this.wave * 50) {
                this.enemyMoveTimer = 0;
                let hitEdge = false;

                for (const enemy of this.enemies) {
                    enemy.x += this.enemyMoveDir * 15;
                    if (enemy.x < 30 || enemy.x > w - 30) hitEdge = true;
                }

                if (hitEdge) {
                    this.enemyMoveDir *= -1;
                    for (const enemy of this.enemies) {
                        enemy.y += 15;
                    }
                }

                // Random enemy shoot
                for (const enemy of this.enemies) {
                    enemy.shootTimer -= 500;
                    if (enemy.shootTimer <= 0) {
                        this.enemyShoot(enemy);
                        const rate = enemy.baseShootRate || 4000;
                        enemy.shootTimer = Math.random() * rate + rate * 0.5;
                    }
                }
            }

            // Check if wave complete
            if (this.enemies.length === 0 && !this.waveComplete) {
                this.waveComplete = true;
                this.wave++;
                // Show perk selection after each wave (except before boss)
                if (this.wave <= this.maxWaves && this.availablePerks.length > 0) {
                    this.time.delayedCall(1000, () => this.showPerkSelection());
                } else {
                    this.time.delayedCall(1500, () => this.spawnWave());
                }
            }
        }

        // Boss movement and attacks
        if (this.bossActive && this.boss) {
            this.boss.moveTimer += delta;
            if (this.boss.moveTimer > 30) {
                this.boss.moveTimer = 0;
                this.boss.x += this.boss.moveDir * 2;
                if (this.boss.x < 80 || this.boss.x > w - 80) {
                    this.boss.moveDir *= -1;
                }
            }

            this.boss.attackTimer += delta;
            if (this.boss.attackTimer > 800) {
                this.boss.attackTimer = 0;
                // Boss shoots boxes in spread
                for (let a = -1; a <= 1; a++) {
                    const box = this.add.sprite(this.boss.x + a * 30, this.boss.y + 50, 'amazon_box').setScale(2);
                    box.vx = a * 2;
                    this.enemyBullets.push(box);
                }
            }
        }

        // Check if all players dead
        const allDead = this.ships.every(s => !s.alive);
        if (allDead && !this.gameOver) {
            this.gameOver = true;
            this.endGame(false);
        }
    }

    shootCarrot(ship, playerIndex) {
        // Get class-specific projectile
        const charIndex = gameState.characters[playerIndex] || 0;
        const cls = DOG_CLASSES[charIndex];
        const projKey = cls ? cls.projectile : 'carrot';
        const projScale = cls ? cls.projectileScale : 1.5;
        const shootRate = cls ? cls.shootRate : 0.9;

        const bullet = this.add.sprite(ship.x, ship.y - 20, projKey).setScale(projScale);
        bullet.playerIndex = playerIndex;
        this.bullets.push(bullet);
        try { this.sound.play('sfx_shoot', { volume: 0.3, rate: shootRate + Math.random() * 0.2 }); } catch(e) {}
    }

    enemyShoot(enemy) {
        const box = this.add.sprite(enemy.x, enemy.y + 20, 'amazon_box').setScale(1.5);
        box.vx = 0;
        this.enemyBullets.push(box);
    }

    destroyEnemy(enemy, index, playerIndex) {
        // Perk-based particles (if any active)
        if (this.activePerks.length > 0) {
            this.spawnPerkParticles(enemy.x, enemy.y);
        } else {
            // Default particles
            for (let p = 0; p < 6; p++) {
                const part = this.add.sprite(enemy.x, enemy.y, 'explosion_particle')
                    .setTint(0xff9900);
                this.tweens.add({
                    targets: part,
                    x: enemy.x + (Math.random() - 0.5) * 60,
                    y: enemy.y + (Math.random() - 0.5) * 60,
                    alpha: 0, scaleX: 0, scaleY: 0,
                    duration: 400,
                    onComplete: () => part.destroy()
                });
            }
        }

        const pts = enemy.scoreValue || 100;
        this.score[playerIndex] += pts;
        this.scoreTexts[playerIndex].setText('P' + (playerIndex+1) + ': ' + this.score[playerIndex]);

        try { this.sound.play('sfx_hit', { volume: 0.4, rate: 0.8 + Math.random() * 0.4 }); } catch(e) {}

        // Score popup
        const popup = this.add.text(enemy.x, enemy.y, '+' + pts, {
            fontSize: '14px', fill: '#ffff00', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: popup,
            y: enemy.y - 30, alpha: 0, duration: 600,
            onComplete: () => popup.destroy()
        });

        enemy.destroy();
        this.enemies.splice(index, 1);

        // Screen shake
        this.cameras.main.shake(100, 0.005);
    }

    hitPlayer(ship) {
        const i = ship.playerIndex;
        this.lives[i]--;

        try { this.sound.play('sfx_death', { volume: 0.5 }); } catch(e) {}
        this.cameras.main.shake(200, 0.01);

        // Flash ship
        this.tweens.add({
            targets: ship,
            alpha: 0.2, duration: 100, yoyo: true, repeat: 5
        });

        // Update hearts
        if (this.lives[i] >= 0 && this.lifeDisplays[i][this.lives[i]]) {
            this.lifeDisplays[i][this.lives[i]].setAlpha(0.2);
        }

        if (this.lives[i] <= 0) {
            ship.alive = false;
            ship.setAlpha(0.2);
        }
    }

    updateBossHP() {
        if (this.bossHPBar) {
            const pct = this.bossHP / this.bossMaxHP;
            this.bossHPBar.width = 300 * pct;
            if (pct < 0.3) this.bossHPBar.setFillStyle(0xff0000);
            else if (pct < 0.6) this.bossHPBar.setFillStyle(0xffaa00);
        }
    }

    defeatBoss() {
        // Big explosion
        for (let p = 0; p < 20; p++) {
            const part = this.add.sprite(this.boss.x, this.boss.y, 'explosion_particle')
                .setTint(Math.random() > 0.5 ? 0xff6600 : 0xffaa00)
                .setScale(2);
            this.tweens.add({
                targets: part,
                x: this.boss.x + (Math.random() - 0.5) * 200,
                y: this.boss.y + (Math.random() - 0.5) * 200,
                alpha: 0, scaleX: 0, scaleY: 0,
                duration: 800,
                onComplete: () => part.destroy()
            });
        }

        // Score bonus
        for (let i = 0; i < gameState.playerCount; i++) {
            this.score[i] += 5000;
            this.scoreTexts[i].setText('P' + (i+1) + ': ' + this.score[i]);
        }

        try { this.sound.play('sfx_explode', { volume: 0.6 }); } catch(e) {}
        this.cameras.main.shake(500, 0.02);

        this.boss.destroy();
        this.boss = null;
        if (this.bossHPBar) this.bossHPBar.destroy();
        if (this.bossHPBg) this.bossHPBg.destroy();
        if (this.bossHPLabel) this.bossHPLabel.destroy();
        this.bossActive = false;

        this.time.delayedCall(2000, () => this.endGame(true));
    }

    // === PERK SYSTEM ===

    showPerkSelection() {
        this.choosingPerk = true;
        this.perkSelectedIndex = 0;

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Pick 3 random perks from available
        const shuffled = [...this.availablePerks].sort(() => Math.random() - 0.5);
        this.perkOptions = shuffled.slice(0, 3);

        // Dark overlay
        this.perkUI = [];
        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setDepth(200);
        this.perkUI.push(overlay);

        const title = this.add.text(w / 2, 60, 'LEVEL UP! Choose a Perk', {
            fontSize: '24px', fill: '#ffcc00', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(201);
        this.perkUI.push(title);

        const subtitle = this.add.text(w / 2, 90, 'How should enemies die?', {
            fontSize: '13px', fill: '#aaaaaa', fontFamily: 'monospace', fontStyle: 'italic'
        }).setOrigin(0.5).setDepth(201);
        this.perkUI.push(subtitle);

        this.perkCards = [];
        const cardWidth = 200;
        const totalWidth = this.perkOptions.length * cardWidth + (this.perkOptions.length - 1) * 20;
        const startX = (w - totalWidth) / 2 + cardWidth / 2;

        for (let i = 0; i < this.perkOptions.length; i++) {
            const perk = this.perkOptions[i];
            const x = startX + i * (cardWidth + 20);
            const y = h / 2 - 20;

            const bg = this.add.rectangle(x, y, cardWidth, 240, 0x222244, 0.9)
                .setStrokeStyle(3, 0x444488).setDepth(201);

            const name = this.add.text(x, y - 80, perk.name, {
                fontSize: '16px', fill: perk.color, fontFamily: 'monospace', fontStyle: 'bold',
                align: 'center', wordWrap: { width: 180 }
            }).setOrigin(0.5).setDepth(202);

            // Preview particles
            const previewColors = perk.particles.map(p => p.color);
            for (let p = 0; p < 8; p++) {
                const px = x + (Math.random() - 0.5) * 100;
                const py = y - 20 + (Math.random() - 0.5) * 60;
                const pc = previewColors[p % previewColors.length];
                const dot = this.add.rectangle(px, py, 4 + Math.random() * 4, 4 + Math.random() * 4, pc)
                    .setDepth(202);
                this.tweens.add({
                    targets: dot,
                    y: py + 20, alpha: 0.3, duration: 800 + Math.random() * 600,
                    yoyo: true, repeat: -1
                });
                this.perkUI.push(dot);
            }

            const desc = this.add.text(x, y + 50, perk.description, {
                fontSize: '11px', fill: '#cccccc', fontFamily: 'monospace',
                align: 'center', wordWrap: { width: 170 }
            }).setOrigin(0.5).setDepth(202);

            this.perkCards.push({ bg, name, desc });
            this.perkUI.push(bg, name, desc);
        }

        // Controls hint
        const hint = this.add.text(w / 2, h - 50, 'LEFT/RIGHT to choose  |  SPACE to select', {
            fontSize: '12px', fill: '#888888', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(201);
        this.perkUI.push(hint);

        this.updatePerkHighlight();
    }

    updatePerkHighlight() {
        for (let i = 0; i < this.perkCards.length; i++) {
            const card = this.perkCards[i];
            if (i === this.perkSelectedIndex) {
                card.bg.setStrokeStyle(3, 0xff6b9d);
                card.bg.setFillStyle(0x333366, 0.95);
            } else {
                card.bg.setStrokeStyle(3, 0x444488);
                card.bg.setFillStyle(0x222244, 0.9);
            }
        }
    }

    updatePerkSelection() {
        const input = this.input_mgr.getInput(0);

        if (!this._prevPerkX) this._prevPerkX = 0;

        if (input.x < 0 && this._prevPerkX >= 0) {
            this.perkSelectedIndex = (this.perkSelectedIndex - 1 + this.perkOptions.length) % this.perkOptions.length;
            this.updatePerkHighlight();
            try { this.sound.play('sfx_select', { volume: 0.3 }); } catch(e) {}
        }
        if (input.x > 0 && this._prevPerkX <= 0) {
            this.perkSelectedIndex = (this.perkSelectedIndex + 1) % this.perkOptions.length;
            this.updatePerkHighlight();
            try { this.sound.play('sfx_select', { volume: 0.3 }); } catch(e) {}
        }
        this._prevPerkX = input.x;

        if (input.action1Down) {
            this.selectPerk(this.perkOptions[this.perkSelectedIndex]);
        }
    }

    selectPerk(perk) {
        this.activePerks.push(perk);

        // Remove from available so no duplicates
        this.availablePerks = this.availablePerks.filter(p => p.id !== perk.id);

        // Show selection flash
        try { this.sound.play('sfx_powerup', { volume: 0.5 }); } catch(e) {}

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const flash = this.add.text(w / 2, h / 2, perk.name + '!', {
            fontSize: '32px', fill: perk.color, fontFamily: 'monospace', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(300);

        this.tweens.add({
            targets: flash,
            scaleX: 1.5, scaleY: 1.5, alpha: 0,
            duration: 800,
            onComplete: () => flash.destroy()
        });

        // Clean up perk UI
        for (const obj of this.perkUI) {
            obj.destroy();
        }
        this.perkUI = [];
        this.perkCards = [];
        this.choosingPerk = false;

        // Continue to next wave
        this.time.delayedCall(800, () => this.spawnWave());
    }

    // Spawn death particles based on active perks
    spawnPerkParticles(x, y) {
        if (this.activePerks.length === 0) return;

        const perk = this.activePerks[this.activePerks.length - 1];

        switch (perk.id) {
            case 'bloody_mess':
                this.spawnBloodyMess(x, y);
                break;
            case 'pizza_explosion':
                this.spawnPizzaParty(x, y);
                break;
            case 'confetti':
                this.spawnConfetti(x, y);
                break;
            case 'skull_bones':
                this.spawnSkullBones(x, y);
                break;
            case 'rubber_ducky':
                this.spawnDuckyRain(x, y);
                break;
            case 'toilet_flush':
                this.spawnToiletFlush(x, y);
                break;
            case 'glitter_bomb':
                this.spawnGlitterBomb(x, y);
                break;
            case 'cat_hairballs':
                this.spawnHairballs(x, y);
                break;
        }
    }

    spawnBloodyMess(x, y) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // FALLOUT-STYLE GIBBING — massive chunks fly across the ENTIRE screen

        // Big meaty chunks — fly to all edges of the screen
        for (let i = 0; i < 14; i++) {
            const chunk = this.add.sprite(x, y, 'perk_blood_chunk')
                .setScale(2 + Math.random() * 3).setDepth(60).setAngle(Math.random() * 360);
            // Fly all the way to screen edges
            const angle = Math.random() * Math.PI * 2;
            const targetX = x + Math.cos(angle) * (300 + Math.random() * 300);
            const targetY = y + Math.sin(angle) * (200 + Math.random() * 200);
            this.tweens.add({
                targets: chunk,
                x: targetX,
                y: targetY,
                angle: chunk.angle + (Math.random() - 0.5) * 720,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 800 + Math.random() * 600,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // Splat where it lands and stick for a moment
                    chunk.setScale(1.5 + Math.random(), 0.5);
                    this.tweens.add({
                        targets: chunk, alpha: 0, duration: 1500,
                        onComplete: () => chunk.destroy()
                    });
                }
            });
        }

        // Blood drops — rain across the whole screen
        for (let i = 0; i < 20; i++) {
            const drop = this.add.sprite(
                Math.random() * w, y - 20 - Math.random() * 40,
                'perk_blood_drop'
            ).setScale(1 + Math.random() * 1.5).setDepth(60);
            this.tweens.add({
                targets: drop,
                y: h + 20,
                x: drop.x + (Math.random() - 0.5) * 100,
                scaleX: 0.3, scaleY: 2.5, // stretches as it falls like real blood
                duration: 600 + Math.random() * 800,
                delay: Math.random() * 400,
                ease: 'Quad.easeIn',
                onComplete: () => drop.destroy()
            });
        }

        // Blood splats on all corners and edges — like it hit the screen
        const splatPositions = [
            [Math.random() * w, 10],                // top
            [Math.random() * w, h - 10],             // bottom
            [10, Math.random() * h],                  // left
            [w - 10, Math.random() * h],              // right
            [x + (Math.random() - 0.5) * 200, y + (Math.random() - 0.5) * 100],
            [x + (Math.random() - 0.5) * 200, y + (Math.random() - 0.5) * 100],
            [x + (Math.random() - 0.5) * 300, y + (Math.random() - 0.5) * 200],
            [x + (Math.random() - 0.5) * 300, y + (Math.random() - 0.5) * 200]
        ];
        for (const [sx, sy] of splatPositions) {
            const splat = this.add.sprite(sx, sy, 'perk_blood_splat')
                .setScale(2 + Math.random() * 4).setDepth(59)
                .setAngle(Math.random() * 360).setAlpha(0);
            // Splats appear with delay like stuff is landing
            this.tweens.add({
                targets: splat,
                alpha: 0.9,
                duration: 100,
                delay: 100 + Math.random() * 500,
                onComplete: () => {
                    this.tweens.add({
                        targets: splat, alpha: 0,
                        duration: 2000, delay: 500,
                        onComplete: () => splat.destroy()
                    });
                }
            });
        }

        // Central pulp explosion — big red burst
        const pulpBurst = this.add.circle(x, y, 5, 0xff0000, 0.8).setDepth(61);
        this.tweens.add({
            targets: pulpBurst,
            scaleX: 15, scaleY: 15,
            alpha: 0,
            duration: 400,
            ease: 'Quad.easeOut',
            onComplete: () => pulpBurst.destroy()
        });

        // Screen effects — red flash + heavy shake
        this.cameras.main.flash(250, 150, 0, 0);
        this.cameras.main.shake(300, 0.015);
    }

    spawnPizzaParty(x, y) {
        // Enemy explodes into spinning pizza slices
        for (let i = 0; i < 8; i++) {
            const pizza = this.add.sprite(x, y, 'perk_pizza')
                .setScale(1.5 + Math.random()).setDepth(60);
            const angle = (i / 8) * Math.PI * 2;
            const dist = 60 + Math.random() * 60;
            // Pizza slices spin outward then float down
            this.tweens.add({
                targets: pizza,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist * 0.5 + 40,
                angle: 360 + Math.random() * 720,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 800 + Math.random() * 400,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // Pizza lands and wobbles
                    this.tweens.add({
                        targets: pizza,
                        y: pizza.y + 40,
                        angle: pizza.angle + 20,
                        alpha: 0,
                        duration: 600,
                        ease: 'Bounce.easeOut',
                        onComplete: () => pizza.destroy()
                    });
                }
            });
        }
        // Cheese drip particles
        for (let i = 0; i < 6; i++) {
            const cheese = this.add.rectangle(
                x + (Math.random() - 0.5) * 50, y,
                3, 3, 0xffdd44
            ).setDepth(60);
            this.tweens.add({
                targets: cheese,
                y: cheese.y + 60 + Math.random() * 80,
                scaleY: 3, // stretchy cheese
                alpha: 0,
                duration: 700 + Math.random() * 400,
                delay: Math.random() * 300,
                onComplete: () => cheese.destroy()
            });
        }
    }

    spawnConfetti(x, y) {
        // Colorful confetti burst then flutter down
        const confettiSprites = [
            'perk_confetti_pink', 'perk_confetti_green',
            'perk_confetti_blue', 'perk_confetti_yellow', 'perk_confetti_orange'
        ];
        // Initial upward burst
        for (let i = 0; i < 20; i++) {
            const sprite = confettiSprites[i % confettiSprites.length];
            const conf = this.add.sprite(x, y, sprite)
                .setScale(1 + Math.random()).setDepth(60)
                .setAngle(Math.random() * 360);
            const tx = x + (Math.random() - 0.5) * 160;
            const peakY = y - 40 - Math.random() * 80;
            // Go up first, then flutter down
            this.tweens.add({
                targets: conf,
                x: tx,
                y: peakY,
                angle: conf.angle + (Math.random() - 0.5) * 360,
                duration: 400,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // Flutter down
                    this.tweens.add({
                        targets: conf,
                        y: peakY + 120 + Math.random() * 80,
                        x: tx + (Math.random() - 0.5) * 60,
                        angle: conf.angle + (Math.random() - 0.5) * 540,
                        alpha: 0,
                        duration: 1200 + Math.random() * 600,
                        ease: 'Sine.easeIn',
                        onComplete: () => conf.destroy()
                    });
                }
            });
        }
    }

    spawnSkullBones(x, y) {
        // Skulls and crossbones scatter with ghostly purple smoke
        for (let i = 0; i < 4; i++) {
            const skull = this.add.sprite(x, y, 'perk_skull')
                .setScale(1.5 + Math.random()).setDepth(61);
            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 60;
            this.tweens.add({
                targets: skull,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist + 20,
                angle: (Math.random() - 0.5) * 90,
                duration: 500,
                ease: 'Bounce.easeOut',
                hold: 400,
                onComplete: () => {
                    this.tweens.add({
                        targets: skull, alpha: 0, duration: 500,
                        onComplete: () => skull.destroy()
                    });
                }
            });
        }
        for (let i = 0; i < 5; i++) {
            const bone = this.add.sprite(x, y, i % 2 === 0 ? 'perk_crossbone' : 'perk_bone')
                .setScale(1 + Math.random()).setDepth(60);
            const angle = Math.random() * Math.PI * 2;
            this.tweens.add({
                targets: bone,
                x: x + Math.cos(angle) * (50 + Math.random() * 50),
                y: y + Math.sin(angle) * (50 + Math.random() * 50),
                angle: 360 * (Math.random() > 0.5 ? 1 : -1),
                alpha: 0,
                duration: 700 + Math.random() * 300,
                onComplete: () => bone.destroy()
            });
        }
        // Purple ghost smoke
        for (let i = 0; i < 8; i++) {
            const smoke = this.add.rectangle(
                x + (Math.random() - 0.5) * 30,
                y + (Math.random() - 0.5) * 20,
                8 + Math.random() * 8, 8 + Math.random() * 8,
                0x8844aa, 0.6
            ).setDepth(59);
            this.tweens.add({
                targets: smoke,
                y: smoke.y - 40 - Math.random() * 40,
                scaleX: 2, scaleY: 2,
                alpha: 0,
                duration: 800 + Math.random() * 400,
                onComplete: () => smoke.destroy()
            });
        }
    }

    spawnDuckyRain(x, y) {
        // Enemy pops into rubber duckies that bounce around
        for (let i = 0; i < 6; i++) {
            const ducky = this.add.sprite(x, y, 'perk_ducky')
                .setScale(1.5 + Math.random()).setDepth(60);
            const angle = (i / 6) * Math.PI * 2;
            const dist = 30 + Math.random() * 60;
            const targetX = x + Math.cos(angle) * dist;
            const targetY = y + Math.sin(angle) * dist;
            // Pop up, then bounce
            this.tweens.add({
                targets: ducky,
                x: targetX,
                y: targetY - 30,
                scaleX: 2, scaleY: 2,
                duration: 300,
                ease: 'Back.easeOut',
                onComplete: () => {
                    // Bounce bounce bounce
                    this.tweens.add({
                        targets: ducky,
                        y: targetY + 50,
                        duration: 400,
                        ease: 'Bounce.easeOut',
                        onComplete: () => {
                            this.tweens.add({
                                targets: ducky,
                                alpha: 0, scaleX: 0.5, scaleY: 0.5,
                                duration: 400,
                                onComplete: () => ducky.destroy()
                            });
                        }
                    });
                }
            });
        }
        // Water splash
        for (let i = 0; i < 4; i++) {
            const splash = this.add.rectangle(
                x + (Math.random() - 0.5) * 40, y,
                4, 4, 0x66aaff
            ).setDepth(59);
            this.tweens.add({
                targets: splash,
                y: splash.y - 20 - Math.random() * 30,
                alpha: 0,
                duration: 400,
                onComplete: () => splash.destroy()
            });
        }
    }

    spawnToiletFlush(x, y) {
        // Swirl effect - everything spirals into a central point
        // Big swirl visual
        const swirl = this.add.sprite(x, y, 'perk_swirl')
            .setScale(0.5).setDepth(62).setAlpha(0.8);
        this.tweens.add({
            targets: swirl,
            scaleX: 4, scaleY: 4,
            angle: 720,
            alpha: 0,
            duration: 1000,
            ease: 'Quad.easeIn',
            onComplete: () => swirl.destroy()
        });
        // Water droplets spiral
        for (let i = 0; i < 12; i++) {
            const water = this.add.sprite(
                x + (Math.random() - 0.5) * 60,
                y + (Math.random() - 0.5) * 60,
                'perk_water'
            ).setScale(0.8 + Math.random()).setDepth(61);
            const startAngle = (i / 12) * Math.PI * 2;
            const radius = 40 + Math.random() * 30;
            // Spiral inward
            this.tweens.add({
                targets: water,
                x: x,
                y: y + 20,
                scaleX: 0, scaleY: 0,
                angle: 360,
                duration: 600 + i * 50,
                ease: 'Cubic.easeIn',
                onComplete: () => water.destroy()
            });
        }
        // Flush sound-like camera effect
        this.cameras.main.shake(300, 0.008);
    }

    spawnGlitterBomb(x, y) {
        // Explosion of sparkles that linger
        for (let i = 0; i < 16; i++) {
            const sparkle = this.add.sprite(x, y, 'perk_sparkle')
                .setScale(0.5 + Math.random() * 1.5).setDepth(60)
                .setTint([0xff88ff, 0xffff88, 0x88ffff, 0xffffff][i % 4]);
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 70;
            // Burst out
            this.tweens.add({
                targets: sparkle,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                duration: 400,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // Twinkle in place
                    this.tweens.add({
                        targets: sparkle,
                        scaleX: 0.3, scaleY: 0.3,
                        alpha: 0.3,
                        duration: 200,
                        yoyo: true,
                        repeat: 3,
                        onComplete: () => {
                            this.tweens.add({
                                targets: sparkle,
                                alpha: 0, y: sparkle.y + 30,
                                duration: 400,
                                onComplete: () => sparkle.destroy()
                            });
                        }
                    });
                }
            });
        }
        // Screen flash white briefly
        this.cameras.main.flash(100, 255, 200, 255);
    }

    spawnHairballs(x, y) {
        // Hairballs fly out and tumble with fur strand particles
        for (let i = 0; i < 6; i++) {
            const ball = this.add.sprite(x, y, 'perk_hairball')
                .setScale(1 + Math.random() * 1.5).setDepth(60);
            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 60;
            // Tumble outward
            this.tweens.add({
                targets: ball,
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist + 20,
                angle: 360 * (Math.random() > 0.5 ? 2 : -2),
                duration: 600 + Math.random() * 400,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // Splat and flatten
                    this.tweens.add({
                        targets: ball,
                        scaleY: 0.3, scaleX: 2,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => ball.destroy()
                    });
                }
            });
        }
        // Loose fur strands
        for (let i = 0; i < 10; i++) {
            const fur = this.add.rectangle(
                x + (Math.random() - 0.5) * 20, y,
                1 + Math.random() * 2, 4 + Math.random() * 6,
                [0x887755, 0x776644, 0x998866, 0xaa9977][i % 4]
            ).setDepth(59).setAngle(Math.random() * 360);
            this.tweens.add({
                targets: fur,
                x: fur.x + (Math.random() - 0.5) * 80,
                y: fur.y + 40 + Math.random() * 60,
                angle: fur.angle + (Math.random() - 0.5) * 360,
                alpha: 0,
                duration: 800 + Math.random() * 600,
                onComplete: () => fur.destroy()
            });
        }
    }

    endGame(won) {
        this.gameOver = true;

        const scores = {};
        for (let i = 0; i < gameState.playerCount; i++) {
            scores[i] = this.score[i];
        }
        gameState.recordScore('galaga', scores);

        this.input_mgr.cleanup();

        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('ResultsScene', {
                gameName: 'Amazon Galaga',
                scores: scores,
                won: won,
                nextScene: gameState.mode === 'story' ? 'story_next' : 'MenuScene'
            });
        });
    }
}
