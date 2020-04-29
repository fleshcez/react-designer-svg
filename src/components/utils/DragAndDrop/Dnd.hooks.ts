import { useEffect, useState } from "react";
import { fromEvent } from "rxjs";
import { filter, map, switchMap, takeUntil, withLatestFrom } from "rxjs/operators";

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
}

export interface DragSnapshot {
    isDragging: boolean;
    model?: DragModel;
}

export function useDrag({ dragSourceElement, onDragEnd }: DragOptions) {
    const [dragging, setDragging] = useState<DragSnapshot>();
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
                return mouseMove.pipe(
                    map((mouse: MouseEvent) => {
                        return {
                            initialElementPosition,
                            initialMousePosition,
                            deltaMouse: {
                                x: mouse.clientX - initialMousePosition.x,
                                y: mouse.clientY - initialMousePosition.y
                            }
                        };
                    }),
                    takeUntil(mouseUp)
                );
            })
        );

        const onDropSub = mouseUp.pipe(withLatestFrom(dragAndDrop)).subscribe(([, snapshot]) => {
            setDragging({
                isDragging: false
            });
            onDragEnd(snapshot);
        });

        const onDraggingSub = dragAndDrop.subscribe((snapshot) => {
            console.log("dragging", snapshot);
            setDragging({
                isDragging: true,
                model: snapshot
            });
        });

        return () => {
            onDropSub.unsubscribe();
            onDraggingSub.unsubscribe();
        };
    }, [dragSourceElement]);

    return {
        dragging
    };
}
