import Axios from "axios";
import { USERID } from "./userConfig";

export const BACKEND_BASEURL = "http://143.248.48.96:7887/";

const search = Axios.create({
  baseURL: BACKEND_BASEURL + "/log",
});

const addLog = (action, data) => {
  return search.post("/add", {
    userId: USERID,
    action: action,
    data: data,
    timestamp: new Date().getTime(),
  });
};

export { addLog };
