import * as p5 from 'p5';
import DropObject from "./DropObject";
import EditableRow from "./EditableRow";
import Row from "./Row";
import Colour, {getColour} from "./Colour";
import DragPin from "./DragPin";
import DragObject from "./DragObject";
import {manager, State} from "./index";
import { Peg } from './Pin';

export default class PinHole extends DropObject {
    readonly parent: EditableRow;
    readonly index: number;

    colour: Peg | Colour.Blank;

    pos: {
        x: number,
        y: number
    };

    constructor(parent: EditableRow, index: number) {
        super();
        this.parent = parent;
        this.index = index;

        this.pos = {
            x: 0,
            y: 0
        }

        this.colour = Colour.Blank;

        manager.on("click", (state: State) => this.click(state.mouse));
    }

    private click(pos: {x: number, y: number}): void {
        if (this.isWithinDropBounds(pos))
            this.colour = Colour.Blank;
    }

    isWithinDropBounds(pos: { x: number; y: number }): boolean {
        return Math.sqrt((this.pos.x - pos.x) ** 2 + (this.pos.y - pos.y) ** 2) < Row.pinRadius;
    }

    protected onDrop(object: DragObject): void {
        if (object instanceof DragPin)
            this.colour = object.colour;
    }

    draw(sketch: p5): void {
        // sketch.stroke([25, 25, 25]);
        sketch.noStroke();
        sketch.fill(getColour(this.colour));
        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius);
    }

    tick(sketch: p5): void {
        this.pos.x = this.parent.pos.x + this.parent.markerWidth + ((this.parent.size.w - (this.parent.markerWidth * 1.5)) / 4 * (this.index * 1.5));
        this.pos.y = this.parent.pos.y + this.parent.size.h / 2;
    }

    clean() {
        this.parent.clean();
    }

}
