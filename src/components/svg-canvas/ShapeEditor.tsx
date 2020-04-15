import React from "react";
import { EllipseSVGElement, RectSVGElement, SVGElementInterface, svgType, WidthHeightSizeable } from "./SVGElement";
import styles from "./ShapeEditor.module.scss";

const { shapeEditor: shapeEditorClass, editorRow: editorRowClass } = styles;

interface ShapeEditorProps {
    shape: SVGElementInterface;
    onUpdate: (ShapeEditorState) => void;
}

export function ShapeEditor(props: ShapeEditorProps) {
    const { shape, onUpdate } = props;
    let dimensions;

    if (shape.type === svgType.rect || shape.type === svgType.imported) {
        const castShape = (shape as unknown) as WidthHeightSizeable;

        dimensions = (
            <>
                <div className={editorRowClass}>
                    <label>Width</label>
                    <input
                        type="number"
                        value={castShape.width}
                        onChange={(event) => {
                            onUpdate({ ...shape, width: event.target.value });
                        }}
                    />
                </div>
                <div className={editorRowClass}>
                    <label>Height</label>
                    <input
                        type="number"
                        value={castShape.height}
                        onChange={(event) => {
                            onUpdate({ ...shape, height: event.target.value });
                        }}
                    />
                </div>
            </>
        );
    } else {
        const castShape = shape as EllipseSVGElement;
        dimensions = (
            <>
                <div className={editorRowClass}>
                    <label>Rx</label>
                    <input
                        type="number"
                        value={castShape.rx}
                        onChange={(event) => {
                            onUpdate({ ...shape, rx: event.target.value || 10 });
                        }}
                    />
                </div>
                <div className={editorRowClass}>
                    <label>Ry</label>
                    <input
                        type="number"
                        value={castShape.ry}
                        onChange={(event) => {
                            onUpdate({ ...shape, ry: event.target.value || 10 });
                        }}
                    />
                </div>
            </>
        );
    }

    return (
        <div className={shapeEditorClass}>
            {dimensions}
            <div className={editorRowClass}>
                <label>Rotation</label>
                <input
                    type="number"
                    value={shape.rotation}
                    onChange={(event) => {
                        onUpdate({ ...shape, rotation: event.target.value || 0 });
                    }}
                />
            </div>
        </div>
    );
}
