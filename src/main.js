// MUTT - Variety Broken Attention Span Arcade
// "Dedicated to the unwanted dogs of this world and those that have come to love them"

import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { CinematicScene } from './scenes/CinematicScene.js';
import { GalagaScene } from './scenes/minigames/GalagaScene.js';
import { PlatformerScene } from './scenes/minigames/PlatformerScene.js';
import { FlappyScene } from './scenes/minigames/FlappyScene.js';
import { ResultsScene } from './scenes/ResultsScene.js';
import { ArcadeSelectScene } from './scenes/ArcadeSelectScene.js';

// Detect mobile and pick the best scale mode
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: document.body,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: '#111111',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    input: {
        touch: { capture: true },
        gamepad: true
    },
    scale: {
        mode: isMobile ? Phaser.Scale.ENVELOP : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        BootScene,
        MenuScene,
        CharacterSelectScene,
        CinematicScene,
        GalagaScene,
        PlatformerScene,
        FlappyScene,
        ResultsScene,
        ArcadeSelectScene
    ]
};

const game = new Phaser.Game(config);

// Apply saved zoom on startup (desktop only — mobile uses ENVELOP auto-scaling)
if (!isMobile) {
    const savedZoom = parseFloat(localStorage.getItem('mutt_zoom') || '1');
    if (savedZoom !== 1) {
        game.events.once('ready', () => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.style.transform = `scale(${savedZoom})`;
                canvas.style.transformOrigin = 'center center';
            }
        });
    }
}

// Store global game state
game.registry.set('mode', 'story');       // 'story' or 'arcade'
game.registry.set('playerCount', 1);
game.registry.set('characters', [0]);     // Selected character indices
game.registry.set('scores', {});
game.registry.set('currentChapter', 0);
game.registry.set('isMobile', isMobile);
