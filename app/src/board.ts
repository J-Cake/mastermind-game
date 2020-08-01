import Pin from './Pin';
import RenderObject from './RenderObject';
import * as p5 from 'p5';

type Pattern = [Pin, Pin, Pin, Pin];

export default class Board extends RenderObject{
    coveredPattern: Pattern;

    guessPatterns: Pattern[];

    constructor() {
        super(); 
        this.guessPatterns = [];
        this.coveredPattern = this.generatePattern();
    }

    generatePattern(): Pattern {
        // TODO: Generate Pattern
        return (null as any) as Pattern;
    }

    render(sketch: p5): void {
        const width: number = sketch.width;
        const height: number = sketch.height;

        const padding = 24; // amount of space to leave around the board

        const boardWidth = 9;
        const boardHeight = 16;

        const factor: number = Math.min(width, height) / Math.max(boardWidth, boardHeight);

        const x = width / 2 - (boardWidth * factor) / 2;
        const y = height / 2 - (boardHeight * factor) / 2;

        sketch.rect(x + padding, y + padding, (boardWidth * factor) - (2 * padding), (boardHeight * factor) - (2 * padding));
    }
    update(): void {
        
    }
}