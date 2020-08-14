import {manager} from "./index";
import {Interpolation, map, constrain} from "./interpolation";
import interpolate from "./interpolation";

enum Colour {
    Blank,
    Red,
    Pink,
    Yellow,
    Orange,
    Green,
    Blue,
    White,
    Black,
    Panel,
    Background,
    Win,
    Lose
}

export default Colour;

export enum Theme {
    Light,
    Dark
}

const themes: Record<Theme, () => Record<Colour, [number, number, number]>> = {
    [Theme.Light]: () => ({
        [Colour.Red]: [224, 4, 25],
        [Colour.Blue]: [66, 135, 245],
        [Colour.Orange]: [255, 106, 0],
        [Colour.Green]: [0, 210, 35],
        [Colour.Yellow]: [235, 210, 0],
        [Colour.Pink]: [245, 56, 201],
        [Colour.White]: [255, 255, 255],
        [Colour.Black]: [25, 25, 25],
        [Colour.Panel]: [225, 225, 225],
        [Colour.Background]: [255, 255, 255],
        [Colour.Blank]: [60, 65, 70],
        [Colour.Win]: [15, 188, 100],
        [Colour.Lose]: [188, 15, 101]
    }),
    [Theme.Dark]: () => ({
        [Colour.Red]: [224, 4, 25],
        [Colour.Blue]: [66, 135, 245],
        [Colour.Orange]: [255, 106, 0],
        [Colour.Green]: [0, 210, 35],
        [Colour.Yellow]: [235, 210, 0],
        [Colour.Pink]: [245, 56, 201],
        [Colour.White]: [245, 245, 245],
        [Colour.Black]: [25, 25, 25],
        [Colour.Panel]: [60, 65, 70],
        [Colour.Background]: [25, 30, 35],
        [Colour.Blank]: [235, 235, 235],
        [Colour.Win]: [15, 188, 100],
        [Colour.Lose]: [188, 15, 101]
    })
}

export type rgb = [number, number, number];

export function interpolateColour(frame: number, endFrame: number, colour1: rgb, colour2: rgb, interpolationType: Interpolation = Interpolation.linear): rgb {
    const startFrame: number = manager.setState().switchFrame;
    return [
        constrain(map(interpolate(frame, startFrame, endFrame, interpolationType), startFrame, endFrame, colour1[0], colour2[0]), colour1[0], colour2[0]),
        constrain(map(interpolate(frame, startFrame, endFrame, interpolationType), startFrame, endFrame, colour1[2], colour2[1]), colour1[1], colour2[1]),
        constrain(map(interpolate(frame, startFrame, endFrame, interpolationType), startFrame, endFrame, colour1[2], colour2[2]), colour1[2], colour2[2]),
    ];
}

export function getColour(colour: Colour, interpolation?: {duration: number, type?: Interpolation}): rgb {
    const colours: Record<Colour, rgb> = themes[manager.setState().themes.last()]();

    if (interpolation) { // colour interpolation - smooth transition between colours.
        const prevColours: () => Record<Colour, rgb> = themes[manager.setState().themes.last(1)];
        if (!prevColours)
            return colours[colour];
        else
            return interpolateColour(manager.setState().frame, manager.setState().switchFrame + interpolation.duration, prevColours()[colour], colours[colour], interpolation.type);
    } else return colours[colour];
}

export function darken(colour: Colour, amount: number): rgb {
    const darkened: rgb = getColour(colour);

    return [darkened[0] - amount, darkened[1] - amount, darkened[2] - amount]
}
