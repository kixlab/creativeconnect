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

export const getSuggestedLayout = (layout, target_bbox_num) => {
  let adjustedLayout = [];
  for (let i = 0; i < layout.length; i++) {
    adjustedLayout.push([
      (layout[i][0] * 512) / 200,
      (layout[i][1] * 512) / 200,
      (layout[i][2] * 512) / 200,
      (layout[i][3] * 512) / 200,
    ]);
  }
  return imageElement.post("getRecommendedLayouts", {
    layout: adjustedLayout,
    target_bbox_num: target_bbox_num,
  });
};

export const getDescriptions = (data) => {
  // return Promise.resolve(dummyDesc);
  return imageElement.post("mergeKeywordsToDescriptions", {
    keywords: data,
  });
};

export const getImageFromDescription = (data) => {
  return imageElement.post("descriptionToSketch", {
    description: data,
  });
};

export const getMoreSketches = (description, layout) => {
  let adjustedLayout = [];
  for (let i = 0; i < layout.length; i++) {
    adjustedLayout.push([
      layout[i][0] * 512,
      layout[i][1] * 512,
      layout[i][2] * 512,
      layout[i][3] * 512,
    ]);
  }
  return imageElement.post("getMoreSketches", {
    description: description,
    layout: adjustedLayout,
  });
};

export const getImage = (data) => {
  let prompt = "";
  prompt += "Caption: " + data.caption + "\n";
  prompt += "Objects: [";
  for (let i = 0; i < data.objects.length; i++) {
    prompt += '("' + data.objects[i].detail + '", [';
    prompt += data.objects[i].rectangle.x / 200 + ", ";
    prompt += data.objects[i].rectangle.y / 200 + ", ";
    prompt += data.objects[i].rectangle.width / 200 + ", ";
    prompt += data.objects[i].rectangle.height / 200 + "])";
    if (i !== data.objects.length - 1) {
      prompt += ", ";
    }
  }
  prompt += "]\n";
  return imageElement.post("generateImage", {
    prompt: prompt,
    gen_num: 3,
  });
};

export const expandElements = (data) => {
  return imageElement.post("expandElements", {
    originalKeywords: data,
  });
};
