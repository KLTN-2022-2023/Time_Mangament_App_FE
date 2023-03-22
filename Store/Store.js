import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Reducers/UserReducer";

export default configureStore({
  reducer: {
    user: UserReducer,
  },
});
