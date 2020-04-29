import React from "react";
import styles from "./Toolbox.module.scss";
import { svgType } from "../svg-canvas/SVGElement";
import { importedSVG } from "../utils/SVGImporter";
import { DragSource } from "../utils/DragAndDrop/DragSource";

interface ToolboxProps {
    onElementClick(type: string, svg: string);
}

const { toolbox: toolBoxClass, list: listClass, listElement } = styles;
export const items = [
    { id: "1", type: svgType.rect, description: "Rectangular", svg: "" },
    { id: "2", type: svgType.ellipse, description: "Ellipse", svg: "" },
    { id: "3", type: svgType.imported, description: "Rider", svg: importedSVG.rider },
    { id: "4", type: svgType.imported, description: "QrCode", svg: importedSVG.qrCode }
];

export const Toolbox = () => {
    return (
        <div className={toolBoxClass}>
            <h1>ToolBox</h1>
            <ul className={listClass}>
                {items.map((item) => {
                    return (
                        <DragSource key={item.id}>
                            {(provided) => {
                                return (
                                    <li
                                        className={listElement}
                                        key={item.id}
                                        // onClick={() => props.onElementClick(item.type, item.svg)}
                                        ref={provided.getElementRef}
                                    >
                                        {item.description}
                                    </li>
                                );
                            }}
                        </DragSource>
                    );
                })}
            </ul>
        </div>
    );
};
