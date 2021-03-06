import { useEffect, useState } from "react";
import { fromEvent } from "rxjs";
import { filter, map, switchMap, takeUntil, finalize, tap } from "rxjs/operators";

export interface DragOptions {
    dragSourceElement: HTMLElement;
    onDragEnd: (snapshot: DragModel) => void;
}

export interface MousePosition {
    x: number;
    y: number;
}

export interface ElementPosition {
    left: number;
    top: number;
}

export interface DragModel {
    initialElementPosition: ElementPosition;
    initialMousePosition: MousePosition;
    deltaMouse: MousePosition;
    currentMouse: MousePosition;
}

export interface DragSnapshot {
    isDragging: boolean;
    model?: DragModel;
}

export function useDrag({ dragSourceElement, onDragEnd }: DragOptions) {
    const [snapshot, setSnapshot] = useState<DragSnapshot>();

    useEffect(() => {
        if (!dragSourceElement) {
            return;
        }

        const mouseMove = fromEvent(window, "mousemove");
        const mouseUp = fromEvent(window, "mouseup");
        const mouseDown = fromEvent(dragSourceElement, "mousedown").pipe(filter((m: MouseEvent) => m.button == 0));

        const dragAndDrop = mouseDown.pipe(
            switchMap((mouse) => {
                const targetRect = dragSourceElement.getBoundingClientRect();
                const initialElementPosition = {
                    left: targetRect.left,
                    top: targetRect.top
                };
                const initialMousePosition = {
                    x: mouse.clientX,
                    y: mouse.clientY
                };
                let currentSnapshot = null;
                return mouseMove.pipe(
                    map((mouse: MouseEvent) => {
                        return {
                            initialElementPosition,
                            initialMousePosition,
                            currentMouse: {
                                x: mouse.clientX,
                                y: mouse.clientY
                            },
                            deltaMouse: {
                                x: mouse.clientX - initialMousePosition.x,
                                y: mouse.clientY - initialMousePosition.y
                            }
                        };
                    }),
                    tap((dragSnapshot) => (currentSnapshot = dragSnapshot)),
                    takeUntil(mouseUp),
                    finalize(() => {
                        try {
                            onDragEnd(currentSnapshot);
                        } catch (e) {
                            console.warn("failed to perform  drag end", e);
                        }
                        setSnapshot({ isDragging: false });
                    })
                );
            })
        );

        const onDraggingSub = dragAndDrop.subscribe((newSnapshot) => {
            setSnapshot({ model: newSnapshot, isDragging: true });
        });

        return () => {
            onDraggingSub.unsubscribe();
        };
    }, [dragSourceElement]);

    return {
        snapshot
    };
}
