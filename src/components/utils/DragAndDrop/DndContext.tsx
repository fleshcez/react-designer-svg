import React, { createContext, ReactNode, useState } from "react";

import { DragPlaceholder } from "./drag-placeholder/DragPlaceholder";
import { DragSnapshot, DragModel, MousePosition, ElementPosition } from "./Dnd.hooks";

export interface DndContextProps {
    children: ReactNode;
    onDrop: (model: DndDropModel) => void;
}

export interface DndDropModel {
    dragSnapshot: DragModel;
    dropPosition: ElementPosition;
    payload: unknown;
}

export interface DndDragModel {
    snapshot: DragSnapshot;
    placeholderInitialPosition: ElementPosition;
}

export interface DndContextModel {
    placeholderHeight: number;
    placeholderWidth: number;
    onDragEnd: (model: DndDragModel, payload: unknown) => void;
    updateDropTarget: (HTMLElement) => void;
    onDragging: (model: DndDragModel) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dndContextImpl = createContext<DndContextModel>({} as any);
const DndContextProvider = dndContextImpl.Provider;

function intersectsDropTarget(mousePosition: MousePosition, targetRect: DOMRect) {
    const intersectsX = mousePosition.x > targetRect.left && mousePosition.x < targetRect.right;
    const intersectsY = mousePosition.y > targetRect.top && mousePosition.y < targetRect.bottom;
    return intersectsX && intersectsY;
}

function computeDropPosition(targetRect: DOMRect, model: DndDragModel) {
    const { placeholderInitialPosition } = model;
    const { deltaMouse } = model.snapshot.model;
    const placeHolderFinalPosition: ElementPosition = {
        left: placeholderInitialPosition.left + deltaMouse.x,
        top: placeholderInitialPosition.top + deltaMouse.y
    };

    return {
        left: placeHolderFinalPosition.left - targetRect.left,
        top: placeHolderFinalPosition.top - targetRect.top
    } as ElementPosition;
}
function handleDragEnd(
    model: DndDragModel,
    dropTarget: HTMLElement,
    onDrop: (model: DndDropModel) => void,
    payload: unknown
) {
    const targetRect = dropTarget.getBoundingClientRect();
    if (!intersectsDropTarget(model.snapshot.model.currentMouse, targetRect)) {
        return;
    }

    const dropModel: DndDropModel = {
        dragSnapshot: model.snapshot.model,
        dropPosition: computeDropPosition(targetRect, model),
        payload
    };
    onDrop(dropModel);
}

function useDndContext({ onDrop }: DndContextProps) {
    const [dropTargetElement, setDropTargetElement] = useState<HTMLElement>();
    const [dragSnapshot, setDragSnapshot] = useState<DndDragModel>();

    return {
        dragSnapshot,
        context: {
            placeholderHeight: 50,
            placeholderWidth: 100,
            onDragEnd: (model: DndDragModel, payload: unknown) =>
                handleDragEnd(model, dropTargetElement, onDrop, payload),
            updateDropTarget: setDropTargetElement,
            onDragging: (model) => setDragSnapshot(model)
        } as DndContextModel
    };
}

export function DndContext(props: DndContextProps) {
    const { children } = props;
    const { context, dragSnapshot } = useDndContext(props);
    return (
        <DndContextProvider value={context}>
            <>
                {children}
                <DragPlaceholder dragModel={dragSnapshot} />
            </>
        </DndContextProvider>
    );
}
