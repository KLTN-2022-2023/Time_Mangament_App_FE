import { createSlice } from "@reduxjs/toolkit";
import APIService from "../Service/APIService";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: null,
    name: null,
  },
  reducers: {
    getUser: (state, action) => {
      state._id = action.payload ? action.payload._id : null;
      state.name = action.payload ? action.payload.name : null;
    },
  },
});

// Reducer action
export const { getUser } = userSlice.actions;

// Other action
export const getUserById = (req, token) => (dispatch) => {
  APIService.user()
    .getById(req, token)
    .then((response) => dispatch(getUser(response.data.data)))
    .catch((err) => console.log(err));
};

export const getInfoUser = async (req, token) => {
  let result = null;
  try {
    if (!req) return;
    const response = await APIService.user().getById(req, token);
    if (response && response.data && response.data.data) {
      result = response.data.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const signUp = async (req) => {
  let result = null;
  try {
    const response = await APIService.user().signup(req);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const verifyAccount = async (req) => {
  let result = null;
  try {
    const response = await APIService.user().verify(req);
    console.log("abc", response);
    if (response) {
      result = response;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const forgotPass = async (req) => {
  let result = null;
  try {
    const response = await APIService.user().forgotPassword(req);
    if (response) {
      console.log("abc", response);
      result = response;
    }
  } catch (err) {
    result = null;
  }
  return result;
};
export const forgotNewPassword = async (req) => {
  let result = null;
  try {
    const response = await APIService.user().forgotNewPass(req);
    if (response) {
      result = response;
    }
  } catch (err) {
    result = null;
  }
  return result;
};
export const verifyForgotPass = async (req) => {
  let result = null;
  try {
    const response = await APIService.user().verifyForgot(req);
    if (response) {
      result = response;
    }
  } catch (err) {
    result = null;
  }
  return result;
};
export const HandleLogin = async (req) => {
  let result = null;
  try {
    if (!req) return;
    const response = await APIService.user().login(req);
    if (response && response.data && response.data.data) {
      result = response.data.data;
    }
  } catch (err) {
    console.log(err);
    result = null;
  }

  return result;
};
export const UpdateProfile = async (req, token) => {
  let result = null;
  try {
    if (!req) return;
    const response = await APIService.user().updateProfile(req, token);
    if (response && response.data && response.data.data) {
      result = response.data.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export default userSlice.reducer;
