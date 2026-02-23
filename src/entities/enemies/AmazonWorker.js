// AmazonWorker - Galaga enemy

export class AmazonWorker extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'amazon_worker');
        this.hp = 1;
        this.shootTimer = Math.random() * 3000 + 1000;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);
        this.body.setAllowGravity(false);
    }

    damage() {
        this.hp--;
        return this.hp <= 0;
    }
}
