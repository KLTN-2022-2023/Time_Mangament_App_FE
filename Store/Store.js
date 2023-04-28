import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Reducers/UserReducer";
import TaskReducer from "../Reducers/TaskReducer";
import TypeReducer from "../Reducers/TypeReducer";

export default configureStore({
  reducer: {
    user: UserReducer,
    task: TaskReducer,
    type: TypeReducer,
  },
});
