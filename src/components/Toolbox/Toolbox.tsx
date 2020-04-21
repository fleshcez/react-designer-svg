import React from "react";
import styles from "./Toolbox.module.scss";
import { SVGElementInterface } from "../svg-canvas/SVGElement";

interface ToolboxProps {
    shapes: SVGElementInterface[];
    onElementClick(id: string);
}
const { toolbox: toolBoxClass, listElement: listElementClass } = styles;

export const Toolbox = (props: ToolboxProps) => {
    return (
        <div className={toolBoxClass}>
            <h1>ToolBox</h1>
            <ul>
                {props.shapes.map((shape) => (
                    <li className={listElementClass} key={shape.id} onClick={() => props.onElementClick(shape.id)}>
                        {shape.type}
                    </li>
                ))}
            </ul>
        </div>
    );
};
