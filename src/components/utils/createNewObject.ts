import { EllipseSVGElement, ImportedSVGElement, RectSVGElement, svgType } from "../svg-canvas/SVGElement";
import { generateUUID } from "./uuid";
import { importedSVG } from "./SVGImporter";

export function CreateNewObject(type: string, svg: string) {
    if (type === null) {
        return;
    }
    switch (type) {
        case svgType.rect:
            return {
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
            } as RectSVGElement;
        case svgType.ellipse:
            return {
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
            } as EllipseSVGElement;
        case svgType.imported:
            if (svg === importedSVG.rider) {
                return {
                    id: generateUUID(),
                    type: svgType.imported,
                    position: {
                        x: 149,
                        y: 91
                    },
                    svg: importedSVG.rider,
                    width: 100,
                    height: 200,
                    zIndex: 6,
                    rotation: 0
                } as ImportedSVGElement;
            } else if (svg === importedSVG.qrCode) {
                return {
                    id: generateUUID(),
                    type: svgType.imported,
                    position: {
                        x: 149,
                        y: 91
                    },
                    svg: importedSVG.qrCode,
                    width: 100,
                    height: 200,
                    zIndex: 6,
                    rotation: 0
                } as ImportedSVGElement;
            }
    }
}
