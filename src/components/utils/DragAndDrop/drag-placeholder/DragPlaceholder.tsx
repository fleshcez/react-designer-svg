import React, { useMemo, CSSProperties } from "react";
import style from "./DragPlaceholder.module.scss";
import { DragSnapshot } from "../Dnd.hooks";

const { root } = style;

export interface DragPlaceholderProps {
    dragModel: DragSnapshot;
}

export function DragPlaceholder({ dragModel }: DragPlaceholderProps) {
    const translation: CSSProperties = useMemo(() => {
        if (!dragModel?.isDragging) {
            return null;
        }
        const initialElementPosition = dragModel.model.initialElementPosition;
        const initialMousePosition = dragModel.model.initialMousePosition;
        const delta = dragModel.model.deltaMouse;
        const offsetX = initialMousePosition.x - initialElementPosition.left;
        const offsetY = initialMousePosition.y - initialElementPosition.top;
        const adjustX = offsetX - 50;
        const adjustY = offsetY - 25;
        const left = initialElementPosition.left + adjustX;
        const top = initialElementPosition.top + adjustY;

        return {
            left: `${left}px`,
            top: `${top}px`,
            transform: `translate(${delta.x}px,${delta.y}px)`
        } as CSSProperties;
    }, [dragModel]);

    if (!dragModel?.isDragging) {
        return null;
    }

    return (
        <div className={root} style={translation}>
            HELLO
        </div>
    );
}
