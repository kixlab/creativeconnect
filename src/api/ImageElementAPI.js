import axios from "axios";
import { dummydata, dummydata2 } from "./dummydata";

const BASEURL = "http://192.168.50.123:52000";

const imageElement = axios.create({
  baseURL: BASEURL,
  //   withCredentials: true,
  //   headers: {
  //     "Access-Control-Allow-Origin": "true",
  //     "Content-type": "application/json",
  //   },
});

export const sendImage = (data) => {
  // return Promise.resolve(dummydata);
  return imageElement.post("/getElement", {
    image: data.image,
  });
};

export const getDescriptions = (data) => {
  return Promise.resolve(dummydata2);
  return imageElement.post("/getDescriptions", {
    elements: data,
  });
};
