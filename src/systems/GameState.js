// GameState - Tracks progress, scores, unlocks

export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.mode = 'story';           // 'story' or 'arcade'
        this.playerCount = 1;
        this.characters = [0];         // Selected character indices
        this.currentChapter = 0;
        this.scores = {};
        this.lives = {};
        this.totalScore = 0;

        // Story progression
        this.chapters = [
            { type: 'cinematic', id: 'opening' },
            { type: 'minigame', id: 'galaga', name: 'Amazon Galaga' },
            { type: 'cinematic', id: 'post_galaga' },
            { type: 'minigame', id: 'platformer', name: 'Wiener Dog Mario' },
            { type: 'cinematic', id: 'post_platformer' },
            { type: 'minigame', id: 'flappy', name: 'Parrot Flappy Bird' },
            { type: 'cinematic', id: 'ending' }
        ];
    }

    setMode(mode) {
        this.mode = mode;
    }

    setPlayers(count, characters) {
        this.playerCount = count;
        this.characters = characters;
        // Initialize lives for each player
        for (let i = 0; i < count; i++) {
            this.lives[i] = 3;
        }
    }

    recordScore(gameId, scores) {
        this.scores[gameId] = scores;
        let total = 0;
        for (const s of Object.values(scores)) total += s;
        this.totalScore += total;
    }

    getCurrentChapter() {
        if (this.currentChapter >= this.chapters.length) return null;
        return this.chapters[this.currentChapter];
    }

    advanceChapter() {
        this.currentChapter++;
        return this.getCurrentChapter();
    }

    getSceneKeyForMinigame(id) {
        const map = {
            'galaga': 'GalagaScene',
            'platformer': 'PlatformerScene',
            'flappy': 'FlappyScene'
        };
        return map[id] || null;
    }
}

// Singleton
export const gameState = new GameState();
