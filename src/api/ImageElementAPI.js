import axios from "axios";
import { dummydata } from "./dummydata";

const BASEURL = "http://localhost:52000";

const imageElement = axios.create({
  baseURL: BASEURL + "/imageElement",
  //   withCredentials: true,
  //   headers: {
  //     "Access-Control-Allow-Origin": "true",
  //     "Content-type": "application/json",
  //   },
});

export const sendImage = (data) => {
  // return Promise.resolve(dummydata);
  return imageElement.post("/sendImage", {
    image: data.image,
  });
};

export const sendElement = (data) => {
  return imageElement.post("/sendElement", {
    elements: data,
  });
};
