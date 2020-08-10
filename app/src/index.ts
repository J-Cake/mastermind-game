import * as p5 from 'p5';
import RenderObject from './RenderObject';
import StateManager from "./stateManager";
import Board from "./Board";
import DragObject from "./DragObject";
import DropObject from "./DropObject";
import PinRack from "./PinRack";
import Colour, {getColour, Theme} from "./Colour";
import ThemeSwitcher from "./ThemeSwitcher";

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
    theme: Theme,
    themeSwitcher: ThemeSwitcher
}

export const manager: StateManager<State> = new StateManager<State>({
    mouseDown: false,
    dragObjects: [],
    mouse: {x: 0, y: 0},
    dragStart: {x: 0, y: 0},
    dropObjects: [],
    theme: Theme.Dark
});

const app: p5 = new p5(function (sketch) {
    sketch.setup = function () {
        const canvas: p5.Renderer = sketch.createCanvas(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", function () {
            sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        });

        manager.setState({
            board: new Board(),
            pinRack: new PinRack(),
            themeSwitcher: new ThemeSwitcher()
        });

        window.addEventListener("click", function() {
            const {dragStart, mouse} = manager.setState();
            if (Math.sqrt((dragStart.x - mouse.x) ** 2 + (dragStart.y - mouse.y) ** 2) <= 5) // Only if there are objects that aren't in a dragging state
                manager.dispatch("click", {mouse: {x: sketch.mouseX, y: sketch.mouseY}});
        })

        window.addEventListener("mousedown", function() {
            manager.setState({
                dragStart: {x: sketch.mouseX, y: sketch.mouseY}
            });
        });

        window.addEventListener("mousemove", function() { // Call MouseDown only after traveling a minimum distance
            const {dragStart, mouse} = manager.setState();
            if (Math.sqrt((dragStart.x - mouse.x) ** 2 + (dragStart.y - mouse.y) ** 2) > 5)
                if (!manager.setState().dragObjects.find(i => i.isDragging))
                    manager.dispatch("mouseDown", {
                        mouse
                    });
        });

        window.addEventListener("mouseup", function() {
            manager.dispatch("mouseUp", {
                mouseDown: true
            })
        });
    }

    sketch.draw = function () {
        sketch.background(getColour(Colour.Background));

        const {board} = manager.setState({
            mouse: {
                x: sketch.mouseX,
                y: sketch.mouseY
            },
            mouseDown: sketch.mouseIsPressed
        });

        board.render(sketch);
        board.update(sketch);

        RenderObject.tick(sketch);
        RenderObject.draw(sketch);
    }
});

export type coords = [number, number];
export type boundary = [coords, coords];
