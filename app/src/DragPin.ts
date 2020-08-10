import * as p5 from 'p5';

import DragObject from "./DragObject";
import Colour, { getColour } from "./Colour";
import Row from "./Row";
import { manager } from '.';
import PinHole from './PinHole';

export default class DragPin extends DragObject {
    readonly colour: Colour;

    constructor(colour: Colour) {
        super(true);

        this.colour = colour;

        manager.on("click", state => this.click(state.mouse))
    }

    click(mouse: { x: number, y: number }) {
        if (this.isHover(mouse)) {
            const pin: PinHole | undefined = manager.setState().board.currentRow.pins.find(i => i.colour === Colour.Blank);
            
            if (pin)
                pin.colour = this.colour;
        }
    }

    protected isHover(mousePos: { x: number; y: number }): boolean {
        return Math.sqrt((this.pos.x - mousePos.x) ** 2 + (this.pos.y - mousePos.y) ** 2) < Row.pinRadius;
    }

    draw(sketch: p5): void {
        sketch.noStroke();
        sketch.fill(getColour(this.colour));
        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius);
        sketch.noFill();
    }

    protected tick(sketch: p5): void { // Handle updates here. Movement is handled by base class
    }

}
