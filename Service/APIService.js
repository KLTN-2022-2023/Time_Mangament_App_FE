import axios from "axios";

// Your IP Address
const localApi = "http://192.168.1.11:3000/";
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
      updateProfile: (req, token) =>
        axios.post(url + "UpdateProfile/", JSON.stringify(req), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": token
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
          Authorization: token
        }
        )
      ,
      //   markImportant: (id, token) =>
      //     axios.get(url + "MarkImportant/" + id, {
      //       headers: {
      //         Authorization: token
      //       }
      //   },
      //   alert(url + "MarkImportant/" + id)
      //   ),
      //  updateStatus: (id, token) => 
      //     axios.put(url + "UpdateStatus/" + id ,{
      //       headers: {
      //         Authorization: token
      //       }
      //   }),
      deleteTask: (id, token) =>
        axios.delete(url + "FakeDeleteTask/" + id, {
          headers: {
            Authorization: token
          }
        }),
      getListAllTasks: (req, token) =>
        axios.post(url + "GetTasksByUserId/", JSON.stringify(req), {
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
    }
  },
  s3(url = baseApi + "S3") {
    return {
      upload: (req) =>
        axios.post(url + "Upload", req, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data"
          }
        })
    }
  },
  reportByDate(url = baseApi + "Report/") {
    return {
      reportByDate: (req, token) =>
        axios.post(url + "ReportByDate", req, {
          headers: {
            // Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": token
          }
        })
    }
  }

};


