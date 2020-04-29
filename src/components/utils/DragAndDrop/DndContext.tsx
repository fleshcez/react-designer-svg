import React, { createContext, ReactNode, useState } from "react";

import { DragPlaceholder } from "./drag-placeholder/DragPlaceholder";
import { DragSnapshot, DragModel } from "./Dnd.hooks";

export interface DndContextProps {
    children: ReactNode;
    onDragEnd: (model: DragModel) => void;
}

export interface DndContextModel {
    onDragEnd: (model: DragModel) => void;
    updateDropTarget: (HTMLElement) => void;
    onDragging: (model: DragSnapshot) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dndContextImpl = createContext<DndContextModel>({} as any);
const DndContextProvider = dndContextImpl.Provider;

function useDndContext({}: DndContextProps) {
    const [, setDropTargetElement] = useState();
    const [dragSnapshot, setDragSnapshot] = useState<DragSnapshot>();

    return {
        dragSnapshot,
        context: {
            onDragEnd: (model: DragModel) => {
                console.log("drag end", model);
            },
            updateDropTarget: setDropTargetElement,
            onDragging: (model) => setDragSnapshot(model)
        }
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
