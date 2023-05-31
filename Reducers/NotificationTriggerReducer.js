import { createSlice } from "@reduxjs/toolkit";
import APIService from "../Service/APIService";

export const notificationTriggerSlice = createSlice({
  name: "notificationTrigger",
  initialState: {
    allTriggers: [],
  },
  reducers: {
    setTriggerList: (state, action) => {
      state.allTriggers = [...action.payload];
    },
  },
});

// Reducer action
export const { setTriggerList } = notificationTriggerSlice.actions;

// Other action
export const SetNotificationTriggerList = (req) => (dispatch) => {
  dispatch(setTriggerList(req));
};

export const getListNotificationByUserId = async (req, token) => {
  try {
    let response = await APIService.notification().getListNotificationByUserId(
      req,
      token
    );
    if (response.data.data) {
      return response.data.data;
    }

    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const CreateNotification = async (req, token) => {
  let result = null;
  try {
    if (!req) return;
    const response = await APIService.notification().createNotification(
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

export const DeleteNotification = async (id, token) => {
  let result = null;
  try {
    const response = await APIService.notification().deleteNotification(
      id,
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

export default notificationTriggerSlice.reducer;
