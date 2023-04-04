import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Reducers/UserReducer";
import TaskReducer from "../Reducers/TaskReducer";

export default configureStore({
  reducer: {
    user: UserReducer,
    task: TaskReducer,
  },
});
