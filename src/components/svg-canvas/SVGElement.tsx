import React, { useState } from "react";
import { Position } from "./common";
import { importedSVG, SVGImporter } from "../utils/SVGImporter";

export enum SvgType {
    rect = "rect",
    ellipse = "ellipse",
    imported = "imported"
}

export interface SVGElementInterface {
    type: SvgType;
    id: string;
    position: Position;
    fill?: string;
    zIndex?: number;
    rotation?: number;
}

export interface WidthHeightSizeable {
    width: number;
    height: number;
}

export interface RectSVGElement extends SVGElementInterface, WidthHeightSizeable {
    type: SvgType.rect;
}

export interface EllipseSVGElement extends SVGElementInterface {
    type: SvgType.ellipse;
    rx: number;
    ry: number;
}

export interface ImportedSVGElement extends SVGElementInterface, WidthHeightSizeable {
    type: SvgType.imported;
    svg: importedSVG;
}

interface SVGElementProps {
    element: SVGElementInterface;
    onMouseDownCallback: (event, id: string) => void;
    onMouseClickCallback: (id: string) => void;
}

interface SVGElementState {
    strokeWidth: number;
}

function useSVGElement() {
    const [strokeWidth, setStrokeWidth] = useState(0);

    const setShowDragable = function (isDragable: boolean) {
        setStrokeWidth(isDragable ? 3 : 0);
    };

    return {
        strokeWidth,
        setShowDragable: setShowDragable
    };
}

export function SVGElement(props: SVGElementProps) {
    const { type, id, fill, position = { x: 0, y: 0 }, rotation = 0 } = props.element;
    const { onMouseDownCallback, onMouseClickCallback } = props;

    const { strokeWidth, setShowDragable } = useSVGElement();

    switch (type) {
        case SvgType.rect: {
            const { width, height } = props.element as RectSVGElement;
            return (
                <rect
                    width={width}
                    height={height}
                    fill={fill}
                    stroke={"rgb(0,0,0)"}
                    strokeWidth={strokeWidth}
                    onMouseEnter={() => setShowDragable(true)}
                    onMouseLeave={() => setShowDragable(false)}
                    onClick={(event) => {
                        event.stopPropagation();
                        onMouseClickCallback(id);
                    }}
                    transform={`translate(${position.x} ${position.y}) rotate(${rotation} ${width / 2} ${height / 2})`}
                    onMouseDown={(event) => {
                        onMouseDownCallback(event, id);
                    }}
                />
            );
        }

        case SvgType.ellipse: {
            const { rx, ry } = props.element as EllipseSVGElement;
            return (
                <ellipse
                    rx={rx}
                    ry={ry}
                    stroke={"rgb(0,0,0)"}
                    strokeWidth={strokeWidth}
                    onMouseEnter={() => setShowDragable(true)}
                    onMouseLeave={() => setShowDragable(false)}
                    transform={`translate(${position.x} ${position.y}) rotate(${rotation})`}
                    fill={fill}
                    onMouseDown={(event) => {
                        onMouseDownCallback(event, id);
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        onMouseClickCallback(id);
                    }}
                />
            );
        }

        case SvgType.imported: {
            const { width, height, svg } = props.element as ImportedSVGElement;

            return (
                <g
                    stroke={"rgb(0,0,0)"}
                    strokeWidth={strokeWidth}
                    onMouseEnter={() => setShowDragable(true)}
                    onMouseLeave={() => setShowDragable(false)}
                    onClick={(event) => {
                        event.stopPropagation();
                        onMouseClickCallback(id);
                    }}
                    transform={`translate(${position.x} ${position.y}) rotate(${rotation} ${width / 2} ${height / 2})`}
                    onMouseDown={(event) => {
                        onMouseDownCallback(event, id);
                    }}
                >
                    <SVGImporter type={svg} dimensions={{ width, height }} />
                </g>
            );
        }
    }
}
