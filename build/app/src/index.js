"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var p5 = require("p5");
var RenderObject_1 = require("./RenderObject");
var GameManager_1 = require("./GameManager");
var app = new p5(function (sketch) {
    var manager = new GameManager_1.default();
    sketch.setup = function () {
        sketch.createCanvas(window.innerWidth, window.innerHeight);
        window.addEventListener("resize", function () {
            sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        });
        manager.initBoard();
    };
    sketch.draw = function () {
        RenderObject_1.default.tick();
        RenderObject_1.default.draw(sketch);
    };
});
//# sourceMappingURL=index.js.map