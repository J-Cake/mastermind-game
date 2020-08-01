import * as p5 from 'p5';
import RenderObject from './RenderObject';
import Board from './board';
import GameManager from './GameManager';

const app: p5 = new p5(function (sketch) {

    const manager: GameManager = new GameManager();

    sketch.setup = function () {
        sketch.createCanvas(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", function () {
            sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        });

        manager.initBoard();
    }

    sketch.draw = function () {
        RenderObject.tick();
        RenderObject.draw(sketch);
    }
});