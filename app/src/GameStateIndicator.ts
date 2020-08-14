import * as p5 from 'p5';
import RenderObject from "./RenderObject";
import Colour, {darken, getColour} from './Colour';
import {manager, State} from '.';
import Row from "./Row";
import {Pattern} from "./Pin";
import interpolate, {constrain, Interpolation, map} from './interpolation';

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
    };

    stateChangeFrame: number;
    isLeaving: boolean;

    readonly inspirationalMessages: { win: string[], lose: string[] };

    constructor() {
        super(true);
        this.state = GameState.Ongoing;

        manager.on("win", state => {
            this.isLeaving = false;
            this.stateChangeFrame = state.frame;
            this.state = GameState.Win
        });
        manager.on("lose", state => {
            this.isLeaving = true;
            this.stateChangeFrame = state.frame;
            this.state = GameState.Lose
        });
        manager.on("restart", state => {
            this.stateChangeFrame = state.frame;
            this.isLeaving = true;
            this.state = GameState.Ongoing;
        });

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

        this.stateChangeFrame = 0;
        this.isLeaving = false;

        manager.on("enter", (state) => {
            if (this.state !== GameState.Ongoing && Math.abs(this.stateChangeFrame - state.frame) > 5)
                manager.broadcast("restart");
        });
    }

    click(pos: { x: number, y: number }) {
        if (pos.y > this.pos.y && pos.y < this.pos.y + this.size.h && this.state !== GameState.Ongoing)
            manager.broadcast("restart");
    }

    win(sketch: p5) {
        sketch.noStroke();
        sketch.fill([...getColour(Colour.Blank), 20]);
        sketch.rect(0, 0, sketch.width, sketch.height);

        if (sketch.mouseY > sketch.height / 3 && sketch.mouseY < sketch.height * (2 / 3))
            sketch.fill(darken(Colour.Win, 15));
        else
            sketch.fill(getColour(Colour.Win));

        sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.textFont(manager.setState().font);
        sketch.textSize(sketch.height / 6);
        sketch.fill(darken(Colour.Background, 50));
        sketch.fill(getColour(Colour.Background));
        sketch.text("You Win!", this.pos.x + sketch.width / 2, sketch.height / 2);
    }

    lose(sketch: p5) {
        sketch.noStroke();
        sketch.fill([...getColour(Colour.Blank), 20]);
        sketch.rect(0, 0, sketch.width, sketch.height);

        if (sketch.mouseY > sketch.height / 3 && sketch.mouseY < sketch.height * (2 / 3))
            sketch.fill(darken(Colour.Lose, 15));
        else
            sketch.fill(getColour(Colour.Lose));

        sketch.rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.textFont(manager.setState().font);
        sketch.textSize(sketch.height / 6);
        sketch.fill(darken(Colour.Background, 50));
        sketch.fill(getColour(Colour.Background));
        sketch.text("You Lose!", this.pos.x + sketch.width / 2, sketch.height / 2);
    }

    render(sketch: p5): void {
        if (this.state === GameState.Win || (manager.setState().frame <= this.stateChangeFrame + 15 && this.isLeaving))
            this.win(sketch);
        else if (this.state === GameState.Lose || (manager.setState().frame <= this.stateChangeFrame + 15 && this.isLeaving))
            this.lose(sketch);

        if (this.state !== GameState.Ongoing || (manager.setState().frame <= this.stateChangeFrame + 15 && this.isLeaving)) {
            const pattern: Pattern = manager.setState().board.pattern.pattern;

            sketch.fill(getColour(Colour.Background));
            sketch.noStroke();
            sketch.rect(0 - this.pos.x, sketch.height / 3 + Row.pinRadius / 2, sketch.width, Row.pinRadius * 2);

            pattern.forEach((i, a) => {
                sketch.fill(getColour(i));
                sketch.ellipse(sketch.width / 2 - Row.pinRadius * pattern.length + (2 * Row.pinRadius * a) - this.pos.x, sketch.height / 3 + Row.pinRadius * 1.5, Row.pinRadius, Row.pinRadius);
            });
        }
    }

    update(sketch: p5): void {
        if (this.isLeaving)
            this.pos = {
                x: constrain(map(interpolate(manager.setState().frame, this.stateChangeFrame, this.stateChangeFrame + 15, Interpolation.reverseLinear), this.stateChangeFrame, this.stateChangeFrame + 15, sketch.width * -1, 0), sketch.width * -1, 0),
                y: sketch.height / 3
            };
        else
            this.pos = {
                x: constrain(map(interpolate(manager.setState().frame, this.stateChangeFrame, this.stateChangeFrame + 15, Interpolation.linear), this.stateChangeFrame, this.stateChangeFrame + 15, sketch.width, 0), 0, sketch.width),
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
