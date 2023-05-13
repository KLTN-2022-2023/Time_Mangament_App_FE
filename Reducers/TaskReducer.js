import { createSlice } from "@reduxjs/toolkit";
import APIService from "../Service/APIService";

export const tasksSlice = createSlice({
  name: "task",
  initialState: {
    allTasks: [],
  },
  reducers: {
    getTaskList: (state, action) => {
      state.allTasks = [...action.payload];
    },
  },
});

// Reducer action
export const { getTaskList } = tasksSlice.actions;

// Other action
export const getListAllTasksByUserId = (req, token) => (dispatch) => {
  APIService.task()
    .getListAllTasks(req, token)
    .then((response) => {
      let result = response.data.data != null ? response.data.data : [];
      dispatch(getTaskList(result));
    })
    .catch((err) => console.log(err));
};

export const markImportant = async (id, token) => {
  let result = null;
  try {
    const response = await APIService.task().markImportant(id, token);
    if (response && response.data && response.data.data) {
      result = response.data.data;
    }
  } catch (err) {
    console.log(err.message);
  }
  return result;
};

export const updateStatus = async (id, token) => {
  let result = null;
  try {
    const response = await APIService.task().updateStatus(id, token);
    if (response && response.data && response.data.data) {
      result = response.data.data;
    }
  } catch (err) {
    console.log(err.message);
  }
  return result;
};

export const CreateTask = async (req, token) => {
  let result = null;
  try {
    if (!req) return;
    const response = await APIService.task().createTask(req, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const MarkImportant = async (id, token) => {
  let result = null;
  try {
    const response = await APIService.task().markImportant(id, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const UpdateStatus = async (id, token) => {
  let result = null;
  try {
    const response = await APIService.task().updateStatus(id, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const DeleteTask = async (id, token) => {
  let result = null;
  try {
    const response = await APIService.task().deleteTask(id, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const UpdateTask = async (req, token) => {
  let result = null;
  try {
    const response = await APIService.task().updateTask(req, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const Upload = async (req) => {
  let result = null;
  try {
    const response = await APIService.s3().upload(req);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const CreateRepeat = async (req, token) => {
  let result = null;
  try {
    if (!req) return;
    const response = await APIService.task().createRepeatTask(req, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const CreateRepeatAfterUpdate = async (req, token) => {
  let result = null;
  try {
    if (!req) return;
    const response = await APIService.task().createRepeatTaskAfterUpdate(
      req,
      token
    );
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export default tasksSlice.reducer;
