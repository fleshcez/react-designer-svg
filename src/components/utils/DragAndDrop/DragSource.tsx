import React, { ReactNode, useMemo, useContext, useEffect, useRef } from "react";
import { dndContextImpl } from "./DndContext";
import { useDrag, ElementPosition } from "./Dnd.hooks";

interface DragSourceProps {
    children: (options: DragSourceOptions) => ReactNode;
    payload?: unknown;
}

export interface DragSourceOptions {
    getElementRef: (HTMLElement) => void;
}

export function DragSource({ children, payload }: DragSourceProps) {
    const elementRef = useRef();
    const { onDragging, onDragEnd, placeholderHeight, placeholderWidth } = useContext(dndContextImpl);
    const placeholderPosition = useRef<ElementPosition>();
    const { snapshot } = useDrag({
        dragSourceElement: elementRef.current,
        onDragEnd: (model) =>
            onDragEnd(
                {
                    snapshot: {
                        model,
                        isDragging: false
                    },
                    placeholderInitialPosition: placeholderPosition.current
                },
                payload
            )
    });

    useEffect(() => {
        if (!snapshot?.isDragging) {
            return;
        }
        const { initialElementPosition, initialMousePosition } = snapshot.model;

        const offsetX = initialMousePosition.x - initialElementPosition.left;
        const offsetY = initialMousePosition.y - initialElementPosition.top;
        const adjustX = offsetX - placeholderWidth / 2;
        const adjustY = offsetY - placeholderHeight / 2;
        const left = initialElementPosition.left + adjustX;
        const top = initialElementPosition.top + adjustY;
        placeholderPosition.current = {
            top: top,
            left: left
        };
    }, [snapshot?.isDragging]);

    useEffect(() => {
        onDragging({
            snapshot: snapshot,
            placeholderInitialPosition: placeholderPosition.current
        });
    }, [snapshot]);

    const child = useMemo(() => children({ getElementRef: (r) => (elementRef.current = r) }), []);
    return <>{child}</>;
}
