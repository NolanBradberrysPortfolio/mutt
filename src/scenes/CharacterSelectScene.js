// CharacterSelectScene - Pick your dog (5 options), supports 2-6 player join

import { gameState } from '../systems/GameState.js';
import { InputManager } from '../systems/InputManager.js';
import { DOG_CLASSES } from '../data/classes.js';

export class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this._starting = false;

        this.input_mgr = new InputManager(this);
        this.input_mgr.init(6); // Allow up to 6 to join

        this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a2e);

        this.add.text(w / 2, 40, 'Choose Your Dog!', {
            fontSize: '28px', fill: '#ff6b9d', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(w / 2, 75, 'Press ACTION to join  |  Press ACTION again to ready up', {
            fontSize: '11px', fill: '#888888', fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Dog characters with classes
        this.dogSprites = [];
        this.dogNameTexts = [];
        const startX = 120;
        const spacing = 140;

        for (let i = 0; i < 5; i++) {
            const x = startX + i * spacing;
            const y = 170;
            const cls = DOG_CLASSES[i];

            const bg = this.add.rectangle(x, y, 110, 110, 0x222244, 0.6)
                .setStrokeStyle(2, 0x444488);

            const sprite = this.add.sprite(x, y - 10, 'dog_' + i).setScale(2.5);
            this.dogSprites.push(sprite);

            // Name
            this.add.text(x, y + 50, cls.name, {
                fontSize: '14px', fill: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            // Class name in class color
            this.add.text(x, y + 66, cls.className, {
                fontSize: '12px', fill: cls.color, fontFamily: 'monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            // Class description
            this.add.text(x, y + 80, cls.description, {
                fontSize: '8px', fill: '#aaaaaa', fontFamily: 'monospace'
            }).setOrigin(0.5);
        }

        // Player slots
        this.playerSlots = [];
        this.playerJoined = [];
        this.playerReady = [];
        this.playerSelection = [];
        this.playerCursors = [];
        this.slotTexts = [];
        this.slotBgs = [];

        const slotColors = [0xff6b9d, 0x6bff9d, 0x6b9dff, 0xffff6b, 0xff9d6b, 0x9d6bff];

        for (let i = 0; i < 6; i++) {
            const x = 68 + i * 120;
            const y = 380;

            const bg = this.add.rectangle(x, y, 105, 140, 0x222222, 0.5)
                .setStrokeStyle(2, slotColors[i]);
            this.slotBgs.push(bg);

            const pText = this.add.text(x, y - 55, 'P' + (i + 1), {
                fontSize: '16px', fill: Phaser.Display.Color.IntegerToColor(slotColors[i]).rgba,
                fontFamily: 'monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            const statusText = this.add.text(x, y, 'Press\nACTION\nto join', {
                fontSize: '10px', fill: '#666666', fontFamily: 'monospace',
                align: 'center'
            }).setOrigin(0.5);
            this.slotTexts.push(statusText);

            this.playerJoined.push(false);
            this.playerReady.push(false);
            this.playerSelection.push(0);
        }

        // Player 1 auto-joins
        this.joinPlayer(0);

        // Start button hint
        this.startHint = this.add.text(w / 2, h - 40, '', {
            fontSize: '14px', fill: '#88ff88', fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.cameras.main.fadeIn(400);
    }

    joinPlayer(index) {
        this.playerJoined[index] = true;
        this.updateSlot(index);
        try { this.sound.play('sfx_confirm', { volume: 0.3 }); } catch(e) {}
    }

    updateSlot(index) {
        const x = 68 + index * 120;
        const y = 380;

        if (this.playerJoined[index]) {
            if (this.playerReady[index]) {
                this.slotTexts[index].setText('READY!');
                this.slotTexts[index].setColor('#88ff88');
                this.slotBgs[index].setFillStyle(0x224422, 0.7);
            } else {
                const sel = this.playerSelection[index];
                const cls = DOG_CLASSES[sel];
                this.slotTexts[index].setText('< ' + cls.name + ' >\n' + cls.className);
                this.slotTexts[index].setColor('#ffffff');
                this.slotBgs[index].setFillStyle(0x333344, 0.7);
            }
        }
    }

    update() {
        let allReady = false;
        let joinedCount = 0;

        for (let i = 0; i < 6; i++) {
            const input = this.input_mgr.getInput(i);

            if (!this.playerJoined[i]) {
                // Join on action1
                if (input.action1Down) {
                    this.joinPlayer(i);
                }
                continue;
            }

            if (this.playerReady[i]) {
                // Un-ready on action2
                if (input.action2Down) {
                    this.playerReady[i] = false;
                    this.updateSlot(i);
                }
                continue;
            }

            // Navigate character selection
            if (input.x < 0 && !this['_prevX_' + i]) {
                this.playerSelection[i] = (this.playerSelection[i] - 1 + 5) % 5;
                this.updateSlot(i);
                try { this.sound.play('sfx_select', { volume: 0.2 }); } catch(e) {}
            }
            if (input.x > 0 && !this['_prevX_' + i]) {
                this.playerSelection[i] = (this.playerSelection[i] + 1) % 5;
                this.updateSlot(i);
                try { this.sound.play('sfx_select', { volume: 0.2 }); } catch(e) {}
            }
            this['_prevX_' + i] = input.x !== 0;

            // Ready up
            if (input.action1Down) {
                this.playerReady[i] = true;
                this.updateSlot(i);
                try { this.sound.play('sfx_confirm', { volume: 0.3 }); } catch(e) {}
            }

            joinedCount++;
        }

        // Count joined & ready
        joinedCount = 0;
        let readyCount = 0;
        for (let i = 0; i < 6; i++) {
            if (this.playerJoined[i]) joinedCount++;
            if (this.playerJoined[i] && this.playerReady[i]) readyCount++;
        }

        if (joinedCount > 0 && readyCount === joinedCount) {
            this.startHint.setText('All players ready! Starting...');
            if (!this._starting) {
                this._starting = true;
                this.time.delayedCall(1000, () => this.startGame());
            }
        } else if (joinedCount > 0) {
            this.startHint.setText(readyCount + '/' + joinedCount + ' players ready');
        }
    }

    startGame() {
        // Gather selections
        const characters = [];
        let count = 0;
        for (let i = 0; i < 6; i++) {
            if (this.playerJoined[i]) {
                characters.push(this.playerSelection[i]);
                count++;
            }
        }

        gameState.setPlayers(count, characters);

        this.input_mgr.cleanup();

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (gameState.mode === 'story') {
                this.scene.start('CinematicScene', { cinematicId: 'opening' });
            } else {
                // Arcade mode - pick a mini-game
                this.scene.start('ArcadeSelectScene');
            }
        });
    }
}
