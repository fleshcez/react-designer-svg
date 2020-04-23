import React, { useState } from "react";
import "./App.css";
import { SVGCanvas } from "./svg-canvas/SVGCanvas";
import { CanvasSettings } from "./canvas-settings/CanvasSettings";
import { items, Toolbox } from "./Toolbox/Toolbox";
import { CreateNewObject } from "./utils/createNewObject";
import { DragDropContext, Droppable, DroppableProvided, DropResult } from "react-beautiful-dnd";

export interface CanvasProperties {
    width: number;
    height: number;
}
export function App() {
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
    const [activeShapes, setActiveShapes] = useState([]);

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
        setActiveShapes([...activeShapes, newItem]);
    };

    return (
        <DragDropContext onDragEnd={(result: DropResult) => onDragEnd(result)}>
            <div className="app">
                <CanvasSettings
                    updateCanvasWidth={updateCanvasWidth}
                    updateCanvasHeight={updateCanvasHeight}
                    currentDimensions={canvasDimensions}
                />
                <Droppable droppableId="canvas">
                    {(provided: DroppableProvided) => (
                        <div ref={provided.innerRef} style={{ position: "relative", display: "flex", height: "100%" }}>
                            <Toolbox onElementClick={onElementClick} />
                            <SVGCanvas
                                width={canvasDimensions.width}
                                height={canvasDimensions.height}
                                shapes={activeShapes}
                            />
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}
