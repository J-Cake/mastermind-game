import * as p5 from 'p5';
import RenderObject from './RenderObject';
import { manager } from '.';
import Board from './Board';
import Pin, { Pattern } from "./Pin";
import Colour, { getColour } from "./Colour";

export type Mark = Colour.White | Colour.Black | null;

export default class Row extends RenderObject {

    public static pinRadius = 35;
    public static markerRadius = 15;
    prevRow: Row | null;
    pos: {
        x: number,
        y: number
    };
    size: {
        w: number,
        h: number
    };
    markerWidth: number;
    public pins: [Pin, Pin, Pin, Pin];
    public marks: [Mark, Mark, Mark, Mark];
    public pattern: Pattern;

    constructor(prevRow: Row | null, pattern: Pattern) {
        super();

        this.prevRow = prevRow;
        this.pattern = pattern;

        this.pins = this.toPins(pattern);

        this.markerWidth = 0;
        this.pos = {
            x: 0,
            y: 0
        };
        this.size = {
            w: 0,
            h: 0
        };
        this.marks = this.eval(pattern);

    }

    eval(pattern: Pattern): [Mark, Mark, Mark, Mark] {
        const guess: Pattern = [...pattern];
        const secret: Pattern = [...manager.setState().board.pattern.pattern];
        const mark: Mark[] = [];

        secret.forEach((i, a) => {
            const index: number = guess.findIndex(j => j === i);

            if (index > -1) {
                if (index === a)
                    mark.push(Colour.Black);
                else
                    mark.push(Colour.White)
                guess.splice(a, 1);
            } else
                mark.push(null);
        });

        const _mark: Mark[] = mark.sort(function (i, j) {
            const order = [Colour.White, null, Colour.Black];
            return i === j ? 0 : (order.indexOf(i) > order.indexOf(j) ? 1 : -1);
        });

        return [_mark[0], _mark[1], _mark[2], _mark[3]];

    }

    render(sketch: p5): void {
        this.marks.forEach((peg, a) => {
            if (peg) {
                sketch.fill(getColour(peg));
                sketch.noStroke();

                const scl = 1.25;

                const pos: { x: number, y: number } = [{
                        x: this.pos.x + this.markerWidth / 2 - Row.markerRadius / scl,
                        y: this.pos.y + this.size.h / 2 - Row.markerRadius / scl
                    }, {
                        x: this.pos.x + this.markerWidth / 2 + Row.markerRadius / scl,
                        y: this.pos.y + this.size.h / 2 - Row.markerRadius / scl
                    }, {
                        x: this.pos.x + this.markerWidth / 2 - Row.markerRadius / scl,
                        y: this.pos.y + this.size.h / 2 + Row.markerRadius / scl
                    }, {
                        x: this.pos.x + this.markerWidth / 2 + Row.markerRadius / scl,
                        y: this.pos.y + this.size.h / 2 + Row.markerRadius / scl
                    }][a];

                sketch.ellipse(pos.x, pos.y, Row.markerRadius);
            }
        });
    }

    protected update(sketch: p5): void {
        const board: Board = manager.setState().board;

        this.pos.x = board.pos.x;

        this.size.w = board.size.w;
        this.size.h = board.size.h / (board.rowAmount + 1);

        this.markerWidth = Math.sqrt(Math.PI) * this.size.h;

        if (this.prevRow)
            this.pos.y = this.prevRow.pos.y - this.size.h;
        else
            this.pos.y = board.size.h + board.pos.y - this.size.h;
    }

    private toPins(pattern: Pattern): [Pin, Pin, Pin, Pin] {
        return [new Pin(pattern[0], this, 0),
        new Pin(pattern[1], this, 1),
        new Pin(pattern[2], this, 2),
        new Pin(pattern[3], this, 3)];
    }

}
