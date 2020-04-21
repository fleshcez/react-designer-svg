import React, { useState } from "react";
import "./App.css";
import { SVGCanvas } from "./svg-canvas/SVGCanvas";
import { demoShapes } from "./svg-canvas/Demoshapes";
import { CanvasSettings } from "./canvas-settings/CanvasSettings";
import { Toolbox } from "./Toolbox/Toolbox";
import { SVGElementInterface } from "./svg-canvas/SVGElement";

export interface CanvasProperties {
    width: number;
    height: number;
}
export function App() {
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 500, height: 400 });
    const [activeShapes, setActiveShapes] = useState([]);

    const updateCanvasWidth = (width: number) => {
        setCanvasDimensions((prev) => {
            return { width: width, height: prev.height };
        });
    };

    const updateCanvasHeight = (height: number) => {
        setCanvasDimensions((prev) => {
            return { width: prev.width, height: height };
        });
    };

    const onElementClick = (id: string) => {
        if (id === null) {
            return;
        }
        const element = demoShapes.find((s) => s.id === id);
        element.position.x = 0;
        element.position.y = 0;

        setActiveShapes((prev: SVGElementInterface[]) => {
            prev.push(element);
            return prev;
        });
    };

    return (
        <div className="app">
            <Toolbox shapes={demoShapes} onElementClick={onElementClick} />
            <CanvasSettings
                updateCanvasWidth={updateCanvasWidth}
                updateCanvasHeight={updateCanvasHeight}
                currentDimensions={canvasDimensions}
            />
            <SVGCanvas width={canvasDimensions.width} height={canvasDimensions.height} shapes={activeShapes} />
        </div>
    );
}
