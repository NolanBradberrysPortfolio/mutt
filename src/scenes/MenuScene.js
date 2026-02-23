// MenuScene - Main menu with Story Mode / Arcade Mode / Settings

import { gameState } from '../systems/GameState.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        // Background
        this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a2e);

        this._prevPad = null;

        // Stars background
        for (let i = 0; i < 80; i++) {
            const star = this.add.rectangle(
                Math.random() * w, Math.random() * h,
                Math.random() * 3 + 1, Math.random() * 3 + 1,
                0xffffff, Math.random() * 0.7 + 0.3
            );
            this.tweens.add({
                targets: star,
                alpha: Math.random() * 0.3 + 0.1,
                duration: Math.random() * 2000 + 1000,
                yoyo: true,
                repeat: -1
            });
        }

        // Title
        const title = this.add.text(w / 2, 100, 'M U T T', {
            fontSize: '64px', fill: '#ff6b9d', fontFamily: 'monospace',
            fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(w / 2, 155, 'Delicious as a Greenie!', {
            fontSize: '14px', fill: '#aaaacc', fontFamily: 'monospace',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Daisy sprite bouncing
        const daisy = this.add.sprite(w / 2, 220, 'daisy').setScale(3);
        this.tweens.add({
            targets: daisy,
            y: 230,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Menu buttons
        this.selectedIndex = 0;
        this.menuItems = [];

        const buttonData = [
            { text: 'Story Mode', action: () => this.startStoryMode() },
            { text: 'Arcade Mode', action: () => this.startArcadeMode() },
            { text: 'Settings', action: () => {} } // TODO
        ];

        buttonData.forEach((item, i) => {
            const y = 320 + i * 60;
            const bg = this.add.rectangle(w / 2, y, 280, 44, 0x333366, 0.8)
                .setStrokeStyle(2, 0x6666aa);
            const text = this.add.text(w / 2, y, item.text, {
                fontSize: '22px', fill: '#ffffff', fontFamily: 'monospace'
            }).setOrigin(0.5);

            this.menuItems.push({ bg, text, action: item.action });
        });

        // Selector arrow
        this.selector = this.add.text(w / 2 - 165, 320, '>', {
            fontSize: '22px', fill: '#ff6b9d', fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Dedication text
        this.add.text(w / 2, h - 30, 'Dedicated to the unwanted dogs of this world\nand those that have come to love them', {
            fontSize: '10px', fill: '#666688', fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);

        // Controls hint
        this.add.text(w / 2, h - 65, 'WASD + SPACE  |  Arrow Keys + .  |  Gamepad', {
            fontSize: '11px', fill: '#555577', fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Input
        this.cursors = this.input.keyboard.addKeys({
            up: 'W', down: 'S', confirm: 'SPACE',
            up2: 'UP', down2: 'DOWN', confirm2: 'ENTER'
        });

        this.updateSelector();

        this.cameras.main.fadeIn(500);
    }

    update() {
        // Navigate menu
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.up2)) {
            this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
            this.updateSelector();
            try { this.sound.play('sfx_select', { volume: 0.3 }); } catch(e) {}
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.down) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.down2)) {
            this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
            this.updateSelector();
            try { this.sound.play('sfx_select', { volume: 0.3 }); } catch(e) {}
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.confirm) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.confirm2)) {
            try { this.sound.play('sfx_confirm', { volume: 0.4 }); } catch(e) {}
            this.menuItems[this.selectedIndex].action();
        }

        // Gamepad
        if (this.input.gamepad && this.input.gamepad.total > 0) {
            const pad = this.input.gamepad.getPad(0);
            if (pad) {
                if (!this._prevPad) this._prevPad = { up: false, down: false, a: false };
                if (pad.up && !this._prevPad.up) {
                    this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
                    this.updateSelector();
                }
                if (pad.down && !this._prevPad.down) {
                    this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
                    this.updateSelector();
                }
                if (pad.A && !this._prevPad.a) {
                    this.menuItems[this.selectedIndex].action();
                }
                this._prevPad = { up: pad.up, down: pad.down, a: pad.A };
            }
        }
    }

    updateSelector() {
        const item = this.menuItems[this.selectedIndex];
        this.selector.setY(item.bg.y);

        this.menuItems.forEach((m, i) => {
            if (i === this.selectedIndex) {
                m.bg.setFillStyle(0x4444aa, 0.9);
                m.bg.setStrokeStyle(2, 0xff6b9d);
                m.text.setColor('#ffffff');
            } else {
                m.bg.setFillStyle(0x333366, 0.8);
                m.bg.setStrokeStyle(2, 0x6666aa);
                m.text.setColor('#aaaacc');
            }
        });
    }

    startStoryMode() {
        gameState.reset();
        gameState.setMode('story');
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CharacterSelectScene');
        });
    }

    startArcadeMode() {
        gameState.reset();
        gameState.setMode('arcade');
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CharacterSelectScene');
        });
    }
}
