enum Colour {
    Red,
    Pink,
    Yellow,
    Orange,
    Green,
    Blue,
    White,
    Black,
    Blank
}

export default Colour;

export function getColour(colour: Colour): [number, number, number] {
    const colours: Record<Colour, [number, number, number]> = {
        [Colour.Red]: [224, 4, 25],
        [Colour.Blue]: [66, 135, 245],
        [Colour.Orange]: [255, 106, 0],
        [Colour.Green]: [0, 252, 155],
        [Colour.Yellow]: [252, 227, 0],
        [Colour.Pink]: [245, 56, 201],
        [Colour.White]: [245, 245, 245],
        [Colour.Black]: [25, 25, 25],
        [Colour.Blank]: [60, 65, 70],
    };

    return colours[colour];
}

export function darken(colour: Colour, amount: number): [number, number, number] {
    const darkened: [number, number, number] = getColour(colour);

    return [darkened[0] - amount, darkened[1] - amount, darkened[2] - amount]
}
