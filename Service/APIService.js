import axios from "axios";

// Your IP Address
const localApi = "http://192.168.1.5:3000/";
const baseApi = localApi;

export default {
  user(url = baseApi + "User/") {
    return {
      login: (req) =>
        axios.post(url + "Login/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      getById: (req, token) =>
        axios.post(url + "GetUserById/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
    };
  },
};
