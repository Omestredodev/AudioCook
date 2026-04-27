/*import axios from "axios";


export default axios.create({
  baseURL: "http://192.168.15.175:3000"
});*/

import axios from "axios";
import Constants from "expo-constants";

const host = Constants.expoConfig.hostUri.split(":")[0];

export default axios.create({
  baseURL: `http://${host}:3000`,
});