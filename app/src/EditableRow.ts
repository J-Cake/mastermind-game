import * as mousetrap from 'mousetrap';
import * as p5 from 'p5';
import RenderObject from './RenderObject';
import {manager, State} from '.';
import Board from './Board';
import PinHole from "./PinHole";
import Colour, {darken, getColour} from "./Colour";
import Row from "./Row";
import {Peg} from './Pin';
import {Interpolation} from "./interpolation";
import {GameState} from "./GameStateIndicator";

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

        manager.on("click", (state: State) => {
            if (state.indicator.state === GameState.Ongoing)
                this.click(state.mouse)
        });

        mousetrap.bind("backspace", () => {
            if (manager.setState().indicator.state === GameState.Ongoing) {
                let index: number = this.pins.length - 1;
                while (this.pins[index].colour === Colour.Blank && index > 0)
                    index--;
                this.pins[index].colour = Colour.Blank;
            }
        });
        manager.on("enter", () => {
            if (manager.setState().indicator.state === GameState.Ongoing)
                this.isValidTurn ? this.commitPattern() : null
        });
        mousetrap.bind(["1", "2", "3", "4", "5", "6"], (e) => {
            if (manager.setState().indicator.state === GameState.Ongoing) {
                const pin: PinHole | undefined = this.pins.find(i => i.colour === Colour.Blank);

                const key: number = Number(e.key) - 1;
                const colour: Peg = [Colour.Orange, Colour.Yellow, Colour.Green, Colour.Blue, Colour.Red, Colour.Pink][key] as Peg;
                if (pin && colour)
                    pin.colour = colour;
            }
        });
        mousetrap.bind(["o", "r", "y", "g", "b", "p"], (e) => {
            if (manager.setState().indicator.state === GameState.Ongoing) {
                const pin: PinHole | undefined = this.pins.find(i => i.colour === Colour.Blank);

                const colours: {[key: string]: Colour} = {o: Colour.Orange, y: Colour.Yellow, g: Colour.Green, b: Colour.Blue, r: Colour.Red, p: Colour.Pink};

                const colour: Peg = colours[e.key] as Peg;
                if (pin && colour)
                    pin.colour = colour;
            }
        });
    }

    render(sketch: p5): void {
        // sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        // sketch.rect(this.pos.x, this.pos.y, this.markerWidth, this.size.h);

        const board: Board = manager.setState().board;

        if (this.isValidTurn && board.rows.length < board.rowAmount) {
            const pos = {
                x: this.pos.x + this.size.w + Row.pinRadius / 2,
                y: this.pos.y
            };
            const size = {
                w: this.size.h,
                h: this.size.h
            };

            if (sketch.mouseX > pos.x && sketch.mouseY > pos.y && sketch.mouseX < pos.x + size.w && sketch.mouseY < pos.y + size.h)
                sketch.fill(darken(Colour.Panel, 25));
            else
                sketch.fill(getColour(Colour.Panel, {duration: 30, type: Interpolation.linear}));
            sketch.rect(pos.x, pos.y, size.w, size.h);

            const vertices: [number, number][] = [[0.25, 0.5], [0.4, 0.7], [0.75, 0.25], [0.4, 0.7], [0.25, 0.5]];

            // sketch.fill(getColour(Colour.Panel, {duration: 30, type: Interpolation.linear}));
            sketch.noFill();
            // sketch.noStroke();
            sketch.stroke(getColour(Colour.Blank, {duration: 30, type: Interpolation.linear}));
            sketch.strokeWeight(10);
            sketch.beginShape(sketch.LINES);
            //
            for (const vertex of vertices)
                sketch.vertex(
                    pos.x + Math.min(vertex[0] * size.w, size.w),
                    pos.y + Math.min(vertex[1] * size.h, size.h));
            //
            sketch.endShape();

        }
    }

    clean() {
        this.pins.forEach(i => i.clean());
        delete this.pins;
    }

    protected update(sketch: p5): void {
        const board: Board = manager.setState().board;

        this.pos.x = board.pos.x;

        this.size.w = board.size.w;
        this.size.h = board.size.h / (board.rowAmount + 1);

        this.markerWidth = Math.sqrt(Math.PI) * this.size.h;

        if (board.rows.length > board.rowAmount)
            this.pos.y = -this.size.h;
        else
            this.pos.y = board.size.h + board.pos.y - ((board.rows.length + 1) * this.size.h);

        this.isValidTurn = !this.pins.map(i => [Colour.Red, Colour.Pink, Colour.Orange, Colour.Yellow, Colour.Blue, Colour.Green].includes(i.colour)).includes(false);
    }

    private click(mouse: { x: number, y: number }): void {
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
        manager.setState().board.addRow([this.pins[0].colour as Peg, this.pins[1].colour as Peg, this.pins[2].colour as Peg, this.pins[3].colour as Peg]);
        this.pins.forEach(i => i.colour = Colour.Blank);
    }

}
