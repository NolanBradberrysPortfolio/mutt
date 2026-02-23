// AudioManager - SFX pooling, pitch variation, music crossfade

export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.musicVolume = 0.4;
        this.sfxVolume = 0.6;
        this.currentMusic = null;
        this.muted = false;
    }

    playSfx(key, pitchVariation = 0.1) {
        if (this.muted) return;
        try {
            const rate = 1 + (Math.random() * 2 - 1) * pitchVariation;
            const vol = this.sfxVolume * (0.9 + Math.random() * 0.2);
            this.scene.sound.play(key, { rate, volume: vol });
        } catch (e) {
            // Sound not loaded yet, skip
        }
    }

    playMusic(key, loop = true) {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        try {
            this.currentMusic = this.scene.sound.add(key, {
                volume: this.musicVolume,
                loop
            });
            this.currentMusic.play();
        } catch (e) {
            // Music not available
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    crossfadeMusic(newKey, duration = 1000) {
        if (this.currentMusic) {
            this.scene.tweens.add({
                targets: this.currentMusic,
                volume: 0,
                duration,
                onComplete: () => {
                    this.currentMusic.stop();
                    this.playMusic(newKey);
                }
            });
        } else {
            this.playMusic(newKey);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        this.scene.sound.mute = this.muted;
        return this.muted;
    }
}
