const rgbToHex = (r: number, g: number, b: number) => {
  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const red = componentToHex(r);
  const green = componentToHex(g);
  const blue = componentToHex(b);

  return "#" + red + green + blue;
};

const extractColors = async (imageUrl: string) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";

  // Wait for the image to load
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    if (imageUrl.startsWith("data:image")) {
      img.src = imageUrl;
    } else {
      const proxyURL = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=`;
      img.src = `${proxyURL}${encodeURIComponent(imageUrl)}`;
    }
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const context: any = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const colorCounts: any = {};

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const color = rgbToHex(r, g, b);

    if (colorCounts[color]) {
      colorCounts[color] += 1;
    } else {
      colorCounts[color] = 1;
    }
  }

  const sortedColors: any = Object.keys(colorCounts)
    .filter((color: any) => {
      const [r, g, b] = color
        .slice(1)
        .match(/.{2}/g)
        .map((component: any) => parseInt(component, 16));

      const isBlack = r === 0 && g === 0 && b === 0;
      const isWhite = r === 255 && g === 255 && b === 255;

      return !isBlack && !isWhite;
    })
    .sort((a, b) => colorCounts[b] - colorCounts[a]);

  return sortedColors;
};

export const findColor = async (imageUrl: string) => {
  const colors = await extractColors(imageUrl);

  const darknessThreshold = 128;
  let defaultColor = "#fbbb04";

  for (const color of colors) {
    const [r, g, b] = color
      .slice(1)
      .match(/.{2}/g)
      .map((component: any) => parseInt(component, 16));

    const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;

    if (lightness > darknessThreshold) {
      defaultColor = color;
      break;
    }
  }

  return defaultColor;
};
