import { generateUUID } from "../utils/uuid";
import { EllipseSVGElement, ImportedSVGElement, RectSVGElement, SVGElementInterface, svgType } from "./SVGElement";
import { importedSVG } from "../utils/SVGImporter";

export const demoShapes: SVGElementInterface[] = [
    {
        id: generateUUID(),
        type: svgType.rect,
        width: 450,
        height: 450,
        fill: "#40dcff",
        rotation: 0,
        position: {
            x: 0,
            y: 0
        },
        zIndex: 0
    } as RectSVGElement,
    {
        id: generateUUID(),
        type: svgType.ellipse,
        position: {
            x: 206,
            y: 120
        },
        rotation: 25,
        rx: 100,
        ry: 100,
        fill: "#ffff00",
        zIndex: 1
    } as EllipseSVGElement,
    {
        id: generateUUID(),
        type: svgType.rect,
        width: 300,
        height: 300,
        fill: "#adad9a",
        rotation: 45,
        position: {
            x: 54,
            y: 287
        },
        zIndex: 2
    } as RectSVGElement,
    {
        id: generateUUID(),
        type: svgType.rect,
        width: 50,
        height: 50,
        fill: "#ffffff",
        rotation: 45,
        position: {
            x: 179,
            y: 235
        },
        zIndex: 3
    } as RectSVGElement,
    {
        id: generateUUID(),
        type: svgType.rect,
        width: 25,
        height: 25,
        fill: "#ffffff",
        rotation: 45,
        position: {
            x: 215,
            y: 253
        },
        zIndex: 4
    } as RectSVGElement,
    {
        id: generateUUID(),
        type: svgType.rect,
        width: 25,
        height: 25,
        fill: "#ffffff",
        rotation: 45,
        position: {
            x: 166,
            y: 255
        },
        zIndex: 5
    } as RectSVGElement,
    {
        id: generateUUID(),
        type: svgType.imported,
        position: {
            x: 149,
            y: 91
        },
        svg: importedSVG.rider,
        width: 100,
        height: 200,
        zIndex: 6
    } as ImportedSVGElement,
    {
        id: generateUUID(),
        type: svgType.imported,
        position: {
            x: 0,
            y: 0
        },
        svg: importedSVG.qrCode,
        width: 100,
        height: 100,
        zIndex: 6
    } as ImportedSVGElement
];
