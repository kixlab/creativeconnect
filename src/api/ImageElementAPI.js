import axios from "axios";
import { dummyDesc } from "./dummyDesc";

export const BACKEND_BASEURL = "http://143.248.48.96:7887/";

const imageElement = axios.create({
  baseURL: BACKEND_BASEURL,
});

export const sendImage = (data) => {
  return imageElement.post("imageToKeywords", {
    image: data.image,
  });
};

export const getLayout = (filename) => {
  return imageElement.post("imageToLayout", {
    filename: filename,
  });
};

export const getSuggestedLayout = (layout) => {
  return imageElement.post("getRecommendedLayouts", {
    layout: layout,
  });
};

export const getDescriptions = (data) => {
  // return Promise.resolve(dummyDesc);
  return imageElement.post("mergeKeywords", {
    keywords: data,
  });
};

export const getImage = (data) => {
  let prompt = "";
  prompt += "Caption: " + data.scene + "\n";
  prompt += "Objects: [";
  for (let i = 0; i < data.objects.length; i++) {
    prompt += "('" + data.objects[i].detail + "', [";
    prompt += Math.ceil((data.objects[i].rectangle.x * 512) / 200) + ", ";
    prompt += Math.ceil((data.objects[i].rectangle.y * 512) / 200) + ", ";
    prompt += Math.ceil((data.objects[i].rectangle.width * 512) / 200) + ", ";
    prompt += Math.ceil((data.objects[i].rectangle.height * 512) / 200) + "])";
    if (i !== data.objects.length - 1) {
      prompt += ", ";
    }
  }
  prompt += "]\n";
  prompt += "Background prompt: " + data.background;

  return imageElement.post("generateImage", {
    prompt: prompt,
  });
};

export const expandElements = (data) => {
  return imageElement.post("expandElements", {
    originalKeywords: data,
  });
};
