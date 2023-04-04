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

export default tasksSlice.reducer;
