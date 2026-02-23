// BezosBoss - Galaga boss

export class BezosBoss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bezos_boss');
        this.maxHP = 50;
        this.hp = this.maxHP;
        this.moveDir = 1;
        this.moveTimer = 0;
        this.attackTimer = 0;
        this.attackInterval = 800;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2);
        this.body.setAllowGravity(false);
    }

    damage() {
        this.hp--;
        return this.hp <= 0;
    }

    getHPPercent() {
        return this.hp / this.maxHP;
    }
}
