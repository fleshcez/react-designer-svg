import React from "react";
import styles from "./Toolbox.module.scss";
import { SvgType } from "../svg-canvas/SVGElement";
import { importedSVG } from "../utils/SVGImporter";
import { DragSource } from "../utils/DragAndDrop/DragSource";
import { ToolboxItem } from "./Toolbox.model";

interface ToolboxProps {
    onElementClick(item: ToolboxItem);
}

const { toolbox: toolBoxClass, list: listClass, listElement } = styles;
export const items: ToolboxItem[] = [
    { id: "1", type: SvgType.rect, description: "Rectangular", svg: "" },
    { id: "2", type: SvgType.ellipse, description: "Ellipse", svg: "" },
    { id: "3", type: SvgType.imported, description: "Rider", svg: importedSVG.rider },
    { id: "4", type: SvgType.imported, description: "QrCode", svg: importedSVG.qrCode }
];

export const Toolbox = ({ onElementClick }: ToolboxProps) => {
    return (
        <div className={toolBoxClass}>
            <h1>ToolBox</h1>
            <ul className={listClass}>
                {items.map((item) => {
                    return (
                        <DragSource key={item.id} payload={item}>
                            {(provided) => {
                                return (
                                    <li
                                        className={listElement}
                                        key={item.id}
                                        onClick={() => onElementClick(item)}
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
