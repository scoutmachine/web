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

const extractColours = async (imageUrl: string) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";

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

  const ColourCounts: any = {};

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const Colour = rgbToHex(r, g, b);

    if (ColourCounts[Colour]) {
      ColourCounts[Colour] += 1;
    } else {
      ColourCounts[Colour] = 1;
    }
  }

  const sortedColours: any = Object.keys(ColourCounts)
    .filter((Colour: any) => {
      const [r, g, b] = Colour.slice(1)
        .match(/.{2}/g)
        .map((component: any) => parseInt(component, 16));

      const isBlack = r === 0 && g === 0 && b === 0;
      const isWhite = r === 255 && g === 255 && b === 255;

      return !isBlack && !isWhite;
    })
    .sort((a, b) => ColourCounts[b] - ColourCounts[a]);

  return sortedColours;
};

export const findColour = async (imageUrl: string) => {
  const Colours = await extractColours(imageUrl);
  const darknessThreshold = 80;
  let defaultColour = "#fbbb04"; // Scout Machine Yellow (text-primary - REFER TO: tailwind.config.js);

  for (const Colour of Colours) {
    const [r, g, b] = Colour.slice(1)
      .match(/.{2}/g)
      .map((component: any) => parseInt(component, 16));

    const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;

    if (lightness > darknessThreshold) {
      defaultColour = Colour;
      break;
    }
  }

  return defaultColour;
};
