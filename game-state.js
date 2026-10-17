// Game state management module
export class GameState {
    constructor() {
        this.GAME_CONFIG = {
            easy: { gridSize: 4, initialBlocks: 2, sandGrains: 15 },
            medium: { gridSize: 5, initialBlocks: 5, sandGrains: 20 },
            hard: { gridSize: 6, initialBlocks: 6, sandGrains: 25 },
            zen: { gridSize: 4, initialBlocks: 2, sandGrains: 15 }
        };
        
        this.reset();
    }
    
    reset() {
        this.gridSize = 0;
        this.boardState = [];
        this.score = 0;
        this.selectedBlockIndex = -1;
        this.currentDifficulty = 'easy';
        this.theme = null;
        this.blockImages = {};
        this.nextSpawnIndices = [];
        this.eventLog = [];
    }
    
    initializeGame(difficulty, theme) {
        this.currentDifficulty = difficulty;
        this.theme = theme;
        this.eventLog = [];
        this.logEvent('game_start', { difficulty, theme });
        // Preserve pre-loaded images if they exist
        if (Object.keys(this.blockImages).length === 0) {
            this.blockImages = {};
        }
        const config = this.GAME_CONFIG[difficulty];
        this.gridSize = config.gridSize;
        this.score = 0;
        this.selectedBlockIndex = -1;
        this.boardState = new Array(this.gridSize * this.gridSize).fill(0);
        this.nextSpawnIndices = [];
        return config;
    }
    
    getNewBlockValue() {
        const rand = Math.random();

        if (this.score < 100) {
            return 1;
        } else if (this.score < 500) {
            return rand < 0.8 ? 1 : 2;
        } else if (this.score < 1500) {
            if (rand < 0.6) return 1;
            if (rand < 0.9) return 2;
            return 3;
        } else if (this.score < 3000) {
            if (rand < 0.40) return 1;
            if (rand < 0.75) return 2;
            if (rand < 0.95) return 3;
            return 4;
        } else {
            if (rand < 0.20) return 1;
            if (rand < 0.50) return 2;
            if (rand < 0.80) return 3;
            if (rand < 0.95) return 4;
            return 5;
        }
    }
    
    areNeighbors(index1, index2) {
        const row1 = Math.floor(index1 / this.gridSize);
        const col1 = index1 % this.gridSize;
        const row2 = Math.floor(index2 / this.gridSize);
        const col2 = index2 % this.gridSize;

        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);

        return rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0);
    }
    
    getEmptyCells() {
        const emptyCells = [];
        for (let i = 0; i < this.boardState.length; i++) {
            if (this.boardState[i] === 0) {
                emptyCells.push(i);
            }
        }
        return emptyCells;
    }
    
    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = this.score;
    }
    
    selectBlock(index) {
        this.selectedBlockIndex = index;
    }
    
    deselectBlock() {
        this.selectedBlockIndex = -1;
    }
    
    placeBlock(index, value) {
        this.boardState[index] = value;
    }
    
    removeBlock(index) {
        this.boardState[index] = 0;
    }
    
    getBlockValue(index) {
        return this.boardState[index];
    }
    
    isBlockSelected(index) {
        return this.selectedBlockIndex === index;
    }
    
    hasSelectedBlock() {
        return this.selectedBlockIndex !== -1;
    }
    
    getSelectedBlockIndex() {
        return this.selectedBlockIndex;
    }

    logEvent(type, data) {
        this.eventLog.push({
            type,
            data,
            timestamp: new Date().toISOString()
        });
    }

    getImageForValue(value) {
        return this.blockImages[value];
    }

    setImageForValue(value, url) {
        this.blockImages[value] = url;
    }
}