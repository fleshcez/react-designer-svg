import { useEffect, useRef, useState } from "react";
import { fromEvent } from "rxjs";
import { filter, map, switchMap, takeUntil, finalize } from "rxjs/operators";

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
    const snapshotRef = useRef<DragSnapshot>();

    function updateSnapshot(newSnapshot: DragSnapshot) {
        setSnapshot(newSnapshot);
        snapshotRef.current = newSnapshot;
    }
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
                    takeUntil(mouseUp),
                    finalize(() => {
                        try {
                            onDragEnd(snapshotRef.current?.model);
                        } catch (e) {
                            console.warn("failed to perform  drag end", e);
                        }
                        updateSnapshot({ isDragging: false });
                    })
                );
            })
        );
        //
        // const onDragEndSub = mouseUp.pipe(withLatestFrom(dragAndDrop)).subscribe(([, snapshot]) => {
        //     setSnapshot({
        //         isDragging: false
        //     });
        //     onDragEnd(snapshot);
        // });

        const onDraggingSub = dragAndDrop.subscribe((newSnapshot) => {
            updateSnapshot({ model: newSnapshot, isDragging: true });
        });

        return () => {
            // onDragEndSub.unsubscribe();
            onDraggingSub.unsubscribe();
        };
    }, [dragSourceElement]);

    return {
        snapshot
    };
}
