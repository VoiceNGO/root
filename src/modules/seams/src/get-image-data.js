module.exports = function(src) {
  return new Promise(function(resolve, reject) {
    if (typeof BUILD === 'undefined' || !BUILD) {
      var Canvas = require('canvas');
      var Image = Canvas.Image;
      var server = true;
    }

    var img = new Image();
    img.onload = function() {
      var canvas = server ? new Canvas(img.width, img.height) : document.createElement('canvas');
      if (!server) {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      var ctx = canvas.getContext('2d');
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
};
