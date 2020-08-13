import * as p5 from 'p5';
import RenderObject from "./RenderObject";
import Colour, {getColour, Theme} from "./Colour";
import Row from "./Row";
import {manager} from "./index";

export default class ThemeSwitcher extends RenderObject {

    icons: Record<Theme, (sketch: p5) => void>;

    pos: {
        x: number,
        y: number
    };

    constructor() {
        super();

        this.icons = this.getIcons();
        this.pos = {
            x: 0,
            y: 0
        };

        manager.on("click", state => this.click(state.mouse));
    }

    click(mouse: {x: number, y: number}) {
        if (Math.sqrt((this.pos.x - mouse.x) ** 2 + (this.pos.y - mouse.y) ** 2) <= Row.pinRadius * 1.5)
            this.switch();
    }

    switch() {
        manager.dispatch("toggleTheme", prev => ({theme: prev.theme === Theme.Dark ? Theme.Light : Theme.Dark}));
    }

    sun(sketch: p5) {
        const length = 0.5;

        sketch.stroke(getColour(Colour.Background));
        sketch.strokeWeight(5);

        for (let i = 0; i < Math.PI; i += Math.PI / 4)
            sketch.line(
                this.pos.x + Math.cos(i) * Row.pinRadius * length,
                this.pos.y + Math.sin(i) * Row.pinRadius * length,
                this.pos.x - Math.cos(i) * Row.pinRadius * length,
                this.pos.y - Math.sin(i) * Row.pinRadius * length);

        sketch.noStroke();
        sketch.fill(getColour(Colour.Background));
        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius * 0.75);
    }

    moon(sketch: p5) {
        sketch.noStroke();
        sketch.fill(getColour(Colour.Background));

        const points: [number, number][] = [
            // TODO: Draw Moon
            [0, 0]
        ];

        sketch.beginShape();

        for (const vertex of points)
                sketch.curveVertex((this.pos.x - Row.pinRadius * 0.75) + (Row.pinRadius * 1.5) * vertex[0], (this.pos.y - Row.pinRadius * 0.75) + (Row.pinRadius * 1.5) * vertex[1]);

        sketch.endShape();
    }

    getIcons(): Record<Theme, (sketch: p5) => void> {
        return {
            [Theme.Light]: this.sun.bind(this),
            [Theme.Dark]: this.moon.bind(this)
        }
    }

    render(sketch: p5): void {
        sketch.fill(getColour(Colour.Blank));
        sketch.noStroke();
        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius * 1.5);

        this.icons[manager.setState().theme](sketch);
    }

    protected update(sketch: p5): void {
        this.pos = {
            x: sketch.width - Row.pinRadius,
            y: Row.pinRadius
        }
    }

    clean() {}

}
