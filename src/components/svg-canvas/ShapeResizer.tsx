import React, { FunctionComponent } from "react";
import { EllipseSVGElement, SVGElementInterface, svgType } from "./SVGElement";
import RotationArrow from "../../assets/replay.svg";

interface ShapeResizerProps {
    selectedShape: SVGElementInterface;
    onMouseDownCallback: () => void;
    onMouseMove: (event) => void;
    onMouseDownRotate: () => void;
}

function useSelectedShape(shape: SVGElementInterface) {
    if (shape === null) {
        return {
            width: 0,
            height: 0,
            rotation: 0,
            positionX: 0,
            positionY: 0
        };
    }
    if (shape.type === svgType.ellipse) {
        const ellipse = shape as EllipseSVGElement;
        return {
            width: 2 * ellipse.rx,
            height: 2 * ellipse.ry,
            rotation: ellipse.rotation,
            positionX: ellipse.position.x - ellipse.rx,
            positionY: ellipse.position.y - ellipse.ry
        };
    }
    return {
        width: shape.width,
        height: shape.height,
        rotation: shape.rotation,
        positionX: shape.position.x,
        positionY: shape.position.y
    };
}

const ShapeResizer: FunctionComponent<ShapeResizerProps> = (props: ShapeResizerProps) => {
    const { selectedShape, onMouseDownCallback, onMouseMove, onMouseDownRotate } = props;
    const { width, height, rotation, positionX, positionY } = useSelectedShape(selectedShape);
    return (
        <g transform={`translate(${positionX} ${positionY}) rotate(${rotation} ${width / 2} ${height / 2})`}>
            <line x1="0" y1="0" x2={width} y2="0" stroke="#808080" strokeWidth="3" strokeDasharray="5,5" />
            <line x1="0" y1={height} x2={width} y2={height} stroke="#808080" strokeWidth="3" strokeDasharray="5,5" />
            <line x1="0" y1="0" x2="0" y2={height} stroke="#808080" strokeWidth="3" strokeDasharray="5,5" />
            <line x1={width} y1="0" x2={width} y2={height} stroke="#808080" strokeWidth="3" strokeDasharray="5,5" />
            <circle
                cx={width}
                cy="0"
                r="3"
                stroke="#0000FF"
                strokeWidth="3"
                fill="#CCCCFF"
                onMouseMove={(event) => onMouseMove(event)}
                onMouseDown={() => {
                    onMouseDownCallback();
                }}
            />
            <circle
                cx={width}
                cy={height}
                r="3"
                stroke="#0000FF"
                strokeWidth="3"
                fill="#CCCCFF"
                onMouseMove={(event) => onMouseMove(event)}
                onMouseDown={() => {
                    onMouseDownCallback();
                }}
            />
            {selectedShape !== null && (
                <image
                    width="20px"
                    height="20px"
                    onMouseDown={() => onMouseDownRotate()}
                    onMouseMove={(event) => onMouseMove(event)}
                    x={width + 5}
                    y="0px"
                    href={RotationArrow}
                />
            )}
        </g>
    );
};

export default ShapeResizer;
