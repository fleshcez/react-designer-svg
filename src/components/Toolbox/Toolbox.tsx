import React from "react";
import styles from "./Toolbox.module.scss";
import { svgType } from "../svg-canvas/SVGElement";
import { importedSVG } from "../utils/SVGImporter";
import { Draggable, DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from "react-beautiful-dnd";

interface ToolboxProps {
    onElementClick(type: string, svg: string);
    droppableSnapshot: DroppableStateSnapshot;
}
const { toolbox: toolBoxClass, listElement: listElementClass, list: listClass } = styles;
export const items = [
    { id: "1", type: svgType.rect, description: "Rectangular", svg: "" },
    { id: "2", type: svgType.ellipse, description: "Ellipse", svg: "" },
    { id: "3", type: svgType.imported, description: "Rider", svg: importedSVG.rider },
    { id: "4", type: svgType.imported, description: "QrCode", svg: importedSVG.qrCode }
];

export const Toolbox = (props: ToolboxProps) => {
    return (
        <div className={toolBoxClass}>
            <h1>ToolBox</h1>
            <ul className={listClass}>
                {items.map((item, index) => {
                    const shouldRenderClone = item.id === props.droppableSnapshot.draggingFromThisWith;

                    return shouldRenderClone ? (
                        <li className={listElementClass}>{item.description}</li>
                    ) : (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(draggableProvided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                <li
                                    className={snapshot.isDragging ? "dragging" : listElementClass}
                                    key={item.id}
                                    onClick={() => props.onElementClick(item.type, item.svg)}
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                    style={
                                        snapshot.isDragging
                                            ? {
                                                  border: "1px dashed #000000",
                                                  width: "300px",
                                                  height: "200px",
                                                  ...draggableProvided.draggableProps.style
                                              }
                                            : {}
                                    }
                                >
                                    {snapshot.isDragging ? "" : item.description}
                                </li>
                            )}
                        </Draggable>
                    );
                })}
            </ul>
        </div>
    );
};
