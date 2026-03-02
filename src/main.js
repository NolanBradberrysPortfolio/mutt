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
        mode: Phaser.Scale.FIT,
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

// Store global game state
game.registry.set('mode', 'story');       // 'story' or 'arcade'
game.registry.set('playerCount', 1);
game.registry.set('characters', [0]);     // Selected character indices
game.registry.set('scores', {});
game.registry.set('currentChapter', 0);
