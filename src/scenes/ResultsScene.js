// ResultsScene - Score screen between games

import { gameState } from '../systems/GameState.js';

export class ResultsScene extends Phaser.Scene {
    constructor() {
        super('ResultsScene');
    }

    init(data) {
        this.gameName = data.gameName || 'Mini-Game';
        this.scores = data.scores || {};
        this.won = data.won !== false;
        this.nextScene = data.nextScene || 'MenuScene';
    }

    create() {
        this._continuing = false;
        this._prevA = false;

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a2e);

        // Title
        this.add.text(w / 2, 60, this.gameName, {
            fontSize: '28px', fill: '#ff6b9d', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Result
        const resultText = this.won ? 'COMPLETE!' : 'GAME OVER';
        const resultColor = this.won ? '#88ff88' : '#ff4444';
        this.add.text(w / 2, 110, resultText, {
            fontSize: '36px', fill: resultColor, fontFamily: 'monospace', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // Player scores
        let y = 180;
        const playerColors = ['#ff6b9d', '#6bff9d', '#6b9dff', '#ffff6b', '#ff9d6b', '#9d6bff'];
        let highScore = 0;
        let highScorePlayer = 0;

        for (const [playerIndex, score] of Object.entries(this.scores)) {
            const i = parseInt(playerIndex);
            const color = playerColors[i] || '#ffffff';

            this.add.text(w / 2, y, 'Player ' + (i + 1), {
                fontSize: '18px', fill: color, fontFamily: 'monospace'
            }).setOrigin(0.5);

            this.add.text(w / 2, y + 28, score.toString() + ' pts', {
                fontSize: '24px', fill: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            if (score > highScore) {
                highScore = score;
                highScorePlayer = i;
            }

            y += 70;
        }

        // MVP indicator for multiplayer
        if (gameState.playerCount > 1) {
            this.add.text(w / 2, y + 10, 'MVP: Player ' + (highScorePlayer + 1) + '!', {
                fontSize: '16px', fill: '#ffcc00', fontFamily: 'monospace', fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // Total score
        this.add.text(w / 2, h - 100, 'Total Score: ' + gameState.totalScore, {
            fontSize: '18px', fill: '#aaaacc', fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Star particles for celebration
        if (this.won) {
            for (let i = 0; i < 20; i++) {
                const star = this.add.sprite(
                    Math.random() * w, Math.random() * h,
                    'star_particle'
                ).setScale(Math.random() * 2 + 1);

                this.tweens.add({
                    targets: star,
                    y: star.y + 100,
                    alpha: 0,
                    duration: Math.random() * 2000 + 1000,
                    delay: Math.random() * 1000,
                    onComplete: () => star.destroy()
                });
            }
        }

        // Story mode: show Retry / Continue options
        const isStoryMinigame = this.nextScene === 'story_next';
        if (isStoryMinigame) {
            this._selectedOption = 0; // 0 = retry, 1 = continue

            const retryLabel = this.add.text(w / 2, h - 80, '> RETRY', {
                fontSize: '18px', fill: '#ff6b9d', fontFamily: 'monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            const continueLabel = this.add.text(w / 2, h - 50, '  CONTINUE STORY', {
                fontSize: '18px', fill: '#888888', fontFamily: 'monospace'
            }).setOrigin(0.5);

            this._optionTexts = [retryLabel, continueLabel];
            this._updateOptionHighlight();

            this.input.keyboard.on('keydown-UP', () => this._switchOption());
            this.input.keyboard.on('keydown-DOWN', () => this._switchOption());
            this.input.keyboard.on('keydown-W', () => this._switchOption());
            this.input.keyboard.on('keydown-S', () => this._switchOption());
            this.input.keyboard.on('keydown-SPACE', () => this._confirmOption());
            this.input.keyboard.on('keydown-ENTER', () => this._confirmOption());
        } else {
            // Non-story: single continue prompt
            const continueText = this.add.text(w / 2, h - 50, 'Press SPACE to continue', {
                fontSize: '16px', fill: '#888888', fontFamily: 'monospace'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: continueText,
                alpha: 0.3, duration: 600, yoyo: true, repeat: -1
            });

            this.input.keyboard.on('keydown-SPACE', () => this.continue());
            this.input.keyboard.on('keydown-ENTER', () => this.continue());
        }

        this.cameras.main.fadeIn(400);
    }

    _switchOption() {
        this._selectedOption = this._selectedOption === 0 ? 1 : 0;
        this._updateOptionHighlight();
        try { this.sound.play('sfx_select', { volume: 0.2 }); } catch(e) {}
    }

    _updateOptionHighlight() {
        if (!this._optionTexts) return;
        const labels = ['RETRY', 'CONTINUE STORY'];
        this._optionTexts.forEach((txt, i) => {
            if (i === this._selectedOption) {
                txt.setText('> ' + labels[i]);
                txt.setStyle({ fill: '#ff6b9d', fontStyle: 'bold' });
            } else {
                txt.setText('  ' + labels[i]);
                txt.setStyle({ fill: '#888888', fontStyle: '' });
            }
        });
    }

    _confirmOption() {
        if (this._selectedOption === 0) {
            this.retry();
        } else {
            this.continue();
        }
    }

    retry() {
        if (this._continuing) return;
        this._continuing = true;

        try { this.sound.play('sfx_confirm', { volume: 0.3 }); } catch(e) {}

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Get current chapter's minigame scene key without advancing
            const chapter = gameState.getCurrentChapter();
            if (chapter && chapter.type === 'minigame') {
                const sceneKey = gameState.getSceneKeyForMinigame(chapter.id);
                this.scene.start(sceneKey || 'MenuScene');
            } else {
                // Fallback — shouldn't happen
                this.scene.start('MenuScene');
            }
        });
    }

    continue() {
        if (this._continuing) return;
        this._continuing = true;

        try { this.sound.play('sfx_confirm', { volume: 0.3 }); } catch(e) {}

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (this.nextScene === 'story_next') {
                // Advance story
                const next = gameState.advanceChapter();
                if (!next) {
                    this.scene.start('MenuScene');
                    return;
                }

                if (next.type === 'cinematic') {
                    this.scene.start('CinematicScene', { cinematicId: next.id });
                } else if (next.type === 'minigame') {
                    const sceneKey = gameState.getSceneKeyForMinigame(next.id);
                    this.scene.start(sceneKey || 'MenuScene');
                }
            } else {
                this.scene.start(this.nextScene);
            }
        });
    }

    update() {
        // Gamepad support
        if (this.input.gamepad && this.input.gamepad.total > 0) {
            const pad = this.input.gamepad.getPad(0);
            if (pad) {
                // D-pad up/down to switch options in story mode
                const dpadUp = pad.up;
                const dpadDown = pad.down;
                if ((dpadUp && !this._prevUp) || (dpadDown && !this._prevDown)) {
                    if (this._optionTexts) this._switchOption();
                }
                this._prevUp = dpadUp;
                this._prevDown = dpadDown;

                // A button to confirm
                if (pad.A && !this._prevA) {
                    if (this._optionTexts) {
                        this._confirmOption();
                    } else {
                        this.continue();
                    }
                }
                this._prevA = pad.A;
            }
        }
    }
}
