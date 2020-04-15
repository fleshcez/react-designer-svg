import React from "react";
import Rider from "../../assets/rider-with-sabre.svg";
import QRCode from "../../assets/qr-code.svg";
import Target from "../../assets/mono-add-target.svg";

interface SVGImporterProps {
    type: importedSVG;
    dimensions: {
        width: number;
        height: number;
    };
}

export enum importedSVG {
    rider = "rider",
    qrCode = "qrCode",
    target = "target"
}

export function SVGImporter(props: SVGImporterProps) {
    const { type, dimensions } = props;

    switch (type) {
        case importedSVG.rider:
            return <Rider {...dimensions} />;
        case importedSVG.qrCode:
            return <QRCode {...dimensions} />;
        case importedSVG.target:
            return <Target {...dimensions} />;
    }
}
