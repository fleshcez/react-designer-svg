import React, { useState } from "react";
import "./App.css";
import { SVGCanvas } from "./svg-canvas/SVGCanvas";
import { Toolbox } from "./Toolbox/Toolbox";
import { createNewObject } from "./utils/createNewObject";
import { DndContext } from "./utils/DragAndDrop/DndContext";
import { ElementPosition } from "./utils/DragAndDrop/Dnd.hooks";
import { ToolboxItem } from "./Toolbox/Toolbox.model";
import { AuthenticationProvider, oidcLog, InMemoryWebStorage } from "@axa-fr/react-oidc-context";
import { AuthenticatedComponent } from "./auth/AuthenticatedComponent";
import { Routes } from "./auth/Routes/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./auth/Header";
import { oidcConfiguration } from "./auth/config";

export interface CanvasProperties {
    width: number;
    height: number;
}

const CustomCallback = () => (
    <div>
        <h1>This is a Custom Callback component</h1>
    </div>
);

export function App() {
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
    const [activeShapes, setActiveShapes] = useState([]);
    const [, setCanvasMouseCoords] = useState({ x: 0, y: 0 });
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

    const addNewShape = (toolboxItem: ToolboxItem, position: ElementPosition) => {
        const newObject = createNewObject(toolboxItem, position);
        setActiveShapes([...activeShapes, newObject]);
    };

    return (
        <>
            <AuthenticationProvider
                configuration={oidcConfiguration}
                loggerLevel={oidcLog.DEBUG}
                isEnabled={true}
                callbackComponentOverride={CustomCallback}
                UserStore={InMemoryWebStorage}
            >
                <Router>
                    <Header />
                    <Routes />
                </Router>
            </AuthenticationProvider>
            {/*<DndContext*/}
            {/*    onDrop={(result) => {*/}
            {/*        console.log("drop", result);*/}
            {/*        const payload = result.payload as ToolboxItem;*/}
            {/*        addNewShape(payload, result.dropPosition);*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <div className="app">*/}
            {/*        <div style={{ position: "relative", display: "flex", height: "100%", width: "100vw" }}>*/}
            {/*            <Toolbox onElementClick={(item) => addNewShape(item, { left: 0, top: 0 })} />*/}

            {/*            <SVGCanvas*/}
            {/*                width={canvasDimensions.width}*/}
            {/*                height={canvasDimensions.height}*/}
            {/*                shapes={activeShapes}*/}
            {/*                onMouseDropCoordsChange={setCanvasMouseCoords}*/}
            {/*                updateCanvasWidth={updateCanvasWidth}*/}
            {/*                updateCanvasHeight={updateCanvasHeight}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</DndContext>*/}
        </>
    );
}
