"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.use(express.static(process.cwd() + "/build/final"));
var port = Number(process.argv[2] || "3500");
app.listen(port, function () {
    console.log('listening on port', port);
});
//# sourceMappingURL=server.js.map