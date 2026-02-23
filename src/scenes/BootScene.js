// BootScene - Generates all placeholder sprites and loads assets

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Show loading bar
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const bar = this.add.rectangle(w / 2, h / 2, 0, 24, 0xff6b9d);
        const outline = this.add.rectangle(w / 2, h / 2, 304, 28).setStrokeStyle(2, 0xffffff);
        const text = this.add.text(w / 2, h / 2 - 40, 'Loading MUTT...', {
            fontSize: '20px', fill: '#ffffff', fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.load.on('progress', (val) => {
            bar.width = 300 * val;
        });
    }

    create() {
        this.generatePlaceholderSprites();
        this.generateSFX();
        this.scene.start('MenuScene');
    }

    generatePlaceholderSprites() {
        const g = this.make.graphics({ add: false });

        // Daisy (player dog) - brown & white Yorkshire Terrier
        g.clear();
        // Body - steel blue/brown Yorkie coloring
        g.fillStyle(0x8B6C42); // dark golden brown body
        g.fillRect(6, 10, 22, 14);  // main body
        g.fillStyle(0xA0845C); // lighter brown highlights
        g.fillRect(8, 11, 18, 4);   // back highlight
        g.fillStyle(0xffffff); // white chest patch
        g.fillRect(10, 18, 10, 6);
        // Head - round Yorkie head
        g.fillStyle(0xB8944E); // tan/golden head
        g.fillRect(10, 2, 14, 12);
        g.fillStyle(0x8B6C42); // darker forehead
        g.fillRect(12, 2, 10, 5);
        // Pointy V-shaped ears
        g.fillStyle(0x8B6C42);
        g.fillRect(10, 0, 4, 5);    // left ear
        g.fillRect(20, 0, 4, 5);    // right ear
        g.fillStyle(0xC9A66B); // inner ear
        g.fillRect(11, 1, 2, 3);
        g.fillRect(21, 1, 2, 3);
        // Face details
        g.fillStyle(0x111111); // eyes
        g.fillRect(13, 6, 3, 3);    // left eye
        g.fillRect(19, 6, 3, 3);    // right eye
        g.fillStyle(0x222222); // shiny eye dot
        g.fillRect(14, 7, 1, 1);
        g.fillRect(20, 7, 1, 1);
        g.fillStyle(0x3d2b1f); // little nose
        g.fillRect(16, 10, 3, 2);
        g.fillStyle(0xffffff); // one tooth!
        g.fillRect(17, 12, 2, 2);
        // Silky fur tufts hanging down sides
        g.fillStyle(0xA0845C);
        g.fillRect(4, 14, 3, 8);    // left fur
        g.fillRect(27, 14, 3, 8);   // right fur
        // Legs
        g.fillStyle(0xB8944E); // tan legs
        g.fillRect(8, 24, 4, 6);    // front left
        g.fillRect(22, 24, 4, 6);   // front right
        g.fillStyle(0xffffff); // white paws
        g.fillRect(8, 28, 4, 2);
        g.fillRect(22, 28, 4, 2);
        // Perky tail (Yorkies have upward tails)
        g.fillStyle(0x8B6C42);
        g.fillRect(26, 8, 4, 3);
        g.fillRect(28, 5, 3, 5);
        g.fillStyle(0xA0845C);
        g.fillRect(29, 6, 2, 3);    // tail highlight
        g.generateTexture('daisy', 34, 32);

        // Dog characters (5 variations)
        // dog_0 = Daisy (Yorkie) - drawn separately below
        // dog_1-4 = other dogs
        const otherDogColors = [0x8B4513, 0xffffff, 0x333333, 0xD2691E];
        for (let i = 1; i < 5; i++) {
            g.clear();
            g.fillStyle(otherDogColors[i - 1]);
            g.fillRect(4, 8, 24, 16);
            g.fillRect(8, 4, 16, 8);
            g.fillStyle(i === 3 ? 0xcccccc : 0x333333);
            g.fillRect(12, 6, 3, 3);
            g.fillStyle(otherDogColors[i - 1]);
            g.fillRect(4, 24, 4, 6);
            g.fillRect(20, 24, 4, 6);
            g.fillRect(26, 10, 8, 4);
            g.generateTexture('dog_' + i, 36, 32);
        }

        // dog_0 = Daisy (Yorkshire Terrier - same as 'daisy' sprite)
        g.clear();
        g.fillStyle(0x8B6C42);
        g.fillRect(6, 10, 22, 14);
        g.fillStyle(0xA0845C);
        g.fillRect(8, 11, 18, 4);
        g.fillStyle(0xffffff);
        g.fillRect(10, 18, 10, 6);
        g.fillStyle(0xB8944E);
        g.fillRect(10, 2, 14, 12);
        g.fillStyle(0x8B6C42);
        g.fillRect(12, 2, 10, 5);
        g.fillStyle(0x8B6C42);
        g.fillRect(10, 0, 4, 5);
        g.fillRect(20, 0, 4, 5);
        g.fillStyle(0xC9A66B);
        g.fillRect(11, 1, 2, 3);
        g.fillRect(21, 1, 2, 3);
        g.fillStyle(0x111111);
        g.fillRect(13, 6, 3, 3);
        g.fillRect(19, 6, 3, 3);
        g.fillStyle(0x222222);
        g.fillRect(14, 7, 1, 1);
        g.fillRect(20, 7, 1, 1);
        g.fillStyle(0x3d2b1f);
        g.fillRect(16, 10, 3, 2);
        g.fillStyle(0xffffff);
        g.fillRect(17, 12, 2, 2);
        g.fillStyle(0xA0845C);
        g.fillRect(4, 14, 3, 8);
        g.fillRect(27, 14, 3, 8);
        g.fillStyle(0xB8944E);
        g.fillRect(8, 24, 4, 6);
        g.fillRect(22, 24, 4, 6);
        g.fillStyle(0xffffff);
        g.fillRect(8, 28, 4, 2);
        g.fillRect(22, 28, 4, 2);
        g.fillStyle(0x8B6C42);
        g.fillRect(26, 8, 4, 3);
        g.fillRect(28, 5, 3, 5);
        g.fillStyle(0xA0845C);
        g.fillRect(29, 6, 2, 3);
        g.generateTexture('dog_0', 34, 32);

        // Player ships (for Galaga) - each dog character as a ship
        // ship_0 = Daisy (Yorkie) standing heroically
        g.clear();
        // Small platform/hoverboard
        g.fillStyle(0x4488ff);
        g.fillRect(2, 28, 30, 4);
        g.fillStyle(0x66aaff);
        g.fillRect(4, 29, 26, 2);
        // Thruster glow
        g.fillStyle(0x44ddff, 0.6);
        g.fillRect(8, 32, 4, 3);
        g.fillRect(22, 32, 4, 3);
        // Daisy body
        g.fillStyle(0x8B6C42);
        g.fillRect(8, 14, 18, 14);
        g.fillStyle(0xA0845C);
        g.fillRect(10, 15, 14, 4);
        g.fillStyle(0xffffff); // white chest
        g.fillRect(12, 22, 10, 6);
        // Head
        g.fillStyle(0xB8944E);
        g.fillRect(10, 4, 14, 12);
        g.fillStyle(0x8B6C42);
        g.fillRect(12, 4, 10, 5);
        // Ears
        g.fillStyle(0x8B6C42);
        g.fillRect(10, 0, 4, 6);
        g.fillRect(20, 0, 4, 6);
        g.fillStyle(0xC9A66B);
        g.fillRect(11, 1, 2, 4);
        g.fillRect(21, 1, 2, 4);
        // Face
        g.fillStyle(0x111111);
        g.fillRect(13, 7, 3, 3);
        g.fillRect(19, 7, 3, 3);
        g.fillStyle(0x3d2b1f);
        g.fillRect(16, 11, 2, 2);
        g.fillStyle(0xffffff); // tooth
        g.fillRect(17, 13, 2, 2);
        // Paws
        g.fillStyle(0xB8944E);
        g.fillRect(8, 26, 4, 4);
        g.fillRect(22, 26, 4, 4);
        g.fillStyle(0xffffff);
        g.fillRect(8, 28, 4, 2);
        g.fillRect(22, 28, 4, 2);
        g.generateTexture('ship_0', 34, 36);

        // ship_1 = Cocoa (chocolate lab)
        g.clear();
        g.fillStyle(0x4488ff);
        g.fillRect(2, 28, 30, 4);
        g.fillStyle(0x66aaff);
        g.fillRect(4, 29, 26, 2);
        g.fillStyle(0x44ddff, 0.6);
        g.fillRect(8, 32, 4, 3);
        g.fillRect(22, 32, 4, 3);
        g.fillStyle(0x8B4513);
        g.fillRect(8, 14, 18, 14);
        g.fillRect(10, 4, 14, 12);
        // Floppy ears
        g.fillRect(6, 6, 6, 12);
        g.fillRect(22, 6, 6, 12);
        g.fillStyle(0x111111);
        g.fillRect(13, 8, 3, 3);
        g.fillRect(19, 8, 3, 3);
        g.fillStyle(0x5a2d0c);
        g.fillRect(16, 12, 3, 2);
        g.fillStyle(0x8B4513);
        g.fillRect(8, 26, 4, 4);
        g.fillRect(22, 26, 4, 4);
        g.generateTexture('ship_1', 34, 36);

        // ship_2 = Snowball (white fluffy)
        g.clear();
        g.fillStyle(0x4488ff);
        g.fillRect(2, 28, 30, 4);
        g.fillStyle(0x66aaff);
        g.fillRect(4, 29, 26, 2);
        g.fillStyle(0x44ddff, 0.6);
        g.fillRect(8, 32, 4, 3);
        g.fillRect(22, 32, 4, 3);
        g.fillStyle(0xffffff);
        g.fillRect(6, 12, 22, 16); // fluffy body
        g.fillRect(8, 2, 18, 14);  // fluffy head
        g.fillStyle(0xeeeeee);
        g.fillRect(10, 4, 4, 4);   // fluff tufts
        g.fillRect(20, 4, 4, 4);
        g.fillStyle(0x111111);
        g.fillRect(13, 8, 3, 3);
        g.fillRect(19, 8, 3, 3);
        g.fillStyle(0xff6699); // pink nose
        g.fillRect(16, 12, 2, 2);
        g.fillStyle(0xffffff);
        g.fillRect(8, 26, 4, 4);
        g.fillRect(22, 26, 4, 4);
        g.generateTexture('ship_2', 34, 36);

        // ship_3 = Shadow (black dog)
        g.clear();
        g.fillStyle(0x4488ff);
        g.fillRect(2, 28, 30, 4);
        g.fillStyle(0x66aaff);
        g.fillRect(4, 29, 26, 2);
        g.fillStyle(0x44ddff, 0.6);
        g.fillRect(8, 32, 4, 3);
        g.fillRect(22, 32, 4, 3);
        g.fillStyle(0x333333);
        g.fillRect(8, 14, 18, 14);
        g.fillRect(10, 4, 14, 12);
        // Pointy ears
        g.fillRect(10, 0, 4, 6);
        g.fillRect(20, 0, 4, 6);
        g.fillStyle(0xcccccc); // light eyes stand out
        g.fillRect(13, 8, 3, 3);
        g.fillRect(19, 8, 3, 3);
        g.fillStyle(0x8844aa); // purple glow (necromancer)
        g.fillRect(14, 9, 1, 1);
        g.fillRect(20, 9, 1, 1);
        g.fillStyle(0x222222);
        g.fillRect(16, 12, 2, 2);
        g.fillStyle(0x333333);
        g.fillRect(8, 26, 4, 4);
        g.fillRect(22, 26, 4, 4);
        g.generateTexture('ship_3', 34, 36);

        // ship_4 = Rusty (brown terrier)
        g.clear();
        g.fillStyle(0x4488ff);
        g.fillRect(2, 28, 30, 4);
        g.fillStyle(0x66aaff);
        g.fillRect(4, 29, 26, 2);
        g.fillStyle(0x44ddff, 0.6);
        g.fillRect(8, 32, 4, 3);
        g.fillRect(22, 32, 4, 3);
        g.fillStyle(0xD2691E);
        g.fillRect(8, 14, 18, 14);
        g.fillRect(10, 4, 14, 12);
        // Scruffy ears
        g.fillRect(8, 2, 6, 8);
        g.fillRect(20, 2, 6, 8);
        g.fillStyle(0xB8500E);
        g.fillRect(9, 3, 4, 5);
        g.fillRect(21, 3, 4, 5);
        g.fillStyle(0x111111);
        g.fillRect(13, 8, 3, 3);
        g.fillRect(19, 8, 3, 3);
        g.fillStyle(0xffee44); // golden glow (paladin)
        g.fillRect(14, 9, 1, 1);
        g.fillRect(20, 9, 1, 1);
        g.fillStyle(0x8B4000);
        g.fillRect(16, 12, 2, 2);
        // Scruffy beard/chin fur
        g.fillStyle(0xE0802E);
        g.fillRect(12, 14, 10, 4);
        g.fillStyle(0xD2691E);
        g.fillRect(8, 26, 4, 4);
        g.fillRect(22, 26, 4, 4);
        g.generateTexture('ship_4', 34, 36);

        // Legacy player_ship (fallback)
        g.clear();
        g.fillStyle(0x4488ff);
        g.fillRect(2, 28, 30, 4);
        g.fillStyle(0xd4a574);
        g.fillRect(8, 14, 18, 14);
        g.fillRect(10, 4, 14, 12);
        g.fillStyle(0x111111);
        g.fillRect(13, 8, 3, 3);
        g.fillRect(19, 8, 3, 3);
        g.generateTexture('player_ship', 34, 36);

        // Carrot bullet (legacy/default)
        g.clear();
        g.fillStyle(0xff6600);
        g.fillRect(2, 0, 4, 12);
        g.fillStyle(0x00cc00);
        g.fillRect(1, 0, 6, 3);
        g.generateTexture('carrot', 8, 12);

        // POOP projectile (Daisy - Pooper class)
        g.clear();
        g.fillStyle(0x6B4226); // dark brown
        g.fillRect(2, 4, 8, 8);      // main mass
        g.fillStyle(0x7B5233); // medium brown
        g.fillRect(3, 2, 6, 4);      // top swirl
        g.fillRect(4, 0, 4, 3);      // peak
        g.fillStyle(0x8B6243); // lighter brown highlights
        g.fillRect(4, 3, 2, 2);
        g.fillRect(7, 6, 2, 2);
        g.fillStyle(0x5a3520); // shadow
        g.fillRect(3, 10, 6, 2);
        g.generateTexture('proj_poop', 12, 12);

        // FIREBALL projectile (Cocoa - Pyromancer class)
        g.clear();
        g.fillStyle(0xff2200); // outer fire
        g.fillRect(1, 2, 10, 8);
        g.fillStyle(0xff6600); // mid fire
        g.fillRect(2, 3, 8, 6);
        g.fillStyle(0xffaa00); // inner fire
        g.fillRect(3, 4, 6, 4);
        g.fillStyle(0xffdd44); // core
        g.fillRect(4, 5, 4, 2);
        // flame tail
        g.fillStyle(0xff4400);
        g.fillRect(3, 10, 2, 3);
        g.fillRect(7, 10, 2, 3);
        g.fillStyle(0xff6600);
        g.fillRect(5, 10, 2, 2);
        g.generateTexture('proj_fireball', 12, 14);

        // SHURIKEN projectile (Snowball - Rogue class)
        g.clear();
        g.fillStyle(0xcccccc); // steel gray
        g.fillRect(4, 0, 4, 12);     // vertical blade
        g.fillRect(0, 4, 12, 4);     // horizontal blade
        g.fillStyle(0x999999); // darker edges
        g.fillRect(5, 1, 2, 2);
        g.fillRect(5, 9, 2, 2);
        g.fillRect(1, 5, 2, 2);
        g.fillRect(9, 5, 2, 2);
        g.fillStyle(0xeeeeee); // center
        g.fillRect(5, 5, 2, 2);
        g.fillStyle(0x666666); // points
        g.fillRect(0, 3, 2, 2);      // left point
        g.fillRect(10, 3, 2, 2);     // right point
        g.fillRect(3, 0, 2, 2);      // top point
        g.fillRect(7, 10, 2, 2);     // bottom point
        g.generateTexture('proj_shuriken', 12, 12);

        // SKULL projectile (Shadow - Necromancer class)
        g.clear();
        g.fillStyle(0xccbbdd); // pale purple-white bone
        g.fillRect(2, 0, 8, 8);      // cranium
        g.fillRect(1, 2, 10, 5);     // wider mid skull
        g.fillStyle(0x111111); // eye sockets
        g.fillRect(3, 3, 2, 2);
        g.fillRect(7, 3, 2, 2);
        g.fillStyle(0x8844aa); // purple glow in eyes
        g.fillRect(3, 3, 1, 1);
        g.fillRect(7, 3, 1, 1);
        g.fillStyle(0xbbaacc); // jaw
        g.fillRect(3, 8, 6, 3);
        g.fillStyle(0x111111); // teeth
        g.fillRect(4, 8, 1, 2);
        g.fillRect(6, 8, 1, 2);
        g.fillRect(8, 8, 1, 2);
        // ghostly trail
        g.fillStyle(0x8844aa, 0.5);
        g.fillRect(3, 11, 6, 2);
        g.generateTexture('proj_skull', 12, 14);

        // LIGHTNING BOLT projectile (Rusty - Paladin class)
        g.clear();
        g.fillStyle(0xffee44); // bright yellow
        g.fillRect(4, 0, 4, 3);      // top
        g.fillRect(2, 2, 4, 3);      // zig left
        g.fillRect(4, 4, 4, 3);      // zag right
        g.fillRect(2, 6, 4, 3);      // zig left
        g.fillRect(4, 8, 4, 4);      // bottom point
        g.fillStyle(0xffffff); // bright core
        g.fillRect(4, 1, 2, 2);
        g.fillRect(3, 3, 2, 2);
        g.fillRect(5, 5, 2, 2);
        g.fillRect(3, 7, 2, 2);
        g.fillRect(5, 9, 2, 2);
        // glow
        g.fillStyle(0xffff88, 0.4);
        g.fillRect(1, 1, 2, 10);
        g.fillRect(7, 1, 2, 10);
        g.generateTexture('proj_lightning', 10, 12);

        // Amazon worker enemy - blue uniform, cap, goofy face, holding box
        g.clear();
        // Blue Amazon uniform shirt
        g.fillStyle(0x232f3e);
        g.fillRect(4, 10, 20, 14);
        // Collar
        g.fillStyle(0x2d3a4e);
        g.fillRect(8, 10, 12, 3);
        // Amazon smile logo on chest
        g.fillStyle(0xff9900);
        g.fillRect(9, 16, 10, 2);
        g.fillRect(17, 14, 3, 3); // arrow tip of smile
        // Skin/face - goofy expression
        g.fillStyle(0xffcc99);
        g.fillRect(6, 0, 16, 12);
        // Derpy eyes (one bigger than other for slapstick)
        g.fillStyle(0xffffff);
        g.fillRect(8, 3, 5, 5);
        g.fillRect(16, 4, 4, 4);
        g.fillStyle(0x111111);
        g.fillRect(10, 4, 3, 3); // left pupil (looking sideways)
        g.fillRect(17, 5, 2, 2); // right pupil
        // Goofy grin
        g.fillStyle(0xcc5555);
        g.fillRect(10, 9, 8, 2);
        g.fillStyle(0xffffff); // buck teeth
        g.fillRect(12, 9, 2, 2);
        g.fillRect(15, 9, 2, 2);
        // Blue cap
        g.fillStyle(0x232f3e);
        g.fillRect(5, 0, 18, 4);
        g.fillRect(3, 3, 6, 2); // brim
        // Arms holding out
        g.fillStyle(0x232f3e);
        g.fillRect(0, 12, 5, 8);
        g.fillRect(23, 12, 5, 8);
        g.fillStyle(0xffcc99); // hands
        g.fillRect(0, 18, 4, 4);
        g.fillRect(24, 18, 4, 4);
        // Blue pants
        g.fillStyle(0x1a2836);
        g.fillRect(6, 24, 8, 8);
        g.fillRect(14, 24, 8, 8);
        // Shoes
        g.fillStyle(0x333333);
        g.fillRect(5, 30, 9, 3);
        g.fillRect(14, 30, 9, 3);
        g.generateTexture('amazon_worker', 28, 34);

        // Amazon drone enemy - package drone with spinning props and a dangling box
        g.clear();
        // Propeller arms
        g.fillStyle(0x444444);
        g.fillRect(0, 4, 28, 2);
        // Propeller blurs
        g.fillStyle(0x888888, 0.6);
        g.fillRect(0, 2, 6, 2);
        g.fillRect(22, 2, 6, 2);
        // Drone body
        g.fillStyle(0x555555);
        g.fillRect(8, 4, 12, 8);
        // Red blinking light
        g.fillStyle(0xff0000);
        g.fillRect(13, 5, 2, 2);
        // Camera eye (looks angry/determined)
        g.fillStyle(0x222222);
        g.fillRect(11, 8, 6, 3);
        g.fillStyle(0x00ccff); // glowing lens
        g.fillRect(12, 9, 4, 2);
        // Dangling wires to package
        g.fillStyle(0x666666);
        g.fillRect(10, 12, 1, 4);
        g.fillRect(17, 12, 1, 4);
        // Package underneath
        g.fillStyle(0xc4a265);
        g.fillRect(7, 16, 14, 10);
        g.lineStyle(1, 0x8b7355);
        g.strokeRect(7, 16, 14, 10);
        // Amazon smile on package
        g.fillStyle(0xff9900);
        g.fillRect(9, 20, 8, 1);
        g.fillRect(15, 19, 2, 2);
        g.generateTexture('amazon_drone', 28, 28);

        // Amazon van enemy - comically oversized van, driver visible through windshield
        g.clear();
        // Van body - dark blue
        g.fillStyle(0x232f3e);
        g.fillRect(0, 6, 36, 18);
        // Windshield
        g.fillStyle(0x88ccff);
        g.fillRect(28, 8, 8, 10);
        // Driver visible - tiny panicked face
        g.fillStyle(0xffcc99);
        g.fillRect(30, 10, 5, 5);
        g.fillStyle(0x111111);
        g.fillRect(31, 11, 1, 1);
        g.fillRect(33, 11, 1, 1);
        g.fillStyle(0xff0000); // screaming mouth
        g.fillRect(31, 14, 3, 1);
        // Amazon smile logo (big, on side)
        g.fillStyle(0xff9900);
        g.fillRect(4, 12, 18, 3);
        g.fillRect(20, 10, 3, 3); // arrow
        // Headlights
        g.fillStyle(0xffff88);
        g.fillRect(34, 20, 3, 3);
        // Bumper
        g.fillStyle(0x888888);
        g.fillRect(0, 24, 36, 2);
        // Wheels (comically small for big van)
        g.fillStyle(0x222222);
        g.fillCircle(8, 28, 4);
        g.fillCircle(28, 28, 4);
        g.fillStyle(0x555555); // hubcaps
        g.fillCircle(8, 28, 2);
        g.fillCircle(28, 28, 2);
        // Exhaust puff
        g.fillStyle(0xaaaaaa, 0.5);
        g.fillCircle(1, 22, 3);
        g.generateTexture('amazon_van', 38, 32);

        // Amazon robot enemy - Astro-style delivery robot with googly eyes
        g.clear();
        // Body - rounded silver
        g.fillStyle(0xbbbbbb);
        g.fillRect(6, 8, 16, 16);
        g.fillStyle(0xcccccc);
        g.fillRect(8, 6, 12, 4);
        // Head dome
        g.fillStyle(0xdddddd);
        g.fillRect(8, 0, 12, 8);
        g.fillStyle(0xeeeeee);
        g.fillRect(10, 1, 8, 5);
        // Googly eyes (one bigger, pointing different ways)
        g.fillStyle(0xffffff);
        g.fillCircle(12, 4, 3);
        g.fillCircle(19, 4, 3);
        g.fillStyle(0x111111);
        g.fillRect(11, 3, 2, 2); // looking left
        g.fillRect(20, 4, 2, 2); // looking right
        // Amazon smile on chest
        g.fillStyle(0xff9900);
        g.fillRect(9, 12, 10, 2);
        g.fillRect(17, 11, 2, 2);
        // Grabber arms
        g.fillStyle(0x999999);
        g.fillRect(2, 10, 5, 3);
        g.fillRect(21, 10, 5, 3);
        g.fillStyle(0x777777); // claws
        g.fillRect(1, 12, 3, 4);
        g.fillRect(22, 12, 3, 4);
        // Wheels/treads
        g.fillStyle(0x444444);
        g.fillRect(6, 24, 6, 4);
        g.fillRect(16, 24, 6, 4);
        g.fillStyle(0x555555);
        g.fillRect(7, 25, 4, 2);
        g.fillRect(17, 25, 4, 2);
        // Antenna
        g.fillStyle(0x888888);
        g.fillRect(14, 0, 1, 3);
        g.fillStyle(0xff0000);
        g.fillRect(13, 0, 3, 1);
        g.generateTexture('amazon_robot', 28, 28);

        // Amazon box (enemy projectile) - with Amazon smile logo
        g.clear();
        g.fillStyle(0xc4a265); // cardboard brown
        g.fillRect(0, 0, 16, 14);
        g.lineStyle(1, 0x8b7355);
        g.strokeRect(0, 0, 16, 14);
        // Tape on top
        g.fillStyle(0xc4955a);
        g.fillRect(6, 0, 4, 3);
        // Amazon smile logo
        g.fillStyle(0xff9900);
        g.fillRect(3, 7, 10, 2); // smile curve
        g.fillRect(11, 5, 2, 3); // arrow tip
        // "a" to "z" text suggestion
        g.fillStyle(0x232f3e);
        g.fillRect(3, 5, 2, 2); // "a"
        g.fillRect(12, 5, 2, 2); // "z"
        g.generateTexture('amazon_box', 16, 14);

        // BEZOS BOSS - bald head, demon horns, snake tongue, on Amazon truck
        g.clear();
        // TRUCK BODY
        g.fillStyle(0x232f3e); // dark Amazon blue
        g.fillRect(0, 34, 90, 30);
        // Truck cab
        g.fillStyle(0x2d3a4e);
        g.fillRect(65, 28, 25, 36);
        // Windshield
        g.fillStyle(0x88ccff);
        g.fillRect(70, 30, 18, 14);
        // Big Amazon smile on truck side
        g.fillStyle(0xff9900);
        g.fillRect(8, 44, 50, 4);
        g.fillRect(52, 40, 8, 6); // arrow
        // "PRIME" text area
        g.fillStyle(0x00a8e1);
        g.fillRect(15, 36, 30, 6);
        // Headlights (evil red)
        g.fillStyle(0xff2222);
        g.fillRect(86, 48, 4, 6);
        // Bumper
        g.fillStyle(0x666666);
        g.fillRect(0, 64, 90, 3);
        // Wheels
        g.fillStyle(0x222222);
        g.fillCircle(18, 68, 6);
        g.fillCircle(40, 68, 6);
        g.fillCircle(75, 68, 6);
        g.fillStyle(0x555555);
        g.fillCircle(18, 68, 3);
        g.fillCircle(40, 68, 3);
        g.fillCircle(75, 68, 3);

        // BEZOS HEAD (poking out of truck top, oversized for comedy)
        // Bald head
        g.fillStyle(0xffcc99);
        g.fillCircle(45, 16, 18);
        // Bald shine
        g.fillStyle(0xffddbb);
        g.fillRect(38, 2, 8, 6);
        // RED DEMON HORNS
        g.fillStyle(0xcc0000);
        // Left horn
        g.fillRect(30, 6, 4, 4);
        g.fillRect(28, 2, 4, 6);
        g.fillRect(26, 0, 4, 4);
        g.fillStyle(0xff2222);
        g.fillRect(29, 3, 2, 4);
        // Right horn
        g.fillStyle(0xcc0000);
        g.fillRect(56, 6, 4, 4);
        g.fillRect(58, 2, 4, 6);
        g.fillRect(60, 0, 4, 4);
        g.fillStyle(0xff2222);
        g.fillRect(59, 3, 2, 4);
        // Eyes - sinister, narrow
        g.fillStyle(0xffffff);
        g.fillRect(36, 12, 7, 5);
        g.fillRect(49, 12, 7, 5);
        g.fillStyle(0x111111); // dark pupils
        g.fillRect(39, 13, 3, 3);
        g.fillRect(52, 13, 3, 3);
        g.fillStyle(0xff0000); // red glint
        g.fillRect(40, 13, 1, 1);
        g.fillRect(53, 13, 1, 1);
        // Evil eyebrows
        g.fillStyle(0x333333);
        g.fillRect(35, 10, 8, 2);
        g.fillRect(49, 10, 8, 2);
        // Nose
        g.fillStyle(0xeebb99);
        g.fillRect(43, 18, 4, 3);
        // Evil grin
        g.fillStyle(0xcc2222);
        g.fillRect(38, 24, 14, 3);
        g.fillStyle(0xffffff); // teeth
        g.fillRect(39, 24, 2, 2);
        g.fillRect(42, 24, 2, 2);
        g.fillRect(46, 24, 2, 2);
        g.fillRect(49, 24, 2, 2);
        // SNAKE TONGUE forking out
        g.fillStyle(0xff3355);
        g.fillRect(44, 27, 2, 6);  // tongue base
        g.fillRect(42, 32, 2, 3);  // left fork
        g.fillRect(46, 32, 2, 3);  // right fork
        g.fillStyle(0xff5577);
        g.fillRect(44, 28, 2, 3);  // tongue highlight
        // Ears
        g.fillStyle(0xffbb99);
        g.fillRect(26, 14, 4, 6);
        g.fillRect(62, 14, 4, 6);

        g.generateTexture('bezos_boss', 92, 76);

        // Wiener dog enemy - comically long dachshund, tongue out, stubby legs
        g.clear();
        // Looooong body
        g.fillStyle(0x8B4513); // brown
        g.fillRect(0, 8, 40, 12);
        g.fillStyle(0xA0522D); // lighter belly
        g.fillRect(2, 16, 36, 4);
        // Head - big compared to body (slapstick proportions)
        g.fillStyle(0x8B4513);
        g.fillRect(34, 2, 14, 16);
        g.fillStyle(0xA0522D); // snout
        g.fillRect(44, 8, 8, 6);
        // Big goofy eyes
        g.fillStyle(0xffffff);
        g.fillRect(36, 4, 5, 5);
        g.fillRect(42, 4, 5, 5);
        g.fillStyle(0x111111);
        g.fillRect(38, 5, 3, 3);
        g.fillRect(44, 5, 3, 3);
        // Nose
        g.fillStyle(0x222222);
        g.fillRect(48, 9, 3, 3);
        // Tongue hanging out (slapstick!)
        g.fillStyle(0xff6688);
        g.fillRect(46, 14, 4, 6);
        g.fillRect(47, 18, 3, 3);
        // Floppy ears
        g.fillStyle(0x6B3410);
        g.fillRect(34, 0, 5, 6);
        g.fillRect(46, 0, 5, 6);
        // Comically tiny stubby legs
        g.fillStyle(0x7B4413);
        g.fillRect(4, 20, 4, 5);
        g.fillRect(12, 20, 4, 5);
        g.fillRect(30, 20, 4, 5);
        g.fillRect(38, 20, 4, 5);
        // Tiny paws
        g.fillStyle(0x6B3410);
        g.fillRect(3, 23, 6, 2);
        g.fillRect(11, 23, 6, 2);
        g.fillRect(29, 23, 6, 2);
        g.fillRect(37, 23, 6, 2);
        // Wagging tail
        g.fillStyle(0x8B4513);
        g.fillRect(0, 6, 4, 3);
        g.fillRect(0, 4, 2, 4);
        g.generateTexture('wiener_dog', 52, 26);

        // Hot dog (stomped wiener dog) - full hot dog with bun, ketchup, mustard, relish
        g.clear();
        // Bottom bun
        g.fillStyle(0xdaa520);
        g.fillRect(0, 8, 36, 8);
        g.fillStyle(0xc49418);
        g.fillRect(2, 14, 32, 3); // bottom shadow
        // Frank/sausage
        g.fillStyle(0xcc5544);
        g.fillRect(2, 4, 32, 10);
        g.fillStyle(0xdd6655); // highlight
        g.fillRect(4, 5, 28, 3);
        // Top bun
        g.fillStyle(0xdaa520);
        g.fillRect(0, 2, 36, 6);
        g.fillStyle(0xe8b838); // sesame seed highlights
        g.fillRect(8, 3, 2, 2);
        g.fillRect(16, 2, 2, 2);
        g.fillRect(24, 3, 2, 2);
        // Ketchup zigzag
        g.fillStyle(0xff2222);
        g.fillRect(4, 6, 3, 2);
        g.fillRect(8, 7, 3, 2);
        g.fillRect(12, 6, 3, 2);
        g.fillRect(16, 7, 3, 2);
        g.fillRect(20, 6, 3, 2);
        g.fillRect(24, 7, 3, 2);
        g.fillRect(28, 6, 3, 2);
        // Mustard zigzag
        g.fillStyle(0xffdd00);
        g.fillRect(6, 8, 3, 2);
        g.fillRect(10, 9, 3, 2);
        g.fillRect(14, 8, 3, 2);
        g.fillRect(18, 9, 3, 2);
        g.fillRect(22, 8, 3, 2);
        g.fillRect(26, 9, 3, 2);
        // Dizzy eyes on the frank (it's still alive!)
        g.fillStyle(0xffffff);
        g.fillRect(12, 10, 3, 3);
        g.fillRect(22, 10, 3, 3);
        g.fillStyle(0x111111); // X eyes (knocked out)
        g.fillRect(12, 10, 1, 1);
        g.fillRect(14, 12, 1, 1);
        g.fillRect(13, 11, 1, 1);
        g.fillRect(22, 10, 1, 1);
        g.fillRect(24, 12, 1, 1);
        g.fillRect(23, 11, 1, 1);
        g.generateTexture('hot_dog', 36, 18);

        // Chili pepper power-up
        g.clear();
        g.fillStyle(0xff0000);
        g.fillRect(4, 2, 8, 16);
        g.fillStyle(0x00aa00);
        g.fillRect(6, 0, 4, 4);
        g.generateTexture('chili_pepper', 16, 18);

        // Greenie power-up
        g.clear();
        g.fillStyle(0x00cc44);
        g.fillRect(2, 0, 8, 20);
        g.fillStyle(0x009933);
        g.fillRect(4, 2, 4, 16);
        g.generateTexture('greenie', 12, 20);

        // Fire breath projectile
        g.clear();
        g.fillStyle(0xff4400);
        g.fillRect(0, 2, 12, 6);
        g.fillStyle(0xffaa00);
        g.fillRect(2, 4, 8, 2);
        g.generateTexture('fire_breath', 12, 10);

        // Parrot with Daisy riding on its back
        g.clear();

        // === GREEN CHEEK PARROT (bottom half) ===
        // Parrot body - green cheek conure coloring
        g.fillStyle(0x2eaa45); // green body
        g.fillRect(10, 26, 22, 18);
        // Darker green back
        g.fillStyle(0x228833);
        g.fillRect(12, 26, 18, 6);
        // Parrot head
        g.fillStyle(0x2eaa45); // green crown
        g.fillRect(24, 18, 14, 12);
        g.fillStyle(0x444444); // dark gray/black cap (green cheek trait)
        g.fillRect(26, 16, 10, 6);
        // Green cheek patches (the signature feature!)
        g.fillStyle(0x33bb55); // bright green cheeks
        g.fillRect(34, 22, 5, 6);
        // Parrot eye
        g.fillStyle(0x111111);
        g.fillRect(32, 21, 4, 4);
        g.fillStyle(0xffffff); // eye ring (green cheeks have white eye rings)
        g.fillRect(31, 21, 1, 4);
        g.fillRect(36, 21, 1, 4);
        g.fillRect(32, 20, 4, 1);
        g.fillRect(32, 25, 4, 1);
        g.fillStyle(0x222222); // pupil
        g.fillRect(33, 22, 2, 2);
        // Beak - dark with lighter tip
        g.fillStyle(0x333333);
        g.fillRect(38, 22, 6, 4);
        g.fillStyle(0x555555);
        g.fillRect(42, 23, 2, 2);
        // Red belly (green cheek conure trait)
        g.fillStyle(0xcc3333);
        g.fillRect(12, 36, 18, 8);
        g.fillStyle(0xdd4444); // lighter red highlight
        g.fillRect(14, 37, 14, 4);
        // Wing
        g.fillStyle(0x228833); // dark green wing
        g.fillRect(6, 28, 8, 14);
        g.fillStyle(0x1a6628); // wing edge
        g.fillRect(4, 30, 4, 10);
        // Blue flight feathers on wing tip (green cheek trait)
        g.fillStyle(0x3366cc);
        g.fillRect(4, 36, 6, 4);
        // Tail feathers - maroon/red (green cheek trait)
        g.fillStyle(0x882222);
        g.fillRect(10, 44, 6, 8);
        g.fillRect(16, 44, 6, 6);
        g.fillStyle(0xaa3333);
        g.fillRect(12, 44, 4, 6);
        // Parrot feet gripping
        g.fillStyle(0x666666);
        g.fillRect(16, 43, 3, 3);
        g.fillRect(24, 43, 3, 3);

        // === DAISY (Yorkshire Terrier riding on top) ===
        // Daisy's body sitting on parrot's back
        g.fillStyle(0x8B6C42); // dark golden brown body
        g.fillRect(12, 14, 16, 12);
        g.fillStyle(0xA0845C); // lighter brown highlight
        g.fillRect(14, 15, 12, 4);
        // White chest visible from front
        g.fillStyle(0xffffff);
        g.fillRect(16, 20, 8, 6);
        // Daisy's head
        g.fillStyle(0xB8944E); // tan/golden face
        g.fillRect(14, 4, 12, 12);
        g.fillStyle(0x8B6C42); // darker forehead
        g.fillRect(16, 4, 8, 4);
        // Pointy Yorkie ears
        g.fillStyle(0x8B6C42);
        g.fillRect(13, 0, 4, 6);   // left ear
        g.fillRect(23, 0, 4, 6);   // right ear
        g.fillStyle(0xC9A66B); // inner ear
        g.fillRect(14, 1, 2, 4);
        g.fillRect(24, 1, 2, 4);
        // Face
        g.fillStyle(0x111111); // eyes
        g.fillRect(16, 7, 3, 3);
        g.fillRect(21, 7, 3, 3);
        g.fillStyle(0xffffff); // eye shine
        g.fillRect(17, 7, 1, 1);
        g.fillRect(22, 7, 1, 1);
        g.fillStyle(0x3d2b1f); // nose
        g.fillRect(19, 11, 2, 2);
        g.fillStyle(0xffffff); // one tooth!
        g.fillRect(19, 13, 2, 2);
        // Silky fur blowing in the wind
        g.fillStyle(0xA0845C);
        g.fillRect(9, 10, 4, 8);   // left fur flowing back
        g.fillRect(7, 12, 3, 6);   // extra wind-blown fur
        // Daisy's little paws gripping parrot's back
        g.fillStyle(0xB8944E);
        g.fillRect(12, 24, 4, 4);  // left paw
        g.fillRect(24, 24, 4, 4);  // right paw
        g.fillStyle(0xffffff); // white paw tips
        g.fillRect(12, 26, 4, 2);
        g.fillRect(24, 26, 4, 2);

        g.generateTexture('parrot', 46, 52);

        // Hoop (for flappy bird)
        g.clear();
        g.lineStyle(4, 0xffcc00);
        g.strokeCircle(16, 16, 14);
        g.generateTexture('hoop', 32, 32);

        // Platform tile
        g.clear();
        g.fillStyle(0x44aa44);
        g.fillRect(0, 0, 32, 32);
        g.lineStyle(1, 0x338833);
        g.strokeRect(0, 0, 32, 32);
        g.fillStyle(0x55bb55);
        g.fillRect(2, 2, 12, 12);
        g.fillRect(18, 18, 12, 12);
        g.generateTexture('platform_tile', 32, 32);

        // Ground tile
        g.clear();
        g.fillStyle(0x8B6914);
        g.fillRect(0, 0, 32, 32);
        g.fillStyle(0x44aa44);
        g.fillRect(0, 0, 32, 8);
        g.generateTexture('ground_tile', 32, 32);

        // Pipe sections for flappy
        g.clear();
        g.fillStyle(0x44aa44);
        g.fillRect(0, 0, 48, 32);
        g.fillStyle(0x338833);
        g.fillRect(2, 2, 44, 28);
        g.generateTexture('pipe', 48, 32);

        // Heart
        g.clear();
        g.fillStyle(0xff4466);
        g.fillRect(2, 4, 4, 4);
        g.fillRect(8, 4, 4, 4);
        g.fillRect(0, 6, 14, 4);
        g.fillRect(2, 10, 10, 2);
        g.fillRect(4, 12, 6, 2);
        g.fillRect(6, 14, 2, 2);
        g.generateTexture('heart', 14, 16);

        // Shelter kennel
        g.clear();
        g.fillStyle(0x666666);
        g.fillRect(0, 0, 48, 48);
        g.fillStyle(0x444444);
        g.fillRect(4, 4, 40, 40);
        g.fillStyle(0x888888);
        // bars
        for (let x = 8; x < 44; x += 8) {
            g.fillRect(x, 0, 2, 20);
        }
        g.generateTexture('kennel', 48, 48);

        // Dialog box background
        g.clear();
        g.fillStyle(0x000000, 0.85);
        g.fillRect(0, 0, 700, 140);
        g.lineStyle(3, 0xffffff);
        g.strokeRect(2, 2, 696, 136);
        g.generateTexture('dialog_box', 700, 140);

        // Portrait frame
        g.clear();
        g.fillStyle(0x222244);
        g.fillRect(0, 0, 100, 100);
        g.lineStyle(2, 0xaaaaff);
        g.strokeRect(1, 1, 98, 98);
        g.generateTexture('portrait_frame', 100, 100);

        // Daisy portrait (larger Yorkshire Terrier for cinematics)
        g.clear();
        // Head shape
        g.fillStyle(0xB8944E); // tan/golden face
        g.fillRect(18, 18, 54, 52);
        g.fillStyle(0x8B6C42); // darker brown forehead/top
        g.fillRect(22, 12, 46, 16);
        // Pointy V ears
        g.fillStyle(0x8B6C42);
        g.fillRect(16, 4, 14, 18);  // left ear
        g.fillRect(60, 4, 14, 18);  // right ear
        g.fillStyle(0xC9A66B); // inner ear pink/tan
        g.fillRect(19, 7, 8, 12);
        g.fillRect(63, 7, 8, 12);
        // Silky fur hanging from face
        g.fillStyle(0xA0845C);
        g.fillRect(12, 30, 8, 30);  // left fur
        g.fillRect(70, 30, 8, 30);  // right fur
        g.fillRect(28, 60, 34, 10); // chin fur
        // White chest/bib
        g.fillStyle(0xffffff);
        g.fillRect(32, 62, 26, 12);
        // Eyes - big round Yorkie eyes
        g.fillStyle(0x111111);
        g.fillRect(28, 28, 10, 10);
        g.fillRect(52, 28, 10, 10);
        g.fillStyle(0x332211); // dark brown iris
        g.fillRect(30, 30, 6, 6);
        g.fillRect(54, 30, 6, 6);
        g.fillStyle(0xffffff); // eye shine
        g.fillRect(31, 30, 2, 2);
        g.fillRect(55, 30, 2, 2);
        // Nose
        g.fillStyle(0x2a1f14);
        g.fillRect(40, 42, 10, 6);
        // Mouth line
        g.fillStyle(0x4a3520);
        g.fillRect(42, 48, 6, 2);
        // One tooth! (signature Daisy feature)
        g.fillStyle(0xffffff);
        g.fillRect(46, 50, 4, 5);
        // Blush
        g.fillStyle(0xff6699, 0.4);
        g.fillRect(22, 40, 8, 5);
        g.fillRect(60, 40, 8, 5);
        g.generateTexture('daisy_portrait', 90, 80);

        // Shelter man portrait - sweet Santa Claus type, big white beard, kind eyes
        g.clear();
        // Round rosy face
        g.fillStyle(0xffcc99);
        g.fillRect(22, 12, 46, 40);
        // Big fluffy white beard
        g.fillStyle(0xeeeeee);
        g.fillRect(18, 40, 54, 30);
        g.fillRect(22, 38, 46, 6);
        g.fillStyle(0xffffff);
        g.fillRect(20, 44, 50, 20);
        g.fillRect(25, 62, 40, 8);
        // Rosy round cheeks
        g.fillStyle(0xffaaaa);
        g.fillRect(24, 34, 10, 8);
        g.fillRect(56, 34, 10, 8);
        // Kind squinty eyes (smiling eyes)
        g.fillStyle(0x4477aa);
        g.fillRect(30, 24, 8, 6);
        g.fillRect(52, 24, 8, 6);
        g.fillStyle(0x111111);
        g.fillRect(32, 25, 4, 4);
        g.fillRect(54, 25, 4, 4);
        // Smile wrinkles under eyes
        g.fillStyle(0xeebb99);
        g.fillRect(30, 30, 8, 2);
        g.fillRect(52, 30, 8, 2);
        // Round red nose
        g.fillStyle(0xee8888);
        g.fillRect(40, 30, 10, 8);
        g.fillStyle(0xff9999);
        g.fillRect(42, 31, 6, 5);
        // White bushy eyebrows
        g.fillStyle(0xeeeeee);
        g.fillRect(28, 20, 12, 4);
        g.fillRect(50, 20, 12, 4);
        // White hair on sides
        g.fillStyle(0xffffff);
        g.fillRect(14, 14, 10, 28);
        g.fillRect(66, 14, 10, 28);
        // Bald-ish top with thin white hair
        g.fillStyle(0xeeddcc);
        g.fillRect(26, 6, 38, 10);
        g.fillStyle(0xeeeeee);
        g.fillRect(20, 8, 10, 8);
        g.fillRect(60, 8, 10, 8);
        // Warm smile visible above beard
        g.fillStyle(0xdd7777);
        g.fillRect(36, 38, 18, 4);
        g.generateTexture('shelterman_portrait', 90, 74);

        // Dog catcher portrait - gruff but not mean
        g.clear();
        g.fillStyle(0xffcc99);
        g.fillRect(25, 15, 40, 40);
        // Cap
        g.fillStyle(0x336633);
        g.fillRect(20, 5, 50, 14);
        g.fillRect(15, 15, 60, 5);
        // Sunglasses
        g.fillStyle(0x222222);
        g.fillRect(28, 22, 12, 10);
        g.fillRect(50, 22, 12, 10);
        g.fillRect(40, 24, 10, 3);
        // Stubble
        g.fillStyle(0xccbb99);
        g.fillRect(28, 40, 34, 10);
        // Mouth
        g.fillStyle(0xcc8877);
        g.fillRect(36, 42, 18, 4);
        // Collar
        g.fillStyle(0x336633);
        g.fillRect(22, 52, 46, 14);
        g.fillStyle(0xcccccc); // badge
        g.fillRect(50, 55, 10, 8);
        g.generateTexture('dogcatcher_portrait', 90, 70);

        // Daisy RABID portrait - comically angry/rabid, red eyes, foam, teeth bared
        g.clear();
        // Head
        g.fillStyle(0xB8944E);
        g.fillRect(18, 18, 54, 42);
        g.fillStyle(0x8B6C42);
        g.fillRect(22, 12, 46, 16);
        // Ears flat back (angry)
        g.fillStyle(0x8B6C42);
        g.fillRect(10, 16, 16, 8);
        g.fillRect(64, 16, 16, 8);
        // CRAZY RED EYES
        g.fillStyle(0xff0000);
        g.fillRect(26, 26, 14, 12);
        g.fillRect(50, 26, 14, 12);
        g.fillStyle(0xffff00); // yellow iris
        g.fillRect(30, 28, 6, 8);
        g.fillRect(54, 28, 6, 8);
        g.fillStyle(0x111111); // tiny angry pupils
        g.fillRect(32, 30, 3, 4);
        g.fillRect(56, 30, 3, 4);
        // Angry eyebrow lines
        g.fillStyle(0x5a3520);
        g.fillRect(24, 22, 16, 4);
        g.fillRect(50, 22, 16, 4);
        // Nose scrunched up
        g.fillStyle(0x3d2b1f);
        g.fillRect(38, 38, 14, 6);
        // MASSIVE SNARL - mouth wide open showing THE one tooth
        g.fillStyle(0xcc2222); // open mouth
        g.fillRect(24, 46, 42, 18);
        g.fillStyle(0xdd3333);
        g.fillRect(28, 48, 34, 12);
        // Gums
        g.fillStyle(0xff8888);
        g.fillRect(26, 46, 38, 4);
        // THE ONE TOOTH (comically large)
        g.fillStyle(0xffffff);
        g.fillRect(42, 46, 8, 12);
        // Foam/drool
        g.fillStyle(0xffffff, 0.8);
        g.fillRect(28, 62, 6, 6);
        g.fillRect(56, 60, 6, 8);
        g.fillRect(40, 64, 10, 6);
        g.fillRect(22, 58, 4, 8);
        g.fillRect(64, 56, 4, 10);
        // Fur standing on end
        g.fillStyle(0x8B6C42);
        g.fillRect(18, 8, 4, 10);
        g.fillRect(68, 8, 4, 10);
        g.fillRect(30, 6, 4, 8);
        g.fillRect(56, 6, 4, 8);
        g.generateTexture('daisy_rabid_portrait', 90, 74);

        // Daisy sleeping portrait - cute with ZZZs
        g.clear();
        g.fillStyle(0xB8944E);
        g.fillRect(18, 30, 54, 35);
        g.fillStyle(0x8B6C42);
        g.fillRect(22, 22, 46, 16);
        // Ears down (relaxed)
        g.fillStyle(0x8B6C42);
        g.fillRect(12, 28, 12, 10);
        g.fillRect(66, 28, 12, 10);
        // Closed happy eyes (^_^)
        g.fillStyle(0x333333);
        g.fillRect(28, 34, 10, 2);
        g.fillRect(52, 34, 10, 2);
        g.fillRect(28, 32, 2, 4);
        g.fillRect(36, 32, 2, 4);
        g.fillRect(52, 32, 2, 4);
        g.fillRect(60, 32, 2, 4);
        // Nose
        g.fillStyle(0x3d2b1f);
        g.fillRect(40, 40, 10, 5);
        // Tiny smile
        g.fillStyle(0xaa7755);
        g.fillRect(38, 48, 14, 3);
        // White chest
        g.fillStyle(0xffffff);
        g.fillRect(30, 55, 30, 12);
        // Blush
        g.fillStyle(0xff9999, 0.4);
        g.fillRect(22, 40, 10, 6);
        g.fillRect(58, 40, 10, 6);
        // ZZZ
        g.fillStyle(0xaaccff);
        g.fillRect(68, 10, 12, 8);
        g.fillRect(72, 2, 10, 7);
        g.fillRect(76, 0, 6, 4);
        g.generateTexture('daisy_sleep_portrait', 90, 70);

        // Amazon delivery guy portrait (regular grunt)
        g.clear();
        // Blue uniform
        g.fillStyle(0x232f3e);
        g.fillRect(20, 40, 50, 26);
        // Face - dopey looking
        g.fillStyle(0xffcc99);
        g.fillRect(25, 12, 40, 32);
        // Blue cap
        g.fillStyle(0x232f3e);
        g.fillRect(22, 4, 46, 14);
        g.fillRect(18, 14, 54, 4);
        // Amazon logo on cap
        g.fillStyle(0xff9900);
        g.fillRect(36, 7, 18, 3);
        g.fillRect(50, 6, 4, 3);
        // Confused eyes
        g.fillStyle(0xffffff);
        g.fillRect(30, 20, 10, 10);
        g.fillRect(50, 20, 10, 10);
        g.fillStyle(0x111111);
        g.fillRect(34, 23, 4, 5);
        g.fillRect(54, 22, 4, 5);
        // Open mouth (surprised)
        g.fillStyle(0xcc6655);
        g.fillRect(38, 36, 14, 8);
        g.fillStyle(0x333333);
        g.fillRect(40, 37, 10, 5);
        // Amazon smile on uniform
        g.fillStyle(0xff9900);
        g.fillRect(30, 48, 30, 3);
        g.fillRect(56, 46, 4, 4);
        g.generateTexture('amazon_guy_portrait', 90, 70);

        // Amazon guy KO portrait (XX eyes)
        g.clear();
        g.fillStyle(0x232f3e);
        g.fillRect(20, 40, 50, 26);
        g.fillStyle(0xffcc99);
        g.fillRect(25, 12, 40, 32);
        g.fillStyle(0x232f3e);
        g.fillRect(22, 4, 46, 14);
        g.fillRect(18, 14, 54, 4);
        // XX eyes
        g.fillStyle(0x111111);
        g.fillRect(30, 20, 3, 3);
        g.fillRect(37, 27, 3, 3);
        g.fillRect(37, 20, 3, 3);
        g.fillRect(30, 27, 3, 3);
        g.fillRect(50, 20, 3, 3);
        g.fillRect(57, 27, 3, 3);
        g.fillRect(57, 20, 3, 3);
        g.fillRect(50, 27, 3, 3);
        // Dizzy tongue out
        g.fillStyle(0xff6688);
        g.fillRect(42, 38, 8, 10);
        // Stars around head
        g.fillStyle(0xffff00);
        g.fillRect(18, 8, 4, 4);
        g.fillRect(68, 12, 4, 4);
        g.fillRect(42, 2, 4, 4);
        g.generateTexture('amazon_ko_portrait', 90, 70);

        // Daisy on podium portrait (communist speech scene)
        g.clear();
        // Red background
        g.fillStyle(0xcc0000);
        g.fillRect(0, 0, 90, 74);
        // Podium
        g.fillStyle(0x8B6C42);
        g.fillRect(20, 45, 50, 28);
        g.fillStyle(0x6B4C32);
        g.fillRect(22, 47, 46, 24);
        // Microphone
        g.fillStyle(0x333333);
        g.fillRect(58, 30, 3, 18);
        g.fillStyle(0x555555);
        g.fillCircle(59, 28, 5);
        // Daisy head
        g.fillStyle(0xB8944E);
        g.fillRect(30, 18, 30, 26);
        g.fillStyle(0x8B6C42);
        g.fillRect(34, 14, 22, 10);
        // Ears up (determined)
        g.fillStyle(0x8B6C42);
        g.fillRect(32, 8, 6, 10);
        g.fillRect(52, 8, 6, 10);
        // Determined eyes
        g.fillStyle(0x111111);
        g.fillRect(36, 26, 6, 5);
        g.fillRect(48, 26, 6, 5);
        // Open mouth (giving speech)
        g.fillStyle(0xcc7766);
        g.fillRect(40, 36, 12, 6);
        // White chest
        g.fillStyle(0xffffff);
        g.fillRect(36, 42, 18, 6);
        // Raised paw/fist
        g.fillStyle(0xB8944E);
        g.fillRect(62, 34, 8, 8);
        g.generateTexture('daisy_podium_portrait', 90, 74);

        // Girl (mommy) portrait
        g.clear();
        g.fillStyle(0xffcc99);
        g.fillRect(25, 15, 40, 45);
        g.fillStyle(0x663300); // brown hair
        g.fillRect(15, 5, 60, 20);
        g.fillRect(15, 20, 12, 40);
        g.fillRect(63, 20, 12, 40);
        g.fillStyle(0x4488ff); // blue eyes
        g.fillRect(32, 28, 7, 7);
        g.fillRect(51, 28, 7, 7);
        g.fillStyle(0xff6699); // smile
        g.fillRect(38, 42, 14, 4);
        g.generateTexture('mommy_portrait', 90, 70);

        // Star particle
        g.clear();
        g.fillStyle(0xffff00);
        g.fillRect(1, 0, 2, 4);
        g.fillRect(0, 1, 4, 2);
        g.generateTexture('star_particle', 4, 4);

        // Explosion particle
        g.clear();
        g.fillStyle(0xff6600);
        g.fillRect(0, 0, 6, 6);
        g.generateTexture('explosion_particle', 6, 6);

        // === PERK PARTICLE SPRITES ===

        // Blood splatter chunks (multiple sizes)
        g.clear();
        g.fillStyle(0xcc0000);
        g.fillRect(0, 0, 8, 8);
        g.fillStyle(0xff0000);
        g.fillRect(1, 1, 4, 4);
        g.fillStyle(0x880000);
        g.fillRect(5, 5, 3, 3);
        g.generateTexture('perk_blood_chunk', 8, 8);

        g.clear();
        g.fillStyle(0xdd1111);
        g.fillRect(0, 0, 12, 4);
        g.fillStyle(0xaa0000);
        g.fillRect(2, 1, 8, 2);
        g.generateTexture('perk_blood_splat', 12, 4);

        g.clear();
        g.fillStyle(0xff0000);
        g.fillCircle(5, 5, 5);
        g.fillStyle(0xcc0000);
        g.fillCircle(5, 5, 3);
        g.fillStyle(0xff3333);
        g.fillRect(3, 3, 2, 2);
        g.generateTexture('perk_blood_drop', 10, 10);

        // Bone fragment
        g.clear();
        g.fillStyle(0xeeeecc);
        g.fillRect(0, 2, 10, 4);
        g.fillCircle(1, 4, 2);
        g.fillCircle(9, 4, 2);
        g.generateTexture('perk_bone', 10, 8);

        // Pizza slice
        g.clear();
        // Crust (top arc)
        g.fillStyle(0xdaa520);
        g.fillRect(0, 0, 16, 4);
        g.fillStyle(0xc49418);
        g.fillRect(1, 1, 14, 2);
        // Cheese triangle
        g.fillStyle(0xffdd44);
        g.fillRect(1, 4, 14, 4);
        g.fillRect(2, 8, 12, 3);
        g.fillRect(4, 11, 8, 3);
        g.fillRect(6, 14, 4, 2);
        // Pepperoni
        g.fillStyle(0xcc2222);
        g.fillCircle(5, 6, 2);
        g.fillCircle(11, 7, 2);
        g.fillCircle(8, 11, 2);
        // Cheese drip at tip
        g.fillStyle(0xffee66);
        g.fillRect(7, 15, 2, 3);
        g.generateTexture('perk_pizza', 16, 18);

        // Confetti piece (rectangle)
        g.clear();
        g.fillStyle(0xff0088);
        g.fillRect(0, 0, 8, 4);
        g.generateTexture('perk_confetti_pink', 8, 4);

        g.clear();
        g.fillStyle(0x00cc44);
        g.fillRect(0, 0, 6, 6);
        g.generateTexture('perk_confetti_green', 6, 6);

        g.clear();
        g.fillStyle(0x4488ff);
        g.fillRect(0, 0, 4, 8);
        g.generateTexture('perk_confetti_blue', 4, 8);

        g.clear();
        g.fillStyle(0xffdd00);
        g.fillRect(0, 0, 7, 3);
        g.generateTexture('perk_confetti_yellow', 7, 3);

        g.clear();
        g.fillStyle(0xff4400);
        g.fillRect(0, 0, 5, 7);
        g.generateTexture('perk_confetti_orange', 5, 7);

        // Skull (small)
        g.clear();
        g.fillStyle(0xddddcc);
        g.fillRect(1, 0, 8, 8);
        g.fillRect(0, 2, 10, 5);
        g.fillStyle(0x111111); // eye sockets
        g.fillRect(2, 3, 2, 2);
        g.fillRect(6, 3, 2, 2);
        g.fillStyle(0x222222); // nose
        g.fillRect(4, 6, 2, 1);
        g.fillStyle(0xccccbb); // jaw
        g.fillRect(2, 8, 6, 3);
        g.fillStyle(0x111111); // teeth
        g.fillRect(3, 8, 1, 2);
        g.fillRect(5, 8, 1, 2);
        g.fillRect(7, 8, 1, 2);
        g.generateTexture('perk_skull', 10, 12);

        // Crossbone
        g.clear();
        g.fillStyle(0xddddcc);
        g.fillRect(0, 4, 12, 2);
        g.fillRect(4, 0, 2, 10);
        g.fillCircle(1, 4, 2);
        g.fillCircle(11, 4, 2);
        g.fillCircle(5, 1, 2);
        g.fillCircle(5, 9, 2);
        g.generateTexture('perk_crossbone', 12, 10);

        // Rubber ducky
        g.clear();
        g.fillStyle(0xffdd00); // body
        g.fillCircle(7, 9, 6);
        g.fillStyle(0xffee44); // head
        g.fillCircle(7, 4, 4);
        g.fillStyle(0xff8800); // beak
        g.fillRect(10, 3, 4, 3);
        g.fillStyle(0x111111); // eye
        g.fillRect(8, 3, 2, 2);
        g.fillStyle(0xffdd00); // wing
        g.fillRect(2, 7, 4, 5);
        g.generateTexture('perk_ducky', 14, 16);

        // Toilet water splash
        g.clear();
        g.fillStyle(0x4488ff);
        g.fillRect(2, 4, 8, 6);
        g.fillStyle(0x66aaff);
        g.fillRect(0, 2, 4, 4);
        g.fillRect(8, 2, 4, 4);
        g.fillRect(4, 0, 4, 3);
        g.fillStyle(0xffffff, 0.6);
        g.fillRect(3, 5, 2, 2);
        g.generateTexture('perk_water', 12, 10);

        // Toilet swirl
        g.clear();
        g.fillStyle(0x4488ff);
        g.fillCircle(8, 8, 8);
        g.fillStyle(0x66aaff);
        g.fillCircle(8, 8, 5);
        g.fillStyle(0x88ccff);
        g.fillCircle(8, 8, 2);
        g.fillStyle(0x0a0a1a); // center hole
        g.fillCircle(8, 8, 1);
        g.generateTexture('perk_swirl', 16, 16);

        // Glitter sparkle
        g.clear();
        g.fillStyle(0xffffff);
        g.fillRect(3, 0, 2, 8);
        g.fillRect(0, 3, 8, 2);
        g.fillStyle(0xffccff);
        g.fillRect(1, 1, 2, 2);
        g.fillRect(5, 5, 2, 2);
        g.fillStyle(0xffff88);
        g.fillRect(5, 1, 2, 2);
        g.fillRect(1, 5, 2, 2);
        g.generateTexture('perk_sparkle', 8, 8);

        // Hairball
        g.clear();
        g.fillStyle(0x887755);
        g.fillCircle(6, 6, 6);
        g.fillStyle(0x776644);
        g.fillRect(1, 3, 3, 2);
        g.fillRect(8, 2, 3, 2);
        g.fillRect(3, 8, 3, 2);
        g.fillStyle(0x998866); // fur strands
        g.fillRect(0, 5, 2, 1);
        g.fillRect(10, 4, 2, 1);
        g.fillRect(5, 0, 1, 2);
        g.fillRect(7, 10, 1, 2);
        g.generateTexture('perk_hairball', 12, 12);

        g.destroy();
    }

    generateSFX() {
        // Generate simple sound effects using Web Audio API
        const audioCtx = this.sound.context;
        if (!audioCtx) return;

        this.generateTone('sfx_shoot', audioCtx, 880, 0.08, 'square', 0.3);
        this.generateTone('sfx_hit', audioCtx, 220, 0.15, 'sawtooth', 0.3);
        this.generateTone('sfx_explode', audioCtx, 100, 0.3, 'sawtooth', 0.4);
        this.generateTone('sfx_jump', audioCtx, 440, 0.12, 'square', 0.25, 880);
        this.generateTone('sfx_powerup', audioCtx, 523, 0.3, 'sine', 0.3, 1046);
        this.generateTone('sfx_select', audioCtx, 660, 0.1, 'square', 0.2);
        this.generateTone('sfx_confirm', audioCtx, 880, 0.15, 'sine', 0.25);
        this.generateTone('sfx_death', audioCtx, 440, 0.4, 'sawtooth', 0.3, 110);
        this.generateTone('sfx_stomp', audioCtx, 300, 0.1, 'square', 0.3, 150);
        this.generateTone('sfx_flap', audioCtx, 600, 0.08, 'triangle', 0.2, 800);
        this.generateTone('sfx_score', audioCtx, 1047, 0.2, 'sine', 0.2);
        this.generateTone('sfx_boss_hit', audioCtx, 150, 0.2, 'sawtooth', 0.4);
        this.generateTone('sfx_typewriter', audioCtx, 1200, 0.03, 'square', 0.15);
    }

    generateTone(key, audioCtx, freq, duration, type, volume, endFreq) {
        const sampleRate = audioCtx.sampleRate;
        const length = Math.floor(sampleRate * duration);
        const buffer = audioCtx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            const progress = i / length;
            const currentFreq = endFreq ? freq + (endFreq - freq) * progress : freq;
            const envelope = Math.max(0, 1 - progress * 1.5) * volume;

            let sample;
            const phase = (2 * Math.PI * currentFreq * t);
            switch (type) {
                case 'sine':
                    sample = Math.sin(phase);
                    break;
                case 'square':
                    sample = Math.sin(phase) > 0 ? 1 : -1;
                    break;
                case 'sawtooth':
                    sample = 2 * ((currentFreq * t) % 1) - 1;
                    break;
                case 'triangle':
                    sample = 4 * Math.abs(((currentFreq * t) % 1) - 0.5) - 1;
                    break;
                default:
                    sample = Math.sin(phase);
            }
            data[i] = sample * envelope;
        }

        this.cache.audio.add(key, { data: buffer, sampleRate });
        this.sound.decodeAudio(key, buffer);
    }
}
