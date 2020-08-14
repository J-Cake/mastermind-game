import * as p5 from 'p5';
import RenderObject from "./RenderObject";
import Colour, {getColour, Theme} from "./Colour";
import Row from "./Row";
import {manager} from "./index";
import {Interpolation} from "./interpolation";
import * as mousetrap from "mousetrap";

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

        manager.on("click", state => this.click(state.mouse, state.frame));
        mousetrap.bind("tab", (e) => {
            e.preventDefault();
            this.switch(manager.setState().frame)
        });
    }

    click(mouse: {x: number, y: number}, frame: number) {
        if (Math.sqrt((this.pos.x - mouse.x) ** 2 + (this.pos.y - mouse.y) ** 2) <= Row.pinRadius * 1.5)
            this.switch(frame);
    }

    switch(frame: number) {
        manager.dispatch("toggleTheme", prev => ({themes: [...prev.themes, prev.themes.last() === Theme.Dark ? Theme.Light : Theme.Dark], switchFrame: frame}));
    }

    sun(sketch: p5) {
        const length = 0.5;

        sketch.stroke(getColour(Colour.Background, {duration: 30, type: Interpolation.linear}));
        sketch.strokeWeight(5);

        for (let i = 0; i < Math.PI; i += Math.PI / 4)
            sketch.line(
                this.pos.x + Math.cos(i) * Row.pinRadius * length,
                this.pos.y + Math.sin(i) * Row.pinRadius * length,
                this.pos.x - Math.cos(i) * Row.pinRadius * length,
                this.pos.y - Math.sin(i) * Row.pinRadius * length);

        sketch.noStroke();
        sketch.fill(getColour(Colour.Background, {duration: 30, type: Interpolation.linear}));
        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius * 0.75);
        sketch.strokeWeight(5);
        sketch.stroke(getColour(Colour.Blank, {duration: 30, type: Interpolation.linear}));
        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius * 0.7);
    }

    moon(sketch: p5) {
        sketch.noStroke();
        sketch.fill(getColour(Colour.Background, {duration: 30, type: Interpolation.linear}));

        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius);

        sketch.fill(getColour(Colour.Blank, {duration: 30, type: Interpolation.linear}));
        sketch.ellipse(this.pos.x + Row.pinRadius / 4, this.pos.y - Row.pinRadius / 4, Row.pinRadius / 1.5);

        sketch.endShape();
    }

    getIcons(): Record<Theme, (sketch: p5) => void> {
        return {
            [Theme.Light]: this.sun.bind(this),
            [Theme.Dark]: this.moon.bind(this)
        }
    }

    render(sketch: p5): void {
        sketch.fill(getColour(Colour.Blank, {duration: 30, type: Interpolation.linear}));
        sketch.noStroke();
        sketch.ellipse(this.pos.x, this.pos.y, Row.pinRadius * 1.5);

        this.icons[manager.setState().themes.last()](sketch);
    }

    protected update(sketch: p5): void {
        this.pos = {
            x: sketch.width - Row.pinRadius,
            y: Row.pinRadius
        }
    }

    clean() {}

}
