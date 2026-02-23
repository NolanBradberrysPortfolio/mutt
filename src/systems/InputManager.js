// InputManager - Routes keyboard/gamepad input to up to 6 player slots

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

        return this.players;
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
    }
}
