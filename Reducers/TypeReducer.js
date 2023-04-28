import { createSlice } from "@reduxjs/toolkit";
import APIService from "../Service/APIService";

export const typesSlice = createSlice({
  name: "type",
  initialState: {
    allTypes: [],
  },
  reducers: {
    getTypeList: (state, action) => {
      state.allTypes = [...action.payload];
    },
  },
});

// Reducer action
export const { getTypeList } = typesSlice.actions;

// Other action
export const getListAllTypesByUserId = (req, token) => (dispatch) => {
  APIService.type()
    .getListAllTypes(req, token)
    .then((response) => {
      let result = response.data.data != null ? response.data.data : [];
      dispatch(getTypeList(result));
    })
    .catch((err) => console.log(err));
};

export const CreateType = async (req, token) => {
  let result = null;
  try {
    if (!req) return;
    const response = await APIService.type().createType(req, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const UpdateType = async (req, token) => {
  let result = null;
  try {
    const response = await APIService.type().updateType(req, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export const DeleteType = async (id, token) => {
  let result = null;
  try {
    const response = await APIService.type().deleteType(id, token);
    if (response && response.data) {
      result = response.data;
    }
  } catch (err) {
    result = null;
  }
  return result;
};

export default typesSlice.reducer;
