import axios from "axios";
import { dummydata, dummydata2 } from "./dummydata";

const BASEURL = "http://143.248.48.96:7887";

const imageElement = axios.create({
  baseURL: BASEURL,
});

export const sendImage = (data) => {
  // return Promise.resolve(dummydata);
  return imageElement.post("/getElement", {
    image: data.image,
  });
};

export const getLayout = (filename) => {
  return imageElement.post("/getLayout", {
    filename: filename,
  });
};

export const getSuggestedLayout = (layout) => {
  return imageElement.post("/listLayouts", {
    layout: layout,
  });
};

export const getDescriptions = (data) => {
  // return Promise.resolve(dummydata2);
  return imageElement.post("/getDescriptions", {
    elements: data,
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
  console.log(prompt);

  return imageElement.post(
    "/getImage",
    {
      prompt: prompt,
    },
    { responseType: "blob" }
  );
};

export const expandElements = (data) => {
  return imageElement.post("/expandElements", {
    elements: data,
  });
};
