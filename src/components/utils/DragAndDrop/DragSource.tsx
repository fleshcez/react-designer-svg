import React, { ReactNode, useMemo, useContext, useEffect, useRef } from "react";
import { dndContextImpl } from "./DndContext";
import { useDrag } from "./Dnd.hooks";

interface DragSourceProps {
    children: (options: DragSourceOptions) => ReactNode;
}

export interface DragSourceOptions {
    getElementRef: (HTMLElement) => void;
}

export function DragSource({ children }: DragSourceProps) {
    const elementRef = useRef();
    const ctx = useContext(dndContextImpl);
    const { dragging } = useDrag({ dragSourceElement: elementRef.current, onDragEnd: ctx.onDragEnd });
    useEffect(() => ctx.onDragging(dragging), [dragging]);

    const child = useMemo(() => children({ getElementRef: (r) => (elementRef.current = r) }), []);
    return <>{child}</>;
}
