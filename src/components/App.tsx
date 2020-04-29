import React, { useState } from "react";
import "./App.css";
import { SVGCanvas } from "./svg-canvas/SVGCanvas";
import { Toolbox } from "./Toolbox/Toolbox";
import { CreateNewObject } from "./utils/createNewObject";
import { DndContext } from "./utils/DragAndDrop/DndContext";

export interface CanvasProperties {
    width: number;
    height: number;
}

function onDragendFn(props) {
    console.log(props);
}

export function App() {
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
    const [activeShapes, setActiveShapes] = useState([]);
    const [, setCanvasMouseCoords] = useState({ x: 0, y: 0 });
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

    // const onDragEnd = (result: DropResult) => {
    //     if (!result.destination) return;
    //     const id = result.draggableId;
    //     const item = items.find((p) => p.id === id);
    //     const newItem = CreateNewObject(item.type, item.svg);
    //     newItem.position.x = canvasMouseCoords.x;
    //     newItem.position.y = canvasMouseCoords.y;
    //     setActiveShapes([...activeShapes, newItem]);
    // };

    // const getClone = () => (provided, snapshot) => {
    //     return (
    //         <React.Fragment>
    //             <div
    //                 {...provided.draggableProps}
    //                 {...provided.dragHandleProps}
    //                 ref={provided.innerRef}
    //                 style={{
    //                     border: "1px dashed #000000",
    //                     width: "300px",
    //                     height: "200px",
    //                     ...provided.draggableProps.style
    //                 }}
    //                 className={snapshot.isDragging ? "dragging" : ""}
    //             />
    //         </React.Fragment>
    //     );
    // };

    return (
        <DndContext onDragEnd={onDragendFn}>
            <div className="app">
                <div style={{ position: "relative", display: "flex", height: "100%", width: "100vw" }}>
                    <Toolbox onElementClick={onElementClick} />

                    <SVGCanvas
                        width={canvasDimensions.width}
                        height={canvasDimensions.height}
                        shapes={activeShapes}
                        onMouseDropCoordsChange={setCanvasMouseCoords}
                        updateCanvasWidth={updateCanvasWidth}
                        updateCanvasHeight={updateCanvasHeight}
                    />
                </div>
            </div>
        </DndContext>
    );
}
