import {manager} from "./index";

enum Colour {
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
    Blank,
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
        [Colour.White]: [245, 245, 245],
        [Colour.Black]: [25, 25, 25],
        [Colour.Panel]: [235, 235, 235],
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

export function getColour(colour: Colour): [number, number, number] {
    const colours: Record<Colour, [number, number, number]> = themes[manager.setState().theme]();

    return colours[colour];
}

export function darken(colour: Colour, amount: number): [number, number, number] {
    const darkened: [number, number, number] = getColour(colour);

    return [darkened[0] - amount, darkened[1] - amount, darkened[2] - amount]
}
