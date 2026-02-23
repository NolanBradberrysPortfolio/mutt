// Bullet - Carrot projectile

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'carrot');
        this.playerIndex = 0;
        this.speed = -500;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);
        this.body.setAllowGravity(false);
        this.setVelocityY(this.speed);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y < -20) this.destroy();
    }
}
