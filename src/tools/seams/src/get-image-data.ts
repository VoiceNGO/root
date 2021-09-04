// TODO: remove this and turn it back into a compiler flag
const BUILD = false;

export type imageData = { width: number; height: number; data: number[] };

export default function getImageData(src: string): Promise<imageData> {
  return new Promise((resolve, reject) => {
    let isServer = false;

    if (typeof BUILD === 'undefined' || !BUILD) {
      globalThis.Canvas = require('canvas');
      globalThis.Image = Canvas.Image;
      isServer = true;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = isServer
        ? new Canvas(img.width, img.height)
        : document.createElement('canvas');

      if (!isServer) {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      resolve({
        width: img.width,
        height: img.height,
        data: ctx.getImageData(0, 0, img.width, img.height).data,
      });
    };

    img.onerror = reject;
    img.src = src;
  });
}
