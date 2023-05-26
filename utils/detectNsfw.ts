import nsfwjs from "nsfwjs";

export async function detectNsfw(imageUrl: string): Promise<boolean> {
  const img: HTMLImageElement = document.createElement("img");
  img.src = imageUrl;

  const model: nsfwjs.NSFWJS = await nsfwjs.load();

  const predictions: nsfwjs.predictionType[] = await model.classify(img);
  console.log("Predictions: ", predictions);

  const nsfwProbability: number | undefined = predictions.find(
    (p: nsfwjs.predictionType) =>
      p.className === "Porn" ||
      p.className === "Hentai" ||
      p.className == "Sexy"
  )?.probability;
  return !!(nsfwProbability && nsfwProbability > 0.5);

  // Image is safe
}
