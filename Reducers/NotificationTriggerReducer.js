import { createSlice } from "@reduxjs/toolkit";

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

export default notificationTriggerSlice.reducer;
