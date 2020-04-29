import React, { ReactNode, useMemo, useContext } from "react";
import { dndContextImpl } from "./DndContext";

export interface DragTargetProps {
    children: (provided: DragTargetProvided) => ReactNode;
}

export interface DragTargetProvided {
    getElementRef: (HTMLElement) => void;
}

export function DropTarget({ children }: DragTargetProps) {
    const ctx = useContext(dndContextImpl);
    const target = useMemo(() => children({ getElementRef: ctx.updateDropTarget }), []);
    return <>{target}</>;
}
