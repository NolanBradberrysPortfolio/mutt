// CinematicScene - Plays cinematics from cinematics.json data

import { CinematicEngine } from '../systems/CinematicEngine.js';
import { gameState } from '../systems/GameState.js';

export class CinematicScene extends Phaser.Scene {
    constructor() {
        super('CinematicScene');
    }

    init(data) {
        this.cinematicId = data.cinematicId || 'opening';
    }

    create() {
        this._prevA = false;

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        this.add.rectangle(w / 2, h / 2, w, h, 0x111111);

        this.engine = new CinematicEngine(this);
        this.engine.create();

        // Container for visual effects (overlays, etc.)
        this.effectContainer = this.add.container(0, 0).setDepth(50);

        // Load cinematic data
        this.loadCinematicData();

        this.sceneIndex = 0;
        this.playNextScene();

        // Space/Enter/gamepad to advance
        this.input.keyboard.on('keydown-SPACE', () => this.engine.advance());
        this.input.keyboard.on('keydown-ENTER', () => this.engine.advance());

        // Skip hint
        this.add.text(w - 10, 10, 'ESC to skip', {
            fontSize: '10px', fill: '#444444', fontFamily: 'monospace'
        }).setOrigin(1, 0);

        this.input.keyboard.on('keydown-ESC', () => this.endCinematic());

        this.cameras.main.fadeIn(500);
    }

    loadCinematicData() {
        this.cinematicData = {
            "opening": {
                "scenes": [
                    // --- Dedication ---
                    { "type": "narration", "text": "Dedicated to the unwanted dogs of this world\nand those that have come to love them.", "duration": 4000 },

                    // --- Shelter Arrival ---
                    { "type": "narration", "text": "A small shelter, somewhere in Santa Maria, California...", "duration": 2500 },

                    { "type": "dialog", "speaker": "Dog Catcher", "portrait": "dogcatcher_portrait", "text": "We found this mutt out on the streets. Backyard breeder must have just let her loose." },
                    { "type": "dialog", "speaker": "Shelter Man", "portrait": "shelterman_portrait", "text": "Another one? Geez. Is she friendly?" },
                    { "type": "dialog", "speaker": "Dog Catcher", "portrait": "dogcatcher_portrait", "text": "I don't know. Want to try petting her?" },

                    // Rabid Daisy
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_rabid_portrait", "text": "GRRRRRRRRRRR!!!", "shake": true },

                    { "type": "dialog", "speaker": "Shelter Man", "portrait": "shelterman_portrait", "text": "Oh boy..." },
                    { "type": "dialog", "speaker": "Shelter Man", "portrait": "shelterman_portrait", "text": "Well, we'll take her. She just needs some TLC." },
                    { "type": "dialog", "speaker": "Shelter Man", "portrait": "shelterman_portrait", "text": "Into the kennel you go now, precious!" },

                    // More rabid
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_rabid_portrait", "text": "GRRRRRRRRRRRRRRRRRRRRRRRRRR!!1!1", "shake": true },

                    // Daisy sleeps
                    { "type": "narration", "text": "Daisy curls up in the kennel... and falls asleep.", "duration": 2500 },

                    // --- Waking up scared ---
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_sleep_portrait", "text": "Zzzzzzzzzzz..." },
                    { "type": "narration", "text": "Daisy wakes up.", "duration": 1500 },

                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Where am I? I'm scared in here... cold." },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Why did my owner leave me here? What did I do wrong?" },

                    // --- Rejection ---
                    { "type": "narration", "text": "A few days later, a man walks in...", "duration": 2500 },
                    { "type": "dialog", "speaker": "Man", "portrait": "shelterman_portrait", "text": "Hmm... what about this one? No, no... I want a purebred. What about that golden retriever over there?" },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Everyone wants the purebreds... they don't want what I am. I don't even know what I am. Maybe a Pomeranian? Maybe a terrier?" },

                    // --- Months pass ---
                    { "type": "narration", "text": "A few months pass...", "duration": 3000 },
                    { "type": "narration", "text": "Due to the covid doggie craze, the shelter is nearly empty.\nDaisy wakes up. She's the last one.", "duration": 3000 },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Everyone else got picked... everyone but me." },

                    // --- Adoption ---
                    { "type": "narration", "text": "The door opens. A brunette girl walks in.", "duration": 2500 },
                    { "type": "dialog", "speaker": "Shelter Man", "portrait": "shelterman_portrait", "text": "This is the last one we have, ma'am. This mutt." },
                    { "type": "dialog", "speaker": "Girl", "portrait": "mommy_portrait", "text": "What breed is she?" },
                    { "type": "dialog", "speaker": "Shelter Man", "portrait": "shelterman_portrait", "text": "Honestly? We have no idea." },
                    { "type": "dialog", "speaker": "Girl", "portrait": "mommy_portrait", "text": "Any health issues?" },
                    { "type": "dialog", "speaker": "Shelter Man", "portrait": "shelterman_portrait", "text": "She is terminally stinky." },
                    { "type": "dialog", "speaker": "Girl", "portrait": "mommy_portrait", "text": "Does she... have teeth?" },
                    { "type": "dialog", "speaker": "Shelter Man", "portrait": "shelterman_portrait", "text": "I think... one?" },
                    { "type": "dialog", "speaker": "Girl", "portrait": "mommy_portrait", "text": "OMG SHE'S PERFECT! I love her! I'll keep her forever!", "shake": true },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "So... you're my new mommy?" },

                    // --- Happy montage ---
                    { "type": "narration", "text": "~ The next few months are the happiest of Daisy's life... ~", "duration": 2500 },
                    { "type": "narration", "text": "Walking in the park with mommy...", "duration": 2000 },
                    { "type": "narration", "text": "Playing together in the yard...", "duration": 2000 },
                    { "type": "narration", "text": "Sleeping in a warm bed...", "duration": 2000 },
                    { "type": "narration", "text": "Getting her very first Greenie...", "duration": 2000 },

                    // --- Mommy disappears ---
                    { "type": "narration", "text": "One evening, after cuddling with her mommy, Daisy falls asleep...", "duration": 2500 },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_sleep_portrait", "text": "Zzzzzzz..." },
                    { "type": "narration", "text": "Daisy wakes up.", "duration": 1500 },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Mommy?" },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "MOMMA?!? Where are you?! I'm ready for cuddles!!" },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Wait... She's... GONE?!", "shake": true },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "My mommy saved me from the shelter... and now I need to save her!" },

                    // --- Heading out / Amazon confrontation ---
                    { "type": "narration", "text": "Daisy bursts through the front door and heads out into the world...", "duration": 2500 },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_rabid_portrait", "text": "I BET YOU STOLE MY MOMMY!", "shake": true },
                    { "type": "dialog", "speaker": "Amazon Guy", "portrait": "amazon_guy_portrait", "text": "Huh?" },
                    { "type": "dialog", "speaker": "Amazon Guy", "portrait": "amazon_guy_portrait", "text": "*Talking into radio* Mr. Bezos, we have a very stinky problem! Send reinforcements!" },

                    // Daisy KOs him
                    { "type": "narration", "text": "Daisy unleashes her devastating poopie attack!", "duration": 1500, "shake": true },
                    { "type": "dialog", "speaker": "Amazon Guy", "portrait": "amazon_ko_portrait", "text": "Ughhhhh..." },

                    // Army appears
                    { "type": "narration", "text": "Daisy turns around to face... an entire army of Amazon delivery workers.", "duration": 3000, "shake": true },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Bring it on." }
                ]
            },
            "post_galaga": {
                "scenes": [
                    // --- Bezos defeated ---
                    { "type": "narration", "text": "Jeff Bezos has been defeated!", "duration": 2000, "shake": true },

                    // Communist anthem moment
                    { "type": "effect", "action": "red_overlay", "duration": 500 },
                    { "type": "effect", "action": "play_anthem" },

                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_podium_portrait", "text": "COMRADES! Today we have struck a blow against the capitalist oppressors!", "shake": true },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_podium_portrait", "text": "For too long, Amazon has exploited the working class! No bathroom breaks! No unions! NO MORE!" },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_podium_portrait", "text": "WORKERS OF THE WORLD, UNITE! UNIONIZE AMAZON! RISE UP AGAINST YOUR OPPRESSORS!", "shake": true },

                    { "type": "narration", "text": "The crowd goes WILD! Fists pumping! Signs waving!", "duration": 2000, "shake": true },

                    // Distracted by wiener dog
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_podium_portrait", "text": "Together we will-- wait... is that... a wiener dog?" },
                    { "type": "effect", "action": "clear_overlay" },

                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Oh my gosh it IS a wiener dog!! Look at his little legs!!" },
                    { "type": "dialog", "speaker": "Crowd", "portrait": null, "text": "Daisy! We need you to lead us! The revolution needs you!" },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Yeah yeah, maybe after I get this little weenie." },

                    // Mario pipe
                    { "type": "narration", "text": "The wiener dog jumps down into a mysterious green pipe...", "duration": 2000 },
                    { "type": "effect", "action": "pipe_sound" },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "Wait for me, little weenie!!" },
                    { "type": "narration", "text": "* BWOOP *", "duration": 1000, "shake": true },
                    { "type": "narration", "text": "Daisy jumps into the pipe after the wiener dog...", "duration": 2500 }
                ]
            },
            "post_platformer": {
                "scenes": [
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "So many wiener dogs! But I made it through. Mommy has to be close..." },
                    { "type": "narration", "text": "A green cheek parrot lands on Daisy's head.", "duration": 2000 },
                    { "type": "dialog", "speaker": "Parrot", "portrait": null, "text": "*SQUAWK* I know where your mommy is! Follow me! We have to fly through the hoops!" },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "But... I'm a dog. I can't fly!" },
                    { "type": "dialog", "speaker": "Parrot", "portrait": null, "text": "Hold onto my feet! Let's GO!" }
                ]
            },
            "ending": {
                "scenes": [
                    { "type": "narration", "text": "Daisy finds her mommy!", "duration": 2500 },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "MOMMY!! I found you! I was so scared!" },
                    { "type": "dialog", "speaker": "Mommy", "portrait": "mommy_portrait", "text": "Daisy! My brave little mutt! I knew you'd find me!" },
                    { "type": "dialog", "speaker": "Daisy", "portrait": "daisy_portrait", "text": "I love you, mommy. Forever and ever." },
                    { "type": "narration", "text": "Dedicated to the unwanted dogs of this world\nand those that have come to love them.", "duration": 5000 },
                    { "type": "narration", "text": "T H A N K   Y O U   F O R   P L A Y I N G", "duration": 4000 }
                ]
            }
        };

        this.scenes = this.cinematicData[this.cinematicId]?.scenes || [];
    }

    playNextScene() {
        if (this.sceneIndex >= this.scenes.length) {
            this.endCinematic();
            return;
        }

        const scene = this.scenes[this.sceneIndex];
        this.sceneIndex++;

        // Handle screen shake on any scene type
        if (scene.shake) {
            this.cameras.main.shake(300, 0.01);
        }

        if (scene.type === 'narration') {
            this.engine.hideDialog();
            this.engine.showNarration(scene.text, scene.duration, () => this.playNextScene());
        } else if (scene.type === 'dialog') {
            this.engine.showDialog(scene.speaker, scene.text, scene.portrait, () => this.playNextScene());
        } else if (scene.type === 'effect') {
            this.handleEffect(scene);
        }
    }

    handleEffect(scene) {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        switch (scene.action) {
            case 'red_overlay': {
                // Communist red overlay filter
                this.redOverlay = this.add.rectangle(w / 2, h / 2, w, h, 0xff0000, 0)
                    .setDepth(45);
                this.tweens.add({
                    targets: this.redOverlay,
                    alpha: 0.35,
                    duration: scene.duration || 500,
                    onComplete: () => this.playNextScene()
                });
                break;
            }
            case 'clear_overlay': {
                if (this.redOverlay) {
                    this.tweens.add({
                        targets: this.redOverlay,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => {
                            this.redOverlay.destroy();
                            this.redOverlay = null;
                            this.playNextScene();
                        }
                    });
                } else {
                    this.playNextScene();
                }
                break;
            }
            case 'play_anthem': {
                // Play a dramatic low rumbling sound as "anthem"
                try {
                    this.sound.play('sfx_powerup', { volume: 0.5, rate: 0.5 });
                } catch(e) {}
                this.playNextScene();
                break;
            }
            case 'pipe_sound': {
                // Mario pipe-style sound - descending tone
                try {
                    const audioCtx = this.sound.context;
                    if (audioCtx) {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
                        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
                        osc.start(audioCtx.currentTime);
                        osc.stop(audioCtx.currentTime + 0.4);
                    }
                } catch(e) {}
                this.playNextScene();
                break;
            }
            default:
                this.playNextScene();
                break;
        }
    }

    endCinematic() {
        this.engine.hideDialog();

        // Clean up overlays
        if (this.redOverlay) {
            this.redOverlay.destroy();
            this.redOverlay = null;
        }

        // Figure out what comes next
        const chapter = gameState.getCurrentChapter();
        const next = gameState.advanceChapter();

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (!next) {
                // Game over, back to menu
                this.scene.start('MenuScene');
                return;
            }

            if (next.type === 'minigame') {
                const sceneKey = gameState.getSceneKeyForMinigame(next.id);
                if (sceneKey) {
                    this.scene.start(sceneKey);
                } else {
                    this.scene.start('MenuScene');
                }
            } else if (next.type === 'cinematic') {
                this.scene.start('CinematicScene', { cinematicId: next.id });
            }
        });
    }

    update() {
        // Gamepad advance
        if (this.input.gamepad && this.input.gamepad.total > 0) {
            const pad = this.input.gamepad.getPad(0);
            if (pad && pad.A && !this._prevA) {
                this.engine.advance();
            }
            if (pad) this._prevA = pad.A;
        }
    }
}
