import { SvgType } from "../svg-canvas/SVGElement";

export interface ToolboxItem {
    id: string;
    type: SvgType;
    description: string;
    svg: string;
}
