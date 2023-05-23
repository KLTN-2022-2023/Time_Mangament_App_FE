import axios from "axios";

// Your IP Address
const localApi = "http://192.168.1.6:3000/";
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
      signup: (req) =>
        axios.post(url + "SignUp", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      verify: (req) =>
        axios.post(url + "Verify", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      forgotPassword: (req) =>
        axios.post(url + "ForgotPassWord", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      verifyForgot: (req) =>
        axios.post(url + "VerifyForgot", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      forgotNewPass: (req) =>
        axios.post(url + "ForgotNewPassword", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }),
      updateProfile: (req, token) =>
        axios.post(url + "UpdateProfile", JSON.stringify(req), {
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
      createTask: (req, token) =>
        axios.post(url + "CreateTask/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      createRepeatTask: (req, token) =>
        axios.post(url + "CreateRepeat/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      createRepeatTaskAfterUpdate: (req, token) =>
        axios.post(url + "CreateRepeatAfterUpdate/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      updateTask: (req, token) =>
        axios.put(url + "UpdateTask/", JSON.stringify(req), {
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
  type(url = baseApi + "Type/") {
    return {
      getListAllTypes: (req, token) =>
        axios.post(url + "GetTypesByUserId/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      createType: (req, token) =>
        axios.post(url + "CreateType/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      updateType: (req, token) =>
        axios.put(url + "UpdateType/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      deleteType: (id, token) =>
        axios.delete(url + "FakeDeleteType/" + id, {
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
  report(url = baseApi + "Report/") {
    return {
      reportByYear: (req, token) =>
        axios.post(url + "ReportByYear", req, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
      reportByMonth: (req, token) =>
        axios.post(url + "ReportByMonth", req, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }),
    };
  },
};
