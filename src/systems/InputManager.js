// InputManager - Routes keyboard/gamepad/touch input to up to 6 player slots

export class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.maxPlayers = 6;
        this.players = [];
        this.gamepads = new Map(); // gamepad index -> player slot

        // Keyboard mappings for up to 6 players
        this.keyboardMaps = [
            { // Player 1: WASD + Space/E
                up: 'W', down: 'S', left: 'A', right: 'D',
                action1: 'SPACE', action2: 'E'
            },
            { // Player 2: Arrow keys + . /
                up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT',
                action1: 'PERIOD', action2: 'FORWARD_SLASH'
            },
            { // Player 3: IJKL + U/O
                up: 'I', down: 'K', left: 'J', right: 'L',
                action1: 'U', action2: 'O'
            },
            { // Player 4: Numpad 8456 + 7/9
                up: 'NUMPAD_EIGHT', down: 'NUMPAD_FIVE', left: 'NUMPAD_FOUR', right: 'NUMPAD_SIX',
                action1: 'NUMPAD_SEVEN', action2: 'NUMPAD_NINE'
            },
            { // Player 5: TFGH + R/Y
                up: 'T', down: 'G', left: 'F', right: 'H',
                action1: 'R', action2: 'Y'
            },
            { // Player 6: Numpad 2013 + Numpad +/-
                up: 'NUMPAD_ZERO', down: 'NUMPAD_ONE', left: 'NUMPAD_TWO', right: 'NUMPAD_THREE',
                action1: 'NUMPAD_ADD', action2: 'NUMPAD_SUBTRACT'
            }
        ];

        this.keyObjects = [];

        // Touch controls state (Player 1 only)
        this.isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        this.touchState = { x: 0, y: 0, action1: false, action2: false };
        this._prevTouch = { action1: false, action2: false };
        this.touchButtons = [];
    }

    init(playerCount) {
        this.cleanup();
        const count = Math.min(Math.max(1, playerCount), this.maxPlayers);

        for (let i = 0; i < count; i++) {
            const map = this.keyboardMaps[i];
            const keys = {};

            for (const [action, keyName] of Object.entries(map)) {
                const keyCode = Phaser.Input.Keyboard.KeyCodes[keyName];
                if (keyCode !== undefined) {
                    keys[action] = this.scene.input.keyboard.addKey(keyCode);
                }
            }

            this.players.push({
                index: i,
                keys,
                gamepadIndex: null,
                active: true
            });
            this.keyObjects.push(keys);
        }

        // Listen for gamepad connections
        if (this.scene.input.gamepad) {
            this.scene.input.gamepad.on('connected', (pad) => this.onGamepadConnected(pad));
            this.scene.input.gamepad.on('disconnected', (pad) => this.onGamepadDisconnected(pad));

            // Check already-connected gamepads
            for (const pad of this.scene.input.gamepad.gamepads) {
                if (pad) this.onGamepadConnected(pad);
            }
        }

        // Create touch controls on mobile
        if (this.isMobile) {
            this._createTouchControls();
        }

        return this.players;
    }

    _createTouchControls() {
        const cam = this.scene.cameras.main;
        const w = cam.width;
        const h = cam.height;
        const btnSize = 44;
        const gap = 6;

        // D-pad positioning (bottom-left)
        const dpadCenterX = w * 0.13;
        const dpadCenterY = h * 0.78;

        // Action button positioning (bottom-right)
        const actionCenterX = w * 0.87;
        const actionCenterY = h * 0.78;

        const dpadDefs = [
            { key: 'up',    label: '\u25B2', x: dpadCenterX, y: dpadCenterY - btnSize - gap },
            { key: 'down',  label: '\u25BC', x: dpadCenterX, y: dpadCenterY + btnSize + gap },
            { key: 'left',  label: '\u25C0', x: dpadCenterX - btnSize - gap, y: dpadCenterY },
            { key: 'right', label: '\u25B6', x: dpadCenterX + btnSize + gap, y: dpadCenterY },
        ];

        const actionDefs = [
            { key: 'action1', label: 'A', x: actionCenterX, y: actionCenterY + btnSize / 2 + gap / 2 },
            { key: 'action2', label: 'B', x: actionCenterX, y: actionCenterY - btnSize / 2 - gap / 2 },
        ];

        const allDefs = [...dpadDefs, ...actionDefs];

        for (const def of allDefs) {
            // Circle background
            const circle = this.scene.add.circle(def.x, def.y, btnSize / 2, 0x222222, 0.35)
                .setScrollFactor(0)
                .setDepth(9999)
                .setStrokeStyle(2, 0xffffff, 0.5);

            // Label text
            const label = this.scene.add.text(def.x, def.y, def.label, {
                fontSize: '18px',
                fontFamily: 'monospace',
                color: '#ffffff',
                align: 'center'
            })
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(10000)
                .setAlpha(0.6);

            // Make interactive
            circle.setInteractive({ useHandCursor: false });

            if (def.key === 'up' || def.key === 'down' || def.key === 'left' || def.key === 'right') {
                const axis = (def.key === 'left' || def.key === 'right') ? 'x' : 'y';
                const val = (def.key === 'right' || def.key === 'down') ? 1 : -1;
                circle.on('pointerdown', () => { this.touchState[axis] = val; });
                circle.on('pointerup', () => { if (this.touchState[axis] === val) this.touchState[axis] = 0; });
                circle.on('pointerout', () => { if (this.touchState[axis] === val) this.touchState[axis] = 0; });
            } else {
                circle.on('pointerdown', () => { this.touchState[def.key] = true; });
                circle.on('pointerup', () => { this.touchState[def.key] = false; });
                circle.on('pointerout', () => { this.touchState[def.key] = false; });
            }

            this.touchButtons.push(circle, label);
        }

        // Enable multi-touch
        this.scene.input.addPointer(3); // support up to 4 simultaneous touches
    }

    _destroyTouchControls() {
        for (const obj of this.touchButtons) {
            obj.destroy();
        }
        this.touchButtons = [];
        this.touchState = { x: 0, y: 0, action1: false, action2: false };
        this._prevTouch = { action1: false, action2: false };
    }

    onGamepadConnected(pad) {
        // Assign gamepad to first player without one
        for (const player of this.players) {
            if (player.gamepadIndex === null) {
                player.gamepadIndex = pad.index;
                this.gamepads.set(pad.index, player.index);
                break;
            }
        }
    }

    onGamepadDisconnected(pad) {
        const playerIndex = this.gamepads.get(pad.index);
        if (playerIndex !== undefined) {
            this.players[playerIndex].gamepadIndex = null;
            this.gamepads.delete(pad.index);
        }
    }

    getInput(playerIndex) {
        const player = this.players[playerIndex];
        if (!player || !player.active) {
            return { x: 0, y: 0, action1: false, action1Down: false, action2: false, action2Down: false };
        }

        let x = 0, y = 0;
        let action1 = false, action1Down = false;
        let action2 = false, action2Down = false;

        // Keyboard input
        const keys = player.keys;
        if (keys.left && keys.left.isDown) x -= 1;
        if (keys.right && keys.right.isDown) x += 1;
        if (keys.up && keys.up.isDown) y -= 1;
        if (keys.down && keys.down.isDown) y += 1;
        if (keys.action1) {
            action1 = keys.action1.isDown;
            action1Down = Phaser.Input.Keyboard.JustDown(keys.action1);
        }
        if (keys.action2) {
            action2 = keys.action2.isDown;
            action2Down = Phaser.Input.Keyboard.JustDown(keys.action2);
        }

        // Gamepad input (overrides/adds to keyboard)
        if (player.gamepadIndex !== null && this.scene.input.gamepad) {
            const pad = this.scene.input.gamepad.getPad(player.gamepadIndex);
            if (pad) {
                const deadzone = 0.25;
                const ax = pad.axes.length > 0 ? pad.axes[0].getValue() : 0;
                const ay = pad.axes.length > 1 ? pad.axes[1].getValue() : 0;

                if (Math.abs(ax) > deadzone) x = ax > 0 ? 1 : -1;
                if (Math.abs(ay) > deadzone) y = ay > 0 ? 1 : -1;

                // D-pad
                if (pad.left) x = -1;
                if (pad.right) x = 1;
                if (pad.up) y = -1;
                if (pad.down) y = 1;

                // Buttons: A=action1, B/X=action2
                if (pad.A) action1 = true;
                if (pad.B || pad.X) action2 = true;

                // "Just pressed" for gamepad - we track previous state
                if (!player._prevPad) player._prevPad = { a: false, b: false };
                action1Down = action1Down || (pad.A && !player._prevPad.a);
                action2Down = action2Down || ((pad.B || pad.X) && !player._prevPad.b);
                player._prevPad.a = pad.A;
                player._prevPad.b = pad.B || pad.X;
            }
        }

        // Touch input (Player 1 only, merged with OR logic)
        if (playerIndex === 0 && this.isMobile) {
            if (this.touchState.x !== 0) x = this.touchState.x;
            if (this.touchState.y !== 0) y = this.touchState.y;
            if (this.touchState.action1) action1 = true;
            if (this.touchState.action2) action2 = true;

            // Edge detection for touch "just pressed"
            const a1Down = this.touchState.action1 && !this._prevTouch.action1;
            const a2Down = this.touchState.action2 && !this._prevTouch.action2;
            this._prevTouch.action1 = this.touchState.action1;
            this._prevTouch.action2 = this.touchState.action2;
            action1Down = action1Down || a1Down;
            action2Down = action2Down || a2Down;
        }

        return { x, y, action1, action1Down, action2, action2Down };
    }

    getAnyInput() {
        for (let i = 0; i < this.players.length; i++) {
            const input = this.getInput(i);
            if (input.action1Down || input.action2Down || input.x !== 0 || input.y !== 0) {
                return { playerIndex: i, ...input };
            }
        }
        return null;
    }

    getAnyAction() {
        for (let i = 0; i < this.players.length; i++) {
            const input = this.getInput(i);
            if (input.action1Down) return { playerIndex: i, action: 'action1' };
            if (input.action2Down) return { playerIndex: i, action: 'action2' };
        }
        return null;
    }

    cleanup() {
        for (const keySet of this.keyObjects) {
            for (const key of Object.values(keySet)) {
                if (key && key.plugin) {
                    this.scene.input.keyboard.removeKey(key);
                }
            }
        }
        this.players = [];
        this.keyObjects = [];
        this.gamepads.clear();
        this._destroyTouchControls();
    }
}
