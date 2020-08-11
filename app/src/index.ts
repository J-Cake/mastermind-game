import * as p5 from 'p5';
import RenderObject from './RenderObject';
import StateManager from "./stateManager";
import Board from "./Board";
import DragObject from "./DragObject";
import DropObject from "./DropObject";
import PinRack from "./PinRack";
import Colour, {getColour, Theme} from "./Colour";
import ThemeSwitcher from "./ThemeSwitcher";
import GameStateIndicator from "./GameStateIndicator";

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
    themeSwitcher: ThemeSwitcher,
    font: p5.Font,
    indicator: GameStateIndicator
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

        manager.setState({
            board: new Board(),
            pinRack: new PinRack(),
            themeSwitcher: new ThemeSwitcher(),
            // font: sketch.loadFont("./montserrat.ttf"),
            indicator: new GameStateIndicator()
        });

        window.addEventListener("resize", function () {
            sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        });

        window.addEventListener("click", function () {
            const {dragStart, mouse} = manager.setState();
            if (Math.sqrt((dragStart.x - mouse.x) ** 2 + (dragStart.y - mouse.y) ** 2) <= 5) // Only if there are objects that aren't in a dragging state
                manager.dispatch("click", {mouse: {x: sketch.mouseX, y: sketch.mouseY}});
        })

        window.addEventListener("mousedown", function () {
            manager.setState({
                dragStart: {x: sketch.mouseX, y: sketch.mouseY}
            });
        });

        window.addEventListener("mousemove", function () { // Call MouseDown only after traveling a minimum distance
            const {dragStart, mouse} = manager.setState();
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

        manager.on("restart", function () {
            manager.setState({
                board: new Board(),
                pinRack: new PinRack(),
                themeSwitcher: new ThemeSwitcher(),
                // font: sketch.loadFont("./montserrat.ttf"),
                indicator: new GameStateIndicator()
            });
        });
    }

    sketch.draw = function () {
        sketch.background(getColour(Colour.Background));

        manager.setState({
            mouse: {
                x: sketch.mouseX,
                y: sketch.mouseY
            },
            mouseDown: sketch.mouseIsPressed
        });

        const board = manager.setState().board;

        board.render(sketch);
        board.update(sketch);

        RenderObject.tick(sketch);
        RenderObject.draw(sketch);

        manager.setState().indicator.render(sketch);
        manager.setState().indicator.update(sketch);
    }
});
