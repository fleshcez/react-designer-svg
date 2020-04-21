import React, { useState } from "react";
import "./App.css";
import { SVGCanvas } from "./svg-canvas/SVGCanvas";
import { demoShapes } from "./svg-canvas/Demoshapes";
import { CanvasSettings } from "./canvas-settings/CanvasSettings";

export interface CanvasProperties {
    width: number;
    height: number;
}
export function App() {
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 500, height: 400 });

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

    return (
        <div className="app">
            <CanvasSettings
                updateCanvasWidth={updateCanvasWidth}
                updateCanvasHeight={updateCanvasHeight}
                currentDimensions={canvasDimensions}
            />
            <SVGCanvas width={canvasDimensions.width} height={canvasDimensions.height} shapes={demoShapes} />
        </div>
    );
}
