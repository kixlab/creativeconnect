import axios from "axios";
import { dummydata, dummydata2 } from "./dummydata";

const BASEURL = "http://192.168.50.123:52000";

const imageElement = axios.create({
  baseURL: BASEURL,
});

export const sendImage = (data) => {
  // return Promise.resolve(dummydata);
  return imageElement.post("/getElement", {
    image: data.image,
  });
};

export const getDescriptions = (data) => {
  // return Promise.resolve(dummydata2);
  return imageElement.post("/getDescriptions", {
    elements: data,
  });
};

export const getImages = (data) => {
  return imageElement.post(
    "/getImages",
    {
      data: data,
    },
    { responseType: "blob" }
  );
};
