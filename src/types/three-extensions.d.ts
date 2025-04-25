declare module "three/examples/jsm/geometries/TextGeometry";

declare module "three/examples/jsm/loaders/FontLoader" {
  import { Loader } from "three";

  export interface FontData {
    glyphs: Record<string, unknown>;
    familyName: string;
    ascender: number;
    descender: number;
    underlineThickness: number;
    boundingBox: {
      xMin: number;
      xMax: number;
      yMin: number;
      yMax: number;
    };
    resolution: number;
    original_font_information: Record<string, unknown>;
    cssFontWeight: string;
    cssFontStyle: string;
  }

  export class Font {
    constructor(data: FontData);
    data: FontData;
    generateShapes(text: string, size: number): THREE.Shape[];
  }

  export class FontLoader extends Loader {
    load(
      url: string,
      onLoad: (font: Font) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}
