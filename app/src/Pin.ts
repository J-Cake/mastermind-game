import Colour from './Colour';
import RenderObject from './RenderObject';
import * as p5 from 'p5';

export default class Pin extends RenderObject{
    public readonly pinColour: Colour;

    constructor (colour: Colour) {
        super();
        this.pinColour = colour;
    }

    render(sketch: p5): void {
        
    }
    update(): void {
        
    }
}