import axios from "axios";

// Your IP Address
const localApi = "http://192.168.1.12:3000/";
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
  task(url = baseApi + "Task/") {
    return {
      getListAllTasks: (req, token) =>
        axios.post(url + "GetTasksByUserId/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      markImportant: (id, token) =>
        axios.get(url + "MarkImportant/" + id, {
          headers: {
            Authorization: token,
          },
        }),
      updateStatus: (id, token) =>
        axios.get(url + "UpdateStatus/" + id, {
          headers: {
            Authorization: token,
          },
        }),
      // Nam
      createTask: (req, token) =>
        axios.post(url + "CreateTask/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      updateTask: (req, token) =>
        axios.post(url + "UpdateTask/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      deleteTask: (id, token) =>
        axios.delete(url + "FakeDeleteTask/" + id, {
          headers: {
            Authorization: token,
          },
        }),
    };
  },
  s3(url = baseApi + "S3") {
    return {
      upload: (req) =>
        axios.post(url + "Upload", req, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }),
    };
  },
};
