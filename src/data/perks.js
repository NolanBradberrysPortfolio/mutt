// Perk definitions for Galaga leveling system

export const PERKS = [
    {
        id: 'bloody_mess',
        name: 'Bloody Mess',
        description: 'Enemies explode into a glorious bloody mess',
        color: '#ff2222',
        particles: [
            { color: 0xff0000, count: 12 },
            { color: 0xcc0000, count: 8 },
            { color: 0x880000, count: 6 }
        ]
    },
    {
        id: 'confetti',
        name: 'Party Time!',
        description: 'Enemies burst into a confetti celebration',
        color: '#ff88ff',
        particles: [
            { color: 0xff0000, count: 5 },
            { color: 0x00ff00, count: 5 },
            { color: 0x0000ff, count: 5 },
            { color: 0xffff00, count: 5 },
            { color: 0xff00ff, count: 5 }
        ]
    },
    {
        id: 'skull_bones',
        name: 'Skull & Bones',
        description: 'Enemies crumble into skulls and bones',
        color: '#ccbbdd',
        particles: [
            { color: 0xccccbb, count: 8 },
            { color: 0xeeeecc, count: 6 },
            { color: 0x8844aa, count: 4 }
        ]
    },
    {
        id: 'rubber_ducky',
        name: 'Rubber Ducky Rain',
        description: 'Enemies pop into tiny rubber duckies',
        color: '#ffdd00',
        particles: [
            { color: 0xffdd00, count: 10 },
            { color: 0xffaa00, count: 6 },
            { color: 0xff8800, count: 4 }
        ]
    },
    {
        id: 'pizza_explosion',
        name: 'Pizza Party',
        description: 'Enemies explode into pizza slices. Mamma mia!',
        color: '#ff8844',
        particles: [
            { color: 0xdaa520, count: 8 },  // crust
            { color: 0xff3333, count: 6 },  // sauce
            { color: 0xffdd44, count: 6 }   // cheese
        ]
    },
    {
        id: 'toilet_flush',
        name: 'Royal Flush',
        description: 'Enemies swirl away like they got flushed',
        color: '#4488ff',
        particles: [
            { color: 0x4488ff, count: 10 },
            { color: 0x66aaff, count: 8 },
            { color: 0xffffff, count: 4 }
        ]
    },
    {
        id: 'glitter_bomb',
        name: 'Glitter Bomb',
        description: 'Enemies vanish in sparkly glitter. It never comes out.',
        color: '#ffaaff',
        particles: [
            { color: 0xff88ff, count: 8 },
            { color: 0xffccff, count: 8 },
            { color: 0xffffff, count: 6 },
            { color: 0xffff88, count: 4 }
        ]
    },
    {
        id: 'cat_hairballs',
        name: 'Hairball Hurricane',
        description: 'Enemies cough up hairballs everywhere. Gross!',
        color: '#aa8866',
        particles: [
            { color: 0x887755, count: 10 },
            { color: 0x665544, count: 6 },
            { color: 0xaa9977, count: 6 }
        ]
    }
];
