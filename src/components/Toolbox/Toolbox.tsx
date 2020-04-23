import React from "react";
import styles from "./Toolbox.module.scss";
import { SVGElementInterface, svgType } from "../svg-canvas/SVGElement";
import { importedSVG } from "../utils/SVGImporter";

interface ToolboxProps {
    shapes: SVGElementInterface[];
    onElementClick(type: string, svg: string);
}
const { toolbox: toolBoxClass, listElement: listElementClass, list: listClass } = styles;

export const Toolbox = (props: ToolboxProps) => {
    const items = [
        { id: "1", type: svgType.rect, description: "Rectangular", svg: "" },
        { id: "2", type: svgType.ellipse, description: "Ellipse", svg: "" },
        { id: "3", type: svgType.imported, description: "Rider", svg: importedSVG.rider },
        { id: "4", type: svgType.imported, description: "QrCode", svg: importedSVG.qrCode }
    ];

    return (
        <div className={toolBoxClass}>
            <h1>ToolBox</h1>
            <ul className={listClass}>
                {items.map((item) => (
                    <li
                        className={listElementClass}
                        key={item.id}
                        onClick={() => props.onElementClick(item.type, item.svg)}
                    >
                        {item.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};
