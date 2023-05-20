import nsfwjs from "nsfwjs";

export const detectNsfw = async (imageUrl: string): Promise<boolean> => {
  const img = document.createElement("img");
  img.src = imageUrl;

  const model = await nsfwjs.load();

  const predictions = await model.classify(img);
  console.log("Predictions: ", predictions);

  const nsfwProbability = predictions.find(
    (p) =>
      p.className === "Porn" ||
      p.className === "Hentai" ||
      p.className == "Sexy"
  )?.probability;
  if (nsfwProbability && nsfwProbability > 0.5) {
    return true; // Image is NSFW
  }

  return false; // Image is safe
};
