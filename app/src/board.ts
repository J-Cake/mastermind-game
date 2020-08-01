import Pin from './Pin';
import RenderObject from './RenderObject';
import * as p5 from 'p5';

type Pattern = [Pin, Pin, Pin, Pin];

export default class Board extends RenderObject{
    coveredPattern: Pattern;

    guessPatterns: Pattern[];

    width: number;
    height: number;

    padding: number;

    x: number;
    y: number;

    aspectWidth: number;
    aspectHeight: number;

    constructor() {
        super(); 
        this.guessPatterns = [];
        this.coveredPattern = this.generatePattern();

        this.aspectWidth = 9;
        this.aspectHeight = 16;

        this.width = 0;
        this.height = 0;

        this.padding = 24;

        this.x = 0;
        this.y = 0;
    }

    generatePattern(): Pattern {
        // TODO: Generate Pattern
        return (null as any) as Pattern;
    }

    render(sketch: p5): void {
        sketch.rect(this.x, this.y, this.width, this.height);
    }
    
    update(sketch: p5): void {
        const width: number = sketch.width;
        const height: number = sketch.height;

        const factor: number = Math.min(width, height) / Math.max(this.aspectWidth, this.aspectHeight);

        this.x = width / 2 - (this.aspectWidth * factor) / 2 + this.padding;
        this.y = height / 2 - (this.aspectHeight * factor) / 2 + this.padding;

        this.width = (this.aspectWidth * factor) - (2 * this.padding);
        this.height = (this.aspectHeight * factor) - (2 * this.padding);
    }
}