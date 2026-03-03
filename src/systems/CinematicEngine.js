// CinematicEngine - Dialogue boxes, portraits, typewriter text, transitions

export class CinematicEngine {
    constructor(scene) {
        this.scene = scene;
        this.dialogBox = null;
        this.portraitSprite = null;
        this.nameText = null;
        this.dialogText = null;
        this.isTyping = false;
        this.typewriterTimer = null;
        this.currentText = '';
        this.displayedText = '';
        this.charIndex = 0;
        this.onComplete = null;
        this.container = null;
        this.skipIndicator = null;
    }

    create() {
        const w = this.scene.cameras.main.width;
        const h = this.scene.cameras.main.height;

        this.container = this.scene.add.container(0, 0).setDepth(100);

        // Dialog box background at bottom of screen
        this.dialogBg = this.scene.add.rectangle(w / 2, h - 100, 760, 180, 0x000000, 0.88)
            .setStrokeStyle(3, 0xffffff);
        this.container.add(this.dialogBg);

        // Portrait frame (left side of dialog)
        this.portraitBg = this.scene.add.rectangle(90, h - 100, 110, 110, 0x222244)
            .setStrokeStyle(2, 0xaaaaff);
        this.container.add(this.portraitBg);

        // Portrait sprite
        this.portraitSprite = this.scene.add.sprite(90, h - 100, 'daisy_portrait')
            .setScale(1.2);
        this.container.add(this.portraitSprite);

        // Speaker name
        this.nameText = this.scene.add.text(160, h - 180, '', {
            fontSize: '22px', fill: '#ffcc00', fontFamily: 'monospace', fontStyle: 'bold'
        });
        this.container.add(this.nameText);

        // Dialog text
        this.dialogText = this.scene.add.text(160, h - 152, '', {
            fontSize: '20px', fill: '#ffffff', fontFamily: 'monospace',
            wordWrap: { width: 560 }, lineSpacing: 6
        });
        this.container.add(this.dialogText);

        // Skip indicator
        this.skipIndicator = this.scene.add.text(w - 70, h - 22, '[ TAP ]', {
            fontSize: '13px', fill: '#888888', fontFamily: 'monospace'
        });
        this.container.add(this.skipIndicator);

        // Blinking animation for skip indicator
        this.scene.tweens.add({
            targets: this.skipIndicator,
            alpha: 0.3,
            duration: 600,
            yoyo: true,
            repeat: -1
        });

        this.container.setVisible(false);
    }

    showDialog(speaker, text, portrait, callback) {
        this.container.setVisible(true);

        this.nameText.setText(speaker);
        this.currentText = text;
        this.displayedText = '';
        this.charIndex = 0;
        this.onComplete = callback;

        if (portrait) {
            this.portraitSprite.setTexture(portrait);
            this.portraitSprite.setVisible(true);
            this.portraitBg.setVisible(true);
        } else {
            this.portraitSprite.setVisible(false);
            this.portraitBg.setVisible(false);
            this.nameText.setX(60);
            this.dialogText.setX(60);
            this.dialogText.setWordWrapWidth(660);
        }

        this.isTyping = true;
        this.dialogText.setText('');

        // Typewriter effect
        if (this.typewriterTimer) this.typewriterTimer.remove();
        this.typewriterTimer = this.scene.time.addEvent({
            delay: 30,
            callback: () => {
                if (this.charIndex < this.currentText.length) {
                    this.displayedText += this.currentText[this.charIndex];
                    this.dialogText.setText(this.displayedText);
                    this.charIndex++;

                    // Typewriter sound every few chars
                    if (this.charIndex % 3 === 0) {
                        try { this.scene.sound.play('sfx_typewriter', { volume: 0.1 }); } catch(e) {}
                    }
                } else {
                    this.isTyping = false;
                    this.typewriterTimer.remove();
                }
            },
            loop: true
        });
    }

    advance() {
        if (this.isTyping) {
            // Skip to end of text
            this.isTyping = false;
            if (this.typewriterTimer) this.typewriterTimer.remove();
            this.displayedText = this.currentText;
            this.dialogText.setText(this.displayedText);
        } else if (this.onComplete) {
            const cb = this.onComplete;
            this.onComplete = null;
            cb();
        }
    }

    hideDialog() {
        this.container.setVisible(false);
        if (this.typewriterTimer) this.typewriterTimer.remove();
    }

    // Narration text (centered, no portrait)
    showNarration(text, duration, callback) {
        const w = this.scene.cameras.main.width;
        const h = this.scene.cameras.main.height;

        const narrationText = this.scene.add.text(w / 2, h / 2, text, {
            fontSize: '26px', fill: '#cccccc', fontFamily: 'monospace',
            fontStyle: 'italic', align: 'center',
            wordWrap: { width: 680 }, lineSpacing: 6
        }).setOrigin(0.5).setAlpha(0).setDepth(101);

        this.scene.tweens.add({
            targets: narrationText,
            alpha: 1,
            duration: 800,
            hold: duration || 2000,
            yoyo: true,
            onComplete: () => {
                narrationText.destroy();
                if (callback) callback();
            }
        });
    }

    // Scene transition - fade
    fadeOut(duration, callback) {
        this.scene.cameras.main.fadeOut(duration || 500, 0, 0, 0);
        this.scene.cameras.main.once('camerafadeoutcomplete', () => {
            if (callback) callback();
        });
    }

    fadeIn(duration) {
        this.scene.cameras.main.fadeIn(duration || 500, 0, 0, 0);
    }

    destroy() {
        if (this.typewriterTimer) this.typewriterTimer.remove();
        if (this.container) this.container.destroy();
    }
}
