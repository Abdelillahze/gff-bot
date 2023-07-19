const { createCanvas, loadImage } = require("canvas");

async function pixelateImage(src, percentage) {
  const img = await loadImage(src);
  const { width, height } = img;
  const pixelSpace = width > height ? width / 10 : height / 10;
  const size = Math.floor((percentage * pixelSpace) / 100);
  console.log(size);
  const imgDataCanvas = createCanvas(img.width, img.height);
  const imgDataContext = imgDataCanvas.getContext("2d");
  imgDataContext.drawImage(img, 0, 0);
  const pixelArr = imgDataContext.getImageData(0, 0, width, height).data;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const pixel = (x + y * width) * 4;
      const color = `rgba(${pixelArr[pixel]},${pixelArr[pixel + 1]},${
        pixelArr[pixel + 2]
      },${pixelArr[pixel + 3]})`;
      context.fillStyle = color;
      context.fillRect(x, y, size, size);
    }
  }

  return canvas.toBuffer();
}

module.exports = pixelateImage;
