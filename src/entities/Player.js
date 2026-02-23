// Player - Base dog player class

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, characterIndex) {
        super(scene, x, y, 'dog_' + characterIndex);
        this.characterIndex = characterIndex;
        this.playerIndex = 0;
        this.alive = true;
        this.score = 0;
        this.lives = 3;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2);
        this.setBounce(0.1);
        this.setCollideWorldBounds(true);
    }

    damage() {
        this.lives--;
        if (this.lives <= 0) {
            this.alive = false;
            this.setAlpha(0.2);
            this.body.enable = false;
        }
        return this.lives;
    }

    addScore(points) {
        this.score += points;
        return this.score;
    }
}
