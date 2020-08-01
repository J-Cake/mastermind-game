import * as express from 'express';

const app = express();

app.use(express.static(process.cwd() + "/build/final"));

const port = Number(process.argv[2] || "3500")

app.listen(port, function() {
    console.log('listening on port', port);
})