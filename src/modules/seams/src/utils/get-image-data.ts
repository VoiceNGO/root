const isNode = typeof window === 'undefined';

export default function getImageData(imgSrc: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const Canvas = isNode ? require('canvas') : null;
    const Image = isNode ? Canvas.Image : window.Image;

    const img = new Image();
    img.onload = () => {
      let canvas: HTMLCanvasElement;

      if (isNode) {
        canvas = new Canvas(img.width, img.height);
      } else {
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
      }

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };

    img.onerror = reject;
    img.src = imgSrc;
  });
}
