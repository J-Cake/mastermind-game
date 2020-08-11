import * as p5 from 'p5';

import RenderObject from "./RenderObject";
import {Pattern} from "./Pin";
import Colour, {getColour} from "./Colour";
import Row from "./Row";
import PinPlaceholder from "./PinPlaceholder";
import { manager } from '.';

export default class PatternView extends RenderObject {
    readonly pinCellSize = Row.pinRadius * 1.75;
    pattern: Pattern;
    pins: PinPlaceholder[];

    pos: {
        x: number,
        y: number
    };
    size: {
        w: number,
        h: number
    }

    constructor() {
        super();
        this.pattern = this.generatePattern();

        this.pos = {
            x: 0,
            y: 0
        };
        this.size = {
            w: 0,
            h: 0
        };

        manager.on("win", () => this.pins.forEach(i => i.concealColour = false))
        manager.on("lose", () => this.pins.forEach(i => i.concealColour = false))

        this.pins = this.pattern.map((i, a) => new PinPlaceholder(i, a, this, false));
    }

    generatePattern(): Pattern {
        const allowedColours: Colour[] = [Colour.Green, Colour.Blue, Colour.Yellow, Colour.Orange, Colour.Pink, Colour.Red];
        const rnd: () => Colour = () => allowedColours[Math.floor(Math.random() * allowedColours.length)];

        return [rnd(), rnd(), rnd(), rnd()];
    }

    render(sketch: p5): void {
        sketch.noStroke();

        sketch.fill(getColour(Colour.Panel)); // TODO: Replace with textured image

        sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);

        for (const pin of this.pins)
            pin.render(sketch);
    }

    protected update(sketch: p5): void {
        this.size = {
            w: this.pinCellSize,
            h: this.pinCellSize * this.pattern.length
        };
        this.pos = {
            x: sketch.width - this.size.w,
            y: sketch.height / 2 - this.size.h / 2
        }

        this.pins.forEach((pin, a) => pin.move({x: this.pinCellSize / 2, y: this.pos.y + this.pinCellSize * a + this.pinCellSize / 2}));
    }

}
