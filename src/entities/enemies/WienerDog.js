// WienerDog - Platformer enemy, turns into hot dog when stomped

export class WienerDog extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'wiener_dog');
        this.patrolLeft = x - 80;
        this.patrolRight = x + 80;
        this.speed = 60;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);
        this.setBounce(0);
        this.setVelocityX(this.speed);
    }

    patrol() {
        if (this.x < this.patrolLeft) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
        } else if (this.x > this.patrolRight) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
        }
    }
}
