import { generateUUID } from "../utils/uuid";
import { EllipseSVGElement, RectSVGElement, svgType, SVGElementInterface } from "./SVGElement";

export const demoShapes: SVGElementInterface[] = [
    {
        id: generateUUID(),
        type: svgType.rect,
        width: 100,
        height: 100,
        fill: "red",
        rotation: 45,
        position: {
            x: 64,
            y: 72
        }
    } as RectSVGElement,
    {
        id: generateUUID(),
        type: svgType.rect,
        width: 50,
        height: 400,
        fill: "blue",
        position: {
            x: 287,
            y: 13
        }
    } as RectSVGElement,
    {
        id: generateUUID(),
        type: svgType.ellipse,
        position: {
            x: 210,
            y: 206
        },
        rotation: 25,
        rx: 60,
        ry: 60,
        fill: "green"
    } as EllipseSVGElement
];
