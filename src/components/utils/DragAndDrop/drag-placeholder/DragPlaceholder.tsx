import React, { useMemo, CSSProperties } from "react";
import style from "./DragPlaceholder.module.scss";
import { DndDragModel } from "../DndContext";

const { root } = style;

export interface DragPlaceholderProps {
    dragModel: DndDragModel;
}

export function DragPlaceholder({ dragModel }: DragPlaceholderProps) {
    const { snapshot, placeholderInitialPosition } = dragModel || {};

    const translation: CSSProperties = useMemo(() => {
        if (!snapshot?.isDragging) {
            return null;
        }
        const { deltaMouse: delta } = snapshot.model;
        const { left, top } = placeholderInitialPosition;
        return {
            left: `${left}px`,
            top: `${top}px`,
            transform: `translate(${delta.x}px,${delta.y}px)`
        } as CSSProperties;
    }, [snapshot, placeholderInitialPosition]);

    if (!snapshot?.isDragging) {
        return null;
    }

    return <div className={root} style={translation} />;
}
