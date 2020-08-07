import * as p5 from 'p5';
import RenderObject from './RenderObject';
import {manager, State} from '.';
import Board from './Board';
import PinHole from "./PinHole";
import Colour, {darken, getColour} from "./Colour";
import Row from "./Row";

export default class EditableRow extends RenderObject {

    pins: [PinHole, PinHole, PinHole, PinHole];
    isValidTurn: boolean; // Simply stores whether all four pins have a colour

    pos: {
        x: number,
        y: number
    };
    size: {
        w: number,
        h: number
    };

    markerWidth: number;

    constructor() {
        super();

        this.markerWidth = 0;

        this.pins = [new PinHole(this, 0), new PinHole(this, 1), new PinHole(this, 2), new PinHole(this, 3)];

        this.size = {
            w: 0,
            h: 0
        };
        this.pos = {
            x: 0,
            y: 0
        };

        this.isValidTurn = false;

        manager.on("click", (state: State) => this.click(state.mouse));
    }

    private click(mouse: {x: number, y: number}): void {
        const pos = {
            x: this.pos.x + this.size.w + Row.pinRadius / 2,
            y: this.pos.y
        };
        const size = {
            w: this.size.h,
            h: this.size.h
        };

        if (mouse.x > pos.x && mouse.y > pos.y && mouse.x < pos.x + size.w && mouse.y < pos.y + size.h && this.isValidTurn)
            this.commitPattern();
    }

    private commitPattern(): void {
        manager.setState().board.addRow([this.pins[0].colour, this.pins[1].colour, this.pins[2].colour, this.pins[3].colour]);
        this.pins.forEach(i => i.colour = Colour.Blank);
    }

    render(sketch: p5): void {
        // sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        // sketch.rect(this.pos.x, this.pos.y, this.markerWidth, this.size.h);

        if (this.isValidTurn) {
            const pos = {
                x: this.pos.x + this.size.w + Row.pinRadius / 2,
                y: this.pos.y
            };
            const size = {
                w: this.size.h,
                h: this.size.h
            };

            if (sketch.mouseX > pos.x && sketch.mouseY > pos.y && sketch.mouseX < pos.x + size.w && sketch.mouseY < pos.y + size.h)
                sketch.fill(darken(Colour.Blank, 25));
            else
                sketch.fill(getColour(Colour.Blank));

            const vertices: [number, number][] = [[0.25, 0.5], [0.4, 0.7], [0.75, 0.25]];

            sketch.rect(pos.x, pos.y, size.w, size.h);

            sketch.noFill();
            sketch.stroke(getColour(Colour.White));
            sketch.strokeWeight(10);
            sketch.beginShape();

            for (const vertex of vertices)
                sketch.vertex(
                    pos.x + Math.min(vertex[0] * size.w, size.w),
                    pos.y + Math.min(vertex[1] * size.h, size.h));

            sketch.endShape();

        }
    }

    protected update(sketch: p5): void {
        manager.setState((state: State): Partial<State> => {
            const board: Board = state.board;

            this.pos.x = board.pos.x;

            this.size.w = board.size.w;
            this.size.h = board.size.h / (board.rowAmount + 1);

            this.markerWidth = Math.sqrt(Math.PI) * this.size.h;

            this.pos.y = board.size.h + board.pos.y - ((board.rows.length + 1) * this.size.h);

            this.isValidTurn = !this.pins.map(i => [Colour.Red, Colour.Pink, Colour.Orange, Colour.Yellow, Colour.Blue, Colour.Green].includes(i.colour)).includes(false);

            return {};
        });
    }

}
