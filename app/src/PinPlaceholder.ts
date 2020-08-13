import * as p5 from 'p5';

import RenderObject from "./RenderObject";
import Colour, {getColour} from "./Colour";
import Row from "./Row";
import PatternView from "./PatternView";

export default class PinPlaceholder extends RenderObject {
    pos: {
        x: number,
        y: number
    };
    colour: Colour;
    index: number;

    concealColour: boolean;

    parent: PatternView;

    constructor(colour: Colour, index: number, parent: PatternView, concealColour: boolean = false) {
        super();

        this.pos = {
            x: 0,
            y: 0
        };

        this.colour = colour;
        this.index = index;
        this.concealColour = concealColour;
        this.parent = parent;
    }

    move(pos: {x: number, y: number}): void {
        this.pos = pos;
    }

    render(sketch: p5): void {
        sketch.noStroke();

        if (!this.concealColour) {
            sketch.fill(getColour(this.colour));
            sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius);
            sketch.noFill();
        } else {
            sketch.fill(getColour(Colour.Blank));
            sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius);
            sketch.noFill();
            sketch.stroke(getColour(Colour.Background));
            sketch.strokeWeight(4);

            const points: [number, number][] = [
                [0.25, 0.3],
                [0.25, 0.3],
                [0.25, 0.2],
                [0.5, 0.1],
                [0.75, 0.15],
                [0.75, 0.4],
                [0.5, 0.6],
                [0.5, 0.7],
                [0.5, 0.7],
            ];

            sketch.beginShape();

            for (const vertex of points)
                sketch.curveVertex((this.pos.x - Row.pinRadius / 3.5) + (Row.pinRadius * 0.5) * vertex[0], (this.pos.y - Row.pinRadius / 3.5) + (Row.pinRadius * 0.5) * vertex[1]);

            sketch.endShape();

            sketch.strokeWeight(6);
            sketch.point((this.pos.x - Row.pinRadius / 3.5) + (Row.pinRadius * 0.5) * 0.5, (this.pos.y - Row.pinRadius / 3.5) + (Row.pinRadius * 0.5));
        }
    }

    protected update(sketch: p5): void {
        this.pos = {
            x: this.parent.pos.x + this.parent.size.w / 2,
            y: this.parent.pos.y + (this.parent.size.h / this.parent.pins.length) * this.index + (Row.pinRadius / 1.25)
        };
    }

    clean() {
    }
}
