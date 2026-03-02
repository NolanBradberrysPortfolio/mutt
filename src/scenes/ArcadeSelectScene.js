// ArcadeSelectScene - Pick which mini-game to play in Arcade mode

import { gameState } from '../systems/GameState.js';

export class ArcadeSelectScene extends Phaser.Scene {
    constructor() {
        super('ArcadeSelectScene');
    }

    create() {
        this._prevPad = null;

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a2e);

        this.add.text(w / 2, 50, 'ARCADE MODE', {
            fontSize: '32px', fill: '#ff6b9d', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(w / 2, 90, 'Choose a mini-game', {
            fontSize: '14px', fill: '#888888', fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.selectedIndex = 0;
        this.menuItems = [];

        const games = [
            {
                name: 'Amazon Galaga',
                desc: 'Shoot carrots at Amazon workers!\nDefeat the Bezos boss!',
                scene: 'GalagaScene',
                color: 0xff9900
            },
            {
                name: 'Wiener Dog Mario',
                desc: 'Stomp wiener dogs into hot dogs!\nCollect power-ups!',
                scene: 'PlatformerScene',
                color: 0x44aa44
            },
            {
                name: 'Parrot Flappy Bird',
                desc: 'Fly through 30 hoops!\nDon\'t hit the pipes!',
                scene: 'FlappyScene',
                color: 0x4488ff
            }
        ];

        games.forEach((game, i) => {
            const y = 180 + i * 120;

            const bg = this.add.rectangle(w / 2, y, 500, 90, 0x222244, 0.7)
                .setStrokeStyle(2, 0x444488);

            const icon = this.add.rectangle(w / 2 - 200, y, 60, 60, game.color, 0.8);

            const title = this.add.text(w / 2 - 150, y - 18, game.name, {
                fontSize: '20px', fill: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold'
            });

            const desc = this.add.text(w / 2 - 150, y + 8, game.desc, {
                fontSize: '11px', fill: '#aaaaaa', fontFamily: 'monospace'
            });

            // Make tappable
            bg.setInteractive();
            bg.on('pointerdown', () => {
                this.selectedIndex = i;
                this.updateSelector();
                this.selectItem();
            });

            this.menuItems.push({ bg, icon, title, desc, scene: game.scene });
        });

        // Back option
        const backY = 180 + 3 * 120;
        const backBg = this.add.rectangle(w / 2, backY, 500, 50, 0x222244, 0.7)
            .setStrokeStyle(2, 0x444488);
        const backTitle = this.add.text(w / 2, backY, '< Back to Menu', {
            fontSize: '18px', fill: '#888888', fontFamily: 'monospace'
        }).setOrigin(0.5);
        backBg.setInteractive();
        backBg.on('pointerdown', () => { this.goBack(); });
        this.menuItems.push({ bg: backBg, title: backTitle, scene: 'MenuScene', isBack: true });

        // Selector
        this.selector = this.add.text(w / 2 - 275, 180, '>', {
            fontSize: '24px', fill: '#ff6b9d', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.updateSelector();

        // Input
        this.cursors = this.input.keyboard.addKeys({
            up: 'W', down: 'S', confirm: 'SPACE',
            up2: 'UP', down2: 'DOWN', confirm2: 'ENTER',
            back: 'ESC'
        });

        this.cameras.main.fadeIn(400);
    }

    update() {
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
            this.selectItem();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.back)) {
            this.goBack();
        }

        // Gamepad
        if (this.input.gamepad && this.input.gamepad.total > 0) {
            const pad = this.input.gamepad.getPad(0);
            if (pad) {
                if (!this._prevPad) this._prevPad = { up: false, down: false, a: false, b: false };
                if (pad.up && !this._prevPad.up) {
                    this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
                    this.updateSelector();
                }
                if (pad.down && !this._prevPad.down) {
                    this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
                    this.updateSelector();
                }
                if (pad.A && !this._prevPad.a) this.selectItem();
                if (pad.B && !this._prevPad.b) this.goBack();
                this._prevPad = { up: pad.up, down: pad.down, a: pad.A, b: pad.B };
            }
        }
    }

    updateSelector() {
        const item = this.menuItems[this.selectedIndex];
        this.selector.setY(item.bg.y);

        this.menuItems.forEach((m, i) => {
            if (i === this.selectedIndex) {
                m.bg.setStrokeStyle(2, 0xff6b9d);
                m.bg.setFillStyle(0x333366, 0.9);
                if (m.title.setColor) m.title.setColor('#ffffff');
            } else {
                m.bg.setStrokeStyle(2, 0x444488);
                m.bg.setFillStyle(0x222244, 0.7);
                if (m.isBack && m.title.setColor) m.title.setColor('#888888');
            }
        });
    }

    selectItem() {
        const item = this.menuItems[this.selectedIndex];
        try { this.sound.play('sfx_confirm', { volume: 0.4 }); } catch(e) {}

        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(item.scene);
        });
    }

    goBack() {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MenuScene');
        });
    }
}
