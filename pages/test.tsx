import React, { useState } from "react";

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

const ColorExtractor = () => {
  const [colors, setColors] = useState([]);

  const extractColors = async (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const context: any = canvas.getContext("2d");
    context.drawImage(img, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const colorCounts: any = {};

    // Iterate over each pixel and count the colors
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

    // Sort the colors by count in descending order
    const sortedColors: any = Object.keys(colorCounts).sort(
      (a, b) => colorCounts[b] - colorCounts[a]
    );

    setColors(sortedColors);
  };

  const handleExtractColors = () => {
    const imageUrl = "http://localhost:3000/api/og/avatar?team=254";
    extractColors(imageUrl);
  };

  return (
    <div>
      <button onClick={handleExtractColors}>Extract Colors</button>
      {colors.map((color, index) => (
        <div key={index} style={{ backgroundColor: color }}>
          {color}
        </div>
      ))}
    </div>
  );
};

export default ColorExtractor;
