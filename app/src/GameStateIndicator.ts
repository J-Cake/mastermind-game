import * as p5 from 'p5';
import RenderObject from "./RenderObject";
import Colour, {darken, getColour} from './Colour';
import {manager, State} from '.';

export enum GameState {
    Win,
    Lose,
    Ongoing
}

export default class GameStateIndicator extends RenderObject {
    state: GameState;

    pos: {
        x: number,
        y: number
    };
    size: {
        w: number,
        h: number
    }

    readonly inspirationalMessages: { win: string[], lose: string[] };

    constructor() {
        super(true);
        this.state = GameState.Ongoing;

        manager.on("win", () => this.state = GameState.Win);
        manager.on("lose", () => this.state = GameState.Lose);
        manager.on("restart", () => this.state = GameState.Ongoing);

        this.inspirationalMessages = {
            win: [],
            lose: []
        };

        manager.on("click", (state: State) => this.click(state.mouse))
        this.pos = {
            x: 0,
            y: 0
        };
        this.size = {
            w: 0,
            h: 0
        };
    }

    click(pos: {x: number, y: number}) {
        if (pos.y > this.pos.y && pos.y < this.pos.y + this.size.h && this.state !== GameState.Ongoing)
            manager.broadcast("restart");
    }

    win(sketch: p5) {
        sketch.fill([...getColour(Colour.Blank), 20]);
        sketch.rect(0, 0, sketch.width, sketch.height);

        if (sketch.mouseY > sketch.height / 3 && sketch.mouseY < sketch.height * (2 / 3))
            sketch.fill(darken(Colour.Win, 15));
        else
            sketch.fill(getColour(Colour.Win));

        sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        // sketch.textFont(manager.setState().font);
        sketch.textSize(sketch.height / 6);
        sketch.fill(darken(Colour.Background, 50));
        sketch.fill(getColour(Colour.Background));
        sketch.text("You Win!", sketch.width / 2, sketch.height / 2);
    }

    lose(sketch: p5) {
        sketch.fill([...getColour(Colour.Blank), 20]);
        sketch.rect(0, 0, sketch.width, sketch.height);

        if (sketch.mouseY > sketch.height / 3 && sketch.mouseY < sketch.height * (2 / 3))
            sketch.fill(darken(Colour.Lose, 15));
        else
            sketch.fill(getColour(Colour.Lose));

        sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        // sketch.textFont(manager.setState().font);
        sketch.textSize(sketch.height / 6);
        sketch.fill(darken(Colour.Background, 50));
        sketch.fill(getColour(Colour.Background));
        sketch.text("You Lose!", sketch.width / 2, sketch.height / 2);
    }

    render(sketch: p5): void {
        if (this.state === GameState.Win)
            this.win(sketch);
        else if (this.state === GameState.Lose)
            this.lose(sketch);
    }

    update(sketch: p5): void {
        this.pos = {
            x: 0,
            y: sketch.height / 3
        };
        this.size = {
            w: sketch.width,
            h: sketch.height / 3
        };
    }

    clean() {
        
    }

}
