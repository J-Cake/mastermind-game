import * as _p5 from 'p5';
import * as mousetrap from "mousetrap";

import RenderObject from './RenderObject';
import StateManager from "./stateManager";
import Board from "./Board";
import DragObject from "./DragObject";
import DropObject from "./DropObject";
import PinRack from "./PinRack";
import Colour, {getColour, Theme} from "./Colour";
import ThemeSwitcher from "./ThemeSwitcher";
import GameStateIndicator from "./GameStateIndicator";
import interpolate, {constrain, Interpolation, map} from "./interpolation";
import Row from "./Row";

declare global {
    interface Array<T> {
        last(i?: number): T;
    }
}
Array.prototype.last = function (i: number = 0) {
    return this[this.length - (Math.max(i, 0) + 1)];
}

export interface State {
    board: Board,
    pinRack: PinRack,
    mouseDown: boolean,
    dragObjects: DragObject[],
    mouse: {
        x: number,
        y: number
    },
    dragStart: {
        x: number,
        y: number
    },
    dropObjects: DropObject[],
    themes: Theme[],
    themeSwitcher: ThemeSwitcher,
    font: _p5.Font,
    indicator: GameStateIndicator,
    winCount: number,
    lossCount: number,
    switchFrame: number, // The frame on which the theme was last switched
    frame: number
}

export const manager: StateManager<State> = new StateManager<State>({
    mouseDown: false,
    dragObjects: [],
    dropObjects: [],
    mouse: { x: 0, y: 0 },
    dragStart: { x: 0, y: 0 },
    themes: [Theme.Dark]
});

new _p5(function (sketch) {
    sketch.setup = function () {
        sketch.createCanvas(window.innerWidth, window.innerHeight);

        manager.setState({
            board: new Board(),
            pinRack: new PinRack(),
            themeSwitcher: new ThemeSwitcher(),
            font: sketch.loadFont("./montserrat.ttf"),
            indicator: new GameStateIndicator(),
            switchFrame: 0
        });

        window.addEventListener("resize", function () {
            sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        });

        window.addEventListener("click", function () {
            const { dragStart, mouse } = manager.setState();
            if (Math.sqrt((dragStart.x - mouse.x) ** 2 + (dragStart.y - mouse.y) ** 2) <= 5) // Only if there are objects that aren't in a dragging state
                manager.dispatch("click", { mouse: { x: sketch.mouseX, y: sketch.mouseY } });
        })

        window.addEventListener("mousedown", function () {
            manager.setState({
                dragStart: { x: sketch.mouseX, y: sketch.mouseY }
            });
        });

        window.addEventListener("mousemove", function () { // Call MouseDown only after traveling a minimum distance
            const { dragStart, mouse } = manager.setState();
            if (Math.sqrt((dragStart.x - mouse.x) ** 2 + (dragStart.y - mouse.y) ** 2) > 5)
                if (!manager.setState().dragObjects.find(i => i.isDragging))
                    manager.dispatch("mouseDown", {
                        mouse
                    });
        });

        window.addEventListener("mouseup", function () {
            manager.dispatch("mouseUp", {
                mouseDown: true
            })
        });

        manager.on("win", prev => ({winCount: prev.winCount + 1}));
        manager.on("lose", prev => ({lossCount: prev.lossCount + 1}));

        manager.on("restart", function () {
            manager.setState().board.reset();
            RenderObject.print();
        });

        mousetrap.bind("enter", () => manager.broadcast("enter"));
    }

    sketch.draw = function () {
        sketch.background(getColour(Colour.Background, {duration: 30, type: Interpolation.linear}));

        Row.pinRadius = constrain(map(interpolate(manager.setState().frame, 0, 15, Interpolation.linear), 0, 15, 0, 35), 0, 35)

        manager.setState({
            mouse: {
                x: sketch.mouseX,
                y: sketch.mouseY
            },
            frame: sketch.frameCount,
            mouseDown: sketch.mouseIsPressed
        });

        const board = manager.setState().board;

        board.render(sketch);
        board.update(sketch);

        RenderObject.tick(sketch);
        RenderObject.draw(sketch);

        manager.setState().indicator.render(sketch);
        manager.setState().indicator.update(sketch);

        sketch.noStroke();
        sketch.fill(getColour(Colour.Blank, {duration: 30, type: Interpolation.linear}));
        sketch.textFont(manager.setState().font);
        sketch.textSize(20);
        sketch.textAlign(sketch.BASELINE);
        sketch.text("By Jacob Schneider", 20, sketch.height - 20);
    }
});
