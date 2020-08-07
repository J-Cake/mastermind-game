import * as p5 from 'p5';
import RenderObject from './RenderObject';

import {manager, State} from './index';
import Board from './Board';
import Colour, {getColour} from "./Colour";
import Row from "./Row";

export type Pattern = [Colour, Colour, Colour, Colour];

export default class Pin extends RenderObject{
    public readonly colour: Colour;

    public pos: {
        x: number,
        y: number
    } = {
        x: 0,
        y: 0
    };

    index: number;
    parent: Row;

    constructor (colour: Colour, row: Row, index: number) {
        super();
        this.colour = colour;
        this.index = index
        this.parent = row;
    }

    render(sketch: p5): void {
        sketch.noStroke();
        sketch.fill(getColour(this.colour));
        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius);
        sketch.noFill();
    }

    update(sketch: p5): void {
        this.pos.x = this.parent.pos.x + this.parent.markerWidth + ((this.parent.size.w - (this.parent.markerWidth * 1.5)) / 4 * (this.index * 1.5));
        this.pos.y = this.parent.pos.y + this.parent.size.h / 2;
    }
}
