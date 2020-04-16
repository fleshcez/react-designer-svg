import React, { FunctionComponent } from "react";
import { CanvasProperties } from "../App";
import styles from "./CanvasSettings.module.scss";

interface CanvasSettingsProps {
    updateCanvasWidth(width: number);
    updateCanvasHeight(height: number);
    currentDimensions: CanvasProperties;
}

const { canvasSettings: canvasSettingsClass, editorRow: editorRowClass } = styles;

export const CanvasSettings: FunctionComponent<CanvasSettingsProps> = (props: CanvasSettingsProps) => {
    const { updateCanvasWidth, updateCanvasHeight, currentDimensions } = props;
    return (
        <div className={canvasSettingsClass}>
            <h1> Canvas settings</h1>
            <div className={editorRowClass}>
                <label>
                    Width:
                    <input
                        type="text"
                        name="width"
                        value={currentDimensions.width}
                        onChange={(e) => {
                            updateCanvasWidth(Number(e.target.value));
                        }}
                    />
                </label>
            </div>

            <div className={editorRowClass}>
                <label>
                    Height:
                    <input
                        type="text"
                        name="height"
                        value={currentDimensions.height}
                        onChange={(e) => {
                            updateCanvasHeight(Number(e.target.value));
                        }}
                    />
                </label>
            </div>
        </div>
    );
};
