import * as p5 from 'p5';

export default abstract class RenderObject {
    private static objs: RenderObject[] = [];

    constructor() {
        RenderObject.objs.push(this);
    }

    public static draw(sketch: p5): void {
        for (const obj of RenderObject.objs)
            obj.render(sketch);
    }

    public static tick(): void {
        for (const obj of RenderObject.objs)
            obj.update();
    }

    protected abstract render(sketch: p5): void;
    protected abstract update(): void;
}