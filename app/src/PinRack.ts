import * as p5 from 'p5';

import RenderObject from "./RenderObject";
import DragPin from "./DragPin";
import Colour, {getColour} from "./Colour";
import Row from "./Row";
import {Interpolation} from "./interpolation";

export default class PinRack extends RenderObject {
    readonly pins: [DragPin, DragPin, DragPin, DragPin, DragPin, DragPin];
    readonly pinCellSize = Row.pinRadius * 1.75;

    pos: {x: number, y: number};
    size: {w: number, h: number};

    constructor() {
        super();

        this.pins = [
            new DragPin(Colour.Orange),
            new DragPin(Colour.Yellow),
            new DragPin(Colour.Green),
            new DragPin(Colour.Blue),
            new DragPin(Colour.Red),
            new DragPin(Colour.Pink),
        ];

        this.pos = {
            x: 0,
            y: 0
        };
        this.size = {
            w: 0,
            h: 0
        };
    }

    render(sketch: p5): void {
        sketch.noStroke();
        sketch.fill(getColour(Colour.Panel, {duration: 30, type: Interpolation.linear})); // TODO: Replace with textured image

        sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    protected update(sketch: p5): void {
        this.size = {
            w: this.pinCellSize,
            h: this.pinCellSize * this.pins.length
        };
        this.pos = {
            x: 0,
            y: sketch.height / 2 - this.size.h / 2
        }

        this.pins.forEach((pin, a) => pin.move({x: this.pinCellSize / 2, y: this.pos.y + this.pinCellSize * a + this.pinCellSize / 2}));
    }

    clean() {
        this.pins.forEach(i => i.clean());
    }

}
