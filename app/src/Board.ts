import * as p5 from 'p5';

import {Pattern} from './Pin';
import RenderObject from './RenderObject';
import Row from './Row';
import EditableRow from "./EditableRow";

export default class Board extends RenderObject {
    coveredPattern: Pattern;

    guessPatterns: Pattern[];

    padding: number;

    pos: { x: number, y: number };
    size: { w: number, h: number };

    aspectWidth: number;
    aspectHeight: number;

    rowAmount: number;
    rows: Row[];

    currentRow: EditableRow;

    constructor() {
        super();

        this.guessPatterns = [];
        // this.coveredPattern = [];
        this.coveredPattern = this.generatePattern();

        this.aspectWidth = 9;
        this.aspectHeight = 16;

        this.padding = 24;

        this.pos = {
            x: 0,
            y: 0
        };
        this.size = {
            w: 0,
            h: 0
        };

        this.rowAmount = 10;

        this.rows = [];

        this.currentRow = new EditableRow();
    }

    generatePattern(): Pattern {
        return (null as any) as Pattern;
    }

    addRow(pattern: Pattern): void {
        this.rows.push(new Row(this.rows[this.rows.length - 1], pattern));
    }

    render(sketch: p5): void {
        sketch.fill([235, 235, 235]);
        sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    update(sketch: p5): void {
        const width: number = sketch.width;
        const height: number = sketch.height;

        const factor: number = Math.min(width, height) / Math.max(this.aspectWidth, this.aspectHeight);

        this.pos = {
            x: width / 2 - (this.aspectWidth * factor) / 2 + this.padding,
            y: height / 2 - (this.aspectHeight * factor) / 2 + this.padding
        };
        this.size = {
            w: (this.aspectWidth * factor) - (2 * this.padding),
            h: (this.aspectHeight * factor) - (2 * this.padding)
        };
    }
}
