import React from "react";
import "./App.css";
import { SVGCanvas } from "./svg-canvas/SVGCanvas";
import { demoShapes } from "./svg-canvas/Demoshapes";

export function App() {
    return (
        <div className="app">
            <SVGCanvas width={400} height={450} shapes={demoShapes} />
        </div>
    );
}
