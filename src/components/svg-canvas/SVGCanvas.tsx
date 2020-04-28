import React, { MouseEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { EllipseSVGElement, SVGElement, SVGElementInterface, svgType } from "./SVGElement";
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
enum ShapeMode {
    move = "MOVE",
    edit = "EDIT"
}
interface CanvasState {
    shapes: SVGElementInterface[];
    hoveredOnShapeShapeId: string;
    selectedShapeId: string;
    lastMouseCoords: Position;
    offset: { x: number; y: number };
    snap: number;
    mode: ShapeMode;
}

function sortShapesByZIndex(shapes: SVGElementInterface[]): SVGElementInterface[] {
    return shapes.sort((s1, s2) => s1.zIndex - s2.zIndex);
}

function useSVGCanvas(props: SVGCanvasProps, ref: MutableRefObject<HTMLElement>) {
    const [state, setState] = useState<CanvasState>({
        shapes: [],
        hoveredOnShapeShapeId: null,
        selectedShapeId: null,
        lastMouseCoords: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        snap: 1,
        mode: ShapeMode.move
    });

    useEffect(() => {
        setState({
            shapes: [...state.shapes, ...props.shapes.filter((p) => !state.shapes.find((s) => s.id === p.id))],
            hoveredOnShapeShapeId: null,
            selectedShapeId: null,
            lastMouseCoords: { x: 0, y: 0 },
            offset: { x: 0, y: 0 },
            snap: 1,
            mode: ShapeMode.move
        });
    }, [props.shapes]);

    const onMouseMoveHandler = function (event: MouseEvent) {
        const mouseCoords = getCanvasMouseCoords(ref, event);
        if (!state.hoveredOnShapeShapeId) {
            setState({ ...state, lastMouseCoords: mouseCoords });
            return;
        }

        let offset = state.offset;

        const updatedShapes = state.shapes.map((s) => {
            if (s.id !== state.hoveredOnShapeShapeId) {
                return s;
            }

            const snap = state.snap;

            const deltaX = mouseCoords.x - state.lastMouseCoords.x;
            const deltaY = mouseCoords.y - state.lastMouseCoords.y;
            offset = { x: state.offset.x + deltaX, y: state.offset.y + deltaY };

            let newX = s.position.x;
            let newY = s.position.y;

            const integerX = Math.trunc(offset.x / snap);
            const integerY = Math.trunc(offset.y / snap);

            if (integerX) {
                newX = newX + integerX * snap;
                offset.x = offset.x % snap;
            }
            if (integerY) {
                newY = newY + integerY * snap;
                offset.y = offset.y % snap;
            }

            if (state.mode == ShapeMode.move) {
                return { ...s, position: { x: newX, y: newY } };
            }

            if (mouseCoords === state.lastMouseCoords) {
                return;
            }

            if (s.type === svgType.ellipse) {
                const ellipse = s as EllipseSVGElement;
                const width = 2 * ellipse.rx + newX - s.position.x;
                const height = 2 * ellipse.ry + newY - s.position.y;
                ellipse.rx = Math.abs(width) / 2;
                ellipse.ry = Math.abs(height) / 2;
                return { ...ellipse };
            } else {
                const width = s.width + newX - s.position.x;
                const height = s.height + newY - s.position.y;
                s.width = Math.abs(width);
                s.height = Math.abs(height);
                return { ...s };
            }
        });

        setState({
            ...state,
            offset,
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

function getSelectedShapeInfo(selectedShape: SVGElementInterface) {
    if (selectedShape === null) {
        return {
            width: 0,
            height: 0,
            rotation: 0,
            positionX: 0,
            positionY: 0
        };
    }

    if (selectedShape.type === svgType.ellipse) {
        const ellipse = selectedShape as EllipseSVGElement;
        return {
            width: 2 * ellipse.rx,
            height: 2 * ellipse.ry,
            rotation: ellipse.rotation,
            positionX: ellipse.position.x - ellipse.rx,
            positionY: ellipse.position.y - ellipse.ry
        };
    }
    return {
        width: selectedShape.width,
        height: selectedShape.height,
        rotation: selectedShape.rotation,
        positionX: selectedShape.position.x,
        positionY: selectedShape.position.y
    };
}

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
                setState({ ...state, selectedShapeId: id, mode: ShapeMode.move });
            }}
            onMouseDownCallback={(event: MouseEvent, id) => {
                setState({ ...state, hoveredOnShapeShapeId: id });
            }}
        />
    ));

    const selectedShape = state.selectedShapeId && state.shapes.find((s) => s.id === state.selectedShapeId);
    const selecteShapeInfo = getSelectedShapeInfo(selectedShape);
    return (
        <>
            <div style={{ width: "180px" }}>
                <div style={{ fontSize: "16px", marginBottom: "10px" }}>
                    <label style={{ display: "block" }}>Snapping increment</label>
                    <select
                        style={{ display: "block" }}
                        onChange={(event) => {
                            setState({ ...state, snap: Number(event.target.value) });
                        }}
                    >
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                    </select>
                </div>
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
                onMouseUp={() => setState({ ...state, hoveredOnShapeShapeId: null, offset: { x: 0, y: 0 } })}
                onClick={() => setState({ ...state, selectedShapeId: null })}
                onMouseMove={(event) => {
                    onMouseMoveHandler(event);
                }}
            >
                {svgs}
                <g
                    transform={`translate(${selecteShapeInfo.positionX} ${selecteShapeInfo.positionY}) rotate(${
                        selecteShapeInfo.rotation
                    } ${selecteShapeInfo.width / 2} ${selecteShapeInfo.height / 2})`}
                    onMouseDown={() => {
                        setState({ ...state, hoveredOnShapeShapeId: selectedShape.id, mode: ShapeMode.edit });
                    }}
                    onMouseUp={() =>
                        setState({
                            ...state,
                            hoveredOnShapeShapeId: null,
                            offset: { x: 0, y: 0 },
                            mode: ShapeMode.move
                        })
                    }
                >
                    <line
                        x1="0"
                        y1="0"
                        x2={selecteShapeInfo.width}
                        y2="0"
                        stroke="#808080"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                    />
                    <line
                        x1="0"
                        y1={selecteShapeInfo.height}
                        x2={selecteShapeInfo.width}
                        y2={selecteShapeInfo.height}
                        stroke="#808080"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                    />
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2={selecteShapeInfo.height}
                        stroke="#808080"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                    />
                    <line
                        x1={selecteShapeInfo.width}
                        y1="0"
                        x2={selecteShapeInfo.width}
                        y2={selecteShapeInfo.height}
                        stroke="#808080"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                    />
                    <circle cx="0" cy="0" r="3" stroke="#0000FF" strokeWidth="1" fill="#CCCCFF" />
                    <circle
                        cx={selecteShapeInfo.width}
                        cy="0"
                        r="3"
                        stroke="#0000FF"
                        strokeWidth="1"
                        fill="#CCCCFF"
                        onMouseMove={(event) => onMouseMoveHandler(event)}
                    />
                    <circle cx="0" cy={selecteShapeInfo.height} r="3" stroke="#0000FF" strokeWidth="1" fill="#CCCCFF" />
                    <circle
                        cx={selecteShapeInfo.width}
                        cy={selecteShapeInfo.height}
                        r="3"
                        stroke="#0000FF"
                        strokeWidth="1"
                        fill="#CCCCFF"
                    />
                </g>
            </svg>
            <div style={{ height: "500px", width: "400px", overflow: "auto", background: "white", marginLeft: "10px" }}>
                <PrettyPrintJson data={state} />
            </div>
        </>
    );
}
