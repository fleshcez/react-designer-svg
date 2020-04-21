import React, { MouseEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { SVGElement, SVGElementInterface, svgType } from "./SVGElement";
import { Position } from "./common";
import clsx from "clsx";

import styles from "./SVGCanvas.module.scss";
import { ShapeEditor } from "./ShapeEditor";

const { canvas: canvasClass } = styles;

interface SVGCanvasProps {
    width: number;
    height: number;
    className?: string;
    shapes?: SVGElementInterface[];
}

interface SVGCanvasState {
    shapes: SVGElementInterface[];
    selectedShapeId: string;
}

function getCanvasMouseCoords(canvasRef: MutableRefObject<HTMLElement>, event: MouseEvent): Position {
    const canvasCoords: DOMRect = canvasRef.current && canvasRef.current.getBoundingClientRect();

    const canvasX = canvasCoords?.left;
    const canvasY = canvasCoords?.top;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const mouseInCanvasX = mouseX - canvasX;
    const mouseInCanvasY = mouseY - canvasY;

    return { x: mouseInCanvasX, y: mouseInCanvasY };
}

interface CanvasState {
    shapes: SVGElementInterface[];
    hoveredOnShapeShapeId: string;
    selectedShapeId: string;
    lastMouseCoords: Position;
}

function sortShapesByZIndex(shapes: SVGElementInterface[]): SVGElementInterface[] {
    return shapes.sort((s1, s2) => s1.zIndex - s2.zIndex);
}

function useSVGCanvas(props: SVGCanvasProps, ref: MutableRefObject<HTMLElement>) {
    const [state, setState] = useState<CanvasState>({
        shapes: [],
        hoveredOnShapeShapeId: null,
        selectedShapeId: null,
        lastMouseCoords: { x: 0, y: 0 }
    });

    useEffect(() => {
        setState({
            shapes: props.shapes,
            hoveredOnShapeShapeId: null,
            selectedShapeId: null,
            lastMouseCoords: { x: 0, y: 0 }
        });
    }, []);

    const onMouseMoveHandler = function (event: MouseEvent) {
        const mouseCoords = getCanvasMouseCoords(ref, event);
        if (!state.hoveredOnShapeShapeId) {
            setState({ ...state, lastMouseCoords: mouseCoords });
            return;
        }

        const updatedShapes = state.shapes.map((s) => {
            if (s.id !== state.hoveredOnShapeShapeId) {
                return s;
            }

            const deltaX = mouseCoords.x - state.lastMouseCoords.x;
            const deltaY = mouseCoords.y - state.lastMouseCoords.y;

            return { ...s, position: { x: s.position.x + deltaX, y: s.position.y + deltaY } };
        });

        setState({
            ...state,
            shapes: updatedShapes,
            lastMouseCoords: mouseCoords
        });
    };

    const onUpdateShape = (val) => {
        const updatedShapes = state.shapes.map((s) => {
            if (s.id !== state.selectedShapeId) {
                return s;
            }

            if (s.type === svgType.rect || s.type === svgType.imported) {
                return { ...s, rotation: val.rotation, width: val.width, height: val.height, zIndex: val.zIndex };
            }
            return { ...s, rotation: val.rotation, rx: val.rx, ry: val.ry, zIndex: val.zIndex };
        });
        const sortedByZIndexShapes = sortShapesByZIndex(updatedShapes);

        setState({ ...state, shapes: sortedByZIndexShapes });
    };

    return {
        state,
        setState,
        onMouseMoveHandler,
        onUpdateShape
    };
}

const PrettyPrintJson = (props: { data }) => (
    <div>
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </div>
);

export function SVGCanvas(props: SVGCanvasProps) {
    const { width, height, className } = props;
    const cls = clsx([className, canvasClass]);
    const ref = useRef();

    const { state, setState, onMouseMoveHandler, onUpdateShape } = useSVGCanvas(props, ref);

    const svgs = state.shapes.map((s) => (
        <SVGElement
            key={s.id}
            element={s}
            onMouseClickCallback={(id: string) => {
                setState({ ...state, selectedShapeId: id });
            }}
            onMouseDownCallback={(event: MouseEvent, id) => {
                setState({ ...state, hoveredOnShapeShapeId: id });
            }}
        />
    ));

    const selectedShape = state.selectedShapeId && state.shapes.find((s) => s.id === state.selectedShapeId);

    return (
        <>
            <div style={{ width: "180px" }}>
                {selectedShape && (
                    <ShapeEditor
                        shape={selectedShape}
                        onUpdate={(shapeValues) => {
                            onUpdateShape(shapeValues);
                        }}
                    />
                )}
            </div>
            <svg
                width={`${width}px`}
                height={`${height}px`}
                viewBox={`0 0 ${width} ${height}`}
                className={cls}
                ref={ref}
                onMouseUp={() => setState({ ...state, hoveredOnShapeShapeId: null })}
                onClick={() => setState({ ...state, selectedShapeId: null })}
                onMouseMove={(event) => {
                    onMouseMoveHandler(event);
                }}
            >
                {svgs}
            </svg>
            <div style={{ height: "500px", width: "400px", overflow: "auto", background: "white", marginLeft: "10px" }}>
                <PrettyPrintJson data={state} />
            </div>
        </>
    );
}
