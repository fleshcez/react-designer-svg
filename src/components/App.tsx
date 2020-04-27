import React, { useState } from "react";
import "./App.css";
import { SVGCanvas } from "./svg-canvas/SVGCanvas";
import { CanvasSettings } from "./canvas-settings/CanvasSettings";
import { items, Toolbox } from "./Toolbox/Toolbox";
import { CreateNewObject } from "./utils/createNewObject";
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot, DropResult } from "react-beautiful-dnd";

export interface CanvasProperties {
    width: number;
    height: number;
}
export function App() {
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
    const [activeShapes, setActiveShapes] = useState([]);
    const [canvasMouseCoords, setCanvasMouseCoords] = useState({ x: 0, y: 0 });
    const updateCanvasWidth = (width: number) => {
        setCanvasDimensions((prev) => {
            return { width: width, height: prev.height };
        });
    };

    const updateCanvasHeight = (height: number) => {
        setCanvasDimensions((prev) => {
            return { width: prev.width, height: height };
        });
    };

    const onElementClick = (type: string, svg: string) => {
        const newObject = CreateNewObject(type, svg);
        setActiveShapes([...activeShapes, newObject]);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const id = result.draggableId;
        const item = items.find((p) => p.id === id);
        const newItem = CreateNewObject(item.type, item.svg);
        newItem.position.x = canvasMouseCoords.x;
        newItem.position.y = canvasMouseCoords.y;
        setActiveShapes([...activeShapes, newItem]);
    };

    const getClone = () => (provided, snapshot) => {
        return (
            <React.Fragment>
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={{
                        border: "1px dashed #000000",
                        width: "300px",
                        height: "200px",
                        ...provided.draggableProps.style
                    }}
                    className={snapshot.isDragging ? "dragging" : ""}
                />
            </React.Fragment>
        );
    };

    return (
        <DragDropContext onDragEnd={(result: DropResult) => onDragEnd(result)}>
            <div className="app">
                <Droppable droppableId="canvas" renderClone={getClone()}>
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                        <div ref={provided.innerRef} style={{ position: "relative", display: "flex", height: "100%" }}>
                            <Toolbox onElementClick={onElementClick} droppableSnapshot={snapshot} />
                            <SVGCanvas
                                width={canvasDimensions.width}
                                height={canvasDimensions.height}
                                shapes={activeShapes}
                                onMouseDropCoordsChange={setCanvasMouseCoords}
                                updateCanvasWidth={updateCanvasWidth}
                                updateCanvasHeight={updateCanvasHeight}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}
