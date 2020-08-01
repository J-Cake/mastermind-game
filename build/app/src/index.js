"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var p5 = require("p5");
var app = new p5(function (sketch) {
    sketch.setup = function () {
        sketch.createCanvas(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", function () {
            sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        });
    };
    sketch.draw = function () {
        sketch.background(0, 0, 0);
    };
});
//# sourceMappingURL=index.js.map