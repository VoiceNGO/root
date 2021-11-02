// vs-code extension "glsl-literal" provides syntax highlighting in scripts below

/* eslint no-magic-numbers: "off" */
const glsl = (x: TemplateStringsArray) => x[0];
const webGLIsSupported = detectWebGL();
let webGlContextID = 'webgl';

// prettier-ignore
const verticalMatrix = [
  -1, 0, 1,
  -2, 0, 2,
  -1, 0, 1,
];

// prettier-ignore
const horizontalMatrix = [
  -1, -2, -1,
   0,  0,  0,
  -1, -2, -1,
]

function createShader(
  glCtx: WebGLRenderingContext,
  shaderType: number,
  shaderSrc: string
): WebGLShader {
  const shader = glCtx.createShader(shaderType)!;
  glCtx.shaderSource(shader, shaderSrc);
  glCtx.compileShader(shader);

  return shader;
}

function createVertexShader(glCtx: WebGLRenderingContext): WebGLShader {
  return createShader(
    glCtx,
    glCtx.VERTEX_SHADER,
    glsl`
      attribute vec2 a_position;
      attribute vec2 a_texCoord;

      uniform vec2 u_resolution;
      uniform float u_flipY;

      varying vec2 v_texCoord;

      void main() {
        // convert the rectangle from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

        // pass the texCoord to the fragment shader
        // The GPU will interpolate this value between points.
        v_texCoord = a_texCoord;
      }
    `
  );
}

function createFragmentShader(glCtx: WebGLRenderingContext): WebGLShader {
  return createShader(
    glCtx,
    glCtx.FRAGMENT_SHADER,
    glsl`
      precision mediump float;

      // our texture
      uniform sampler2D u_image;
      uniform vec2 u_textureSize;
      uniform float u_kernel[9];
      uniform float u_kernelWeight;

      // the texCoords passed in from the vertex shader.
      varying vec2 v_texCoord;

      void main() {
        vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
        vec4 colorSum =
            texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
            texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
            texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
        gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1);
      }
    `
  );
}

function createCanvasAndContext(contextID: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext(contextID)!;

  return { canvas, ctx };
}

function detectWebGL() {
  const { ctx } = createCanvasAndContext(webGlContextID);

  if (!ctx || !(ctx instanceof WebGLRenderingContext)) {
    webGlContextID = 'webgl-experimental';
    const { ctx: experimentalCtx } = createCanvasAndContext(webGlContextID);

    if (
      !experimentalCtx ||
      !(experimentalCtx instanceof WebGLRenderingContext)
    ) {
      return false;
    }
  }

  return true;
}

export default class WebGLSeamCarver {
  private glCanvas!: HTMLCanvasElement;
  private offscreen2DCanvas!: HTMLCanvasElement;
  private resultCanvas!: HTMLCanvasElement;

  private glCtx!: WebGLRenderingContext;
  private offscreen2DCtx!: CanvasRenderingContext2D;
  private resultCtx!: CanvasRenderingContext2D;

  private imageNode!: HTMLImageElement;
  private webGlProgram!: WebGLProgram;
  private imageData!: ImageData;

  private workingWidth!: number;
  private workingHeight!: number;

  constructor(imageSrc: string) {
    this.createImageNode(imageSrc);

    if (webGLIsSupported) {
      this.createCanvasesAndContexts();
      this.createWebGLProgram();
    }
  }

  getRenderingNode(): HTMLElement {
    return webGLIsSupported ? this.resultCanvas : this.imageNode;
  }

  private createImageNode(src: string): void {
    const image = document.createElement('image') as HTMLImageElement;
    this.imageNode = image;
    image.onload = () => this.imageOnLoad();
    image.setAttribute('src', src);
  }

  private createCanvasesAndContexts(): void {
    {
      const { canvas, ctx } = createCanvasAndContext(webGlContextID);
      this.glCanvas = canvas;
      this.glCtx = ctx as WebGLRenderingContext;
    }

    {
      const { canvas, ctx } = createCanvasAndContext('2d');
      this.offscreen2DCanvas = canvas;
      this.offscreen2DCtx = ctx as CanvasRenderingContext2D;
    }

    {
      const { canvas, ctx } = createCanvasAndContext('2d');
      this.resultCanvas = canvas;
      this.resultCtx = ctx as CanvasRenderingContext2D;
    }
  }

  private createWebGLProgram(): void {
    const { glCtx } = this;
    const vertexShader = createVertexShader(glCtx);
    const fragmentShader = createFragmentShader(glCtx);

    const program = glCtx.createProgram()!;
    this.webGlProgram = program;

    glCtx.attachShader(program, vertexShader);
    glCtx.attachShader(program, fragmentShader);
    glCtx.linkProgram(program);

    // Check the link status
    const linked = glCtx.getProgramParameter(program, glCtx.LINK_STATUS);
    if (!linked) {
      const err = glCtx.getProgramInfoLog(program);
      glCtx.deleteProgram(program);

      throw new Error(`Failed to link program.  Error: ${err}`);
    }
  }

  private imageOnLoad(): void {
    if (!webGLIsSupported) return;

    this.setInitialCanvasesDimensions();
    this.loadImagePixelData();
  }

  private setInitialCanvasesDimensions() {
    const {
      imageNode: { width, height },
      glCanvas,
      offscreen2DCanvas,
      resultCanvas,
    } = this;

    [glCanvas, offscreen2DCanvas, resultCanvas].forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
    });
  }

  private loadImagePixelData(): void {
    const image = this.imageNode;
    const ctx = this.offscreen2DCtx;
    const { width, height } = image;

    ctx.drawImage(image, 0, 0);
    this.imageData = ctx.getImageData(0, 0, width, height);
  }

  private copyWebGlToOffscreen() {
    this.offscreen2DCtx.drawImage(this.glCanvas, 0, 0);
  }

  private copyOffscreenToWebGL() {}

  private removeSeam() {
    const { workingWidth, workingHeight } = this;

    this.copyWebGlToOffscreen();
    const imageData = this.offscreen2DCtx.getImageData(
      0,
      0,
      workingWidth,
      workingHeight
    );
    const collectedEnergyMap2d = this.createCollectedEnergyMap2d(
      imageData.data
    );
  }

  private createCollectedEnergyMap2d(pixels: Uint8ClampedArray): Uint16Array[] {
    const { workingWidth, workingHeight } = this;
    const collectedEnergyMap2d: Uint16Array[] = [];
    let prevRowEnergy: Uint16Array;

    for (let rowNum = 0; rowNum < workingHeight; rowNum++) {
      const rowEnergy = new Uint16Array(workingWidth);
      const collectedRowEnergy = new Uint16Array(workingWidth);
      collectedEnergyMap2d.push(collectedRowEnergy);

      for (let colNum = 0; colNum < workingWidth; colNum++) {
        const baseIndex = (rowNum * workingWidth + colNum) * 4;
        rowEnergy[colNum] =
          pixels[baseIndex] +
          pixels[baseIndex + 1] +
          pixels[baseIndex + 2] +
          pixels[baseIndex + 3];

        if (rowNum === 0) {
          collectedRowEnergy[colNum] = rowEnergy[colNum];
        } else {
          // a, b, c are the up-left, straight-up, and up-right pixels
          const a = colNum ? prevRowEnergy![colNum - 1] : Infinity;
          const b = prevRowEnergy![colNum];
          const c =
            colNum < workingWidth - 1 ? prevRowEnergy![colNum + 1] : Infinity;

          collectedRowEnergy[colNum] =
            rowEnergy[colNum] +
            // evals to Math.min(a, b, c) but tested 20% faster in chrome & 400% faster in Safari
            (a < b ? (a < c ? a : c) : b < c ? b : c);
        }
      }

      prevRowEnergy = rowEnergy;
    }

    return energyMap2d;
  }
}
