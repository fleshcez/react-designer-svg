import { EllipseSVGElement, ImportedSVGElement, RectSVGElement, SvgType } from "../svg-canvas/SVGElement";
import { generateUUID } from "./uuid";
import { importedSVG } from "./SVGImporter";
import { ElementPosition } from "./DragAndDrop/Dnd.hooks";
import { ToolboxItem } from "../Toolbox/Toolbox.model";

export function createNewObject(payload: ToolboxItem, { left, top }: ElementPosition) {
    const { type, svg } = payload;
    if (type === null) {
        return;
    }
    switch (type) {
        case SvgType.rect:
            return {
                id: generateUUID(),
                type: SvgType.rect,
                width: 100,
                height: 100,
                fill: "#40dcff",
                rotation: 0,
                position: {
                    x: left,
                    y: top
                },
                zIndex: 0
            } as RectSVGElement;
        case SvgType.ellipse:
            const radius = {
                rx: 50,
                ry: 50
            };
            return {
                id: generateUUID(),
                type: SvgType.ellipse,
                position: {
                    x: left + radius.rx,
                    y: top + radius.ry
                },
                rotation: 25,
                fill: "#ffff00",
                zIndex: 0,
                ...radius
            } as EllipseSVGElement;
        case SvgType.imported:
            if (svg === importedSVG.rider) {
                return {
                    id: generateUUID(),
                    type: SvgType.imported,
                    position: {
                        x: left,
                        y: top
                    },
                    svg: importedSVG.rider,
                    width: 100,
                    height: 100,
                    zIndex: 6,
                    rotation: 0
                } as ImportedSVGElement;
            } else if (svg === importedSVG.qrCode) {
                return {
                    id: generateUUID(),
                    type: SvgType.imported,
                    position: {
                        x: left,
                        y: top
                    },
                    svg: importedSVG.qrCode,
                    width: 100,
                    height: 100,
                    zIndex: 6,
                    rotation: 0
                } as ImportedSVGElement;
            }
    }
}
