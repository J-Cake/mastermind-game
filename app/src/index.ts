import * as p5 from 'p5';

const app: p5 = new p5(function (sketch) {
    sketch.setup = function () {
        sketch.createCanvas(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", function () {
            sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        });
    }

    sketch.draw = function () {
        sketch.background(0, 0, 0);
    }
});