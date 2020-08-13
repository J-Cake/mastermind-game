import * as p5 from 'p5';

import Pin, {Pattern} from './Pin';
import RenderObject from './RenderObject';
import Row from './Row';
import EditableRow from "./EditableRow";
import Colour, {getColour} from "./Colour";
import PatternView from "./PatternView";
import { manager } from '.';

export default class Board extends RenderObject {
    pattern: PatternView;

    padding: number;

    pos: { x: number, y: number };
    size: { w: number, h: number };

    aspectWidth: number;
    aspectHeight: number;

    rowAmount: number;
    rows: Row[];

    currentRow: EditableRow;

    constructor() {
        super(true);

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

        this.pattern = new PatternView();

        this.rowAmount = 10;

        this.rows = [];

        this.currentRow = new EditableRow();
    }

    addRow(pattern: Pattern): void {
        if (this.rows.length <= this.rowAmount)
            this.rows.push(new Row(this.rows[this.rows.length - 1], pattern));
        else
            manager.broadcast("lose");
    }

    render(sketch: p5): void {
        sketch.noStroke();
        sketch.fill(getColour(Colour.Panel));
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

    reset(): void {
        RenderObject.purge(Row);
        RenderObject.purge(Pin);
        this.pattern.regen();
        this.rows = [];
    }

    clean() {
        this.pattern.clean();
        this.rows.forEach((i, a) => {
            i.clean();
            delete this.rows[a];
        });

        this.currentRow.clean();

        RenderObject.purge(Row);
        RenderObject.purge(EditableRow);
        RenderObject.purge(Pin);

        this.pattern.pattern = this.pattern.generatePattern();
    }
}
