import StateManager from "./stateManager";
import Board from "./board";

export interface State {
    board: Board
}

export default class GameManager {
    state: StateManager<State>;

    constructor() {
        this.state = new StateManager<State>({});
    }

    initBoard() {
        this.state.setState({
            board: new Board()
        });
    }
}