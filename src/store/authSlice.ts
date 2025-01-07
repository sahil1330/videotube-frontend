import { createSlice } from "@reduxjs/toolkit";

const persistedState = JSON.parse(localStorage.getItem("auth") ?? "null") || {
  status: false,
  user: null,
};

const initialState = persistedState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.user = action.payload;
      localStorage.setItem(
        "auth",
        JSON.stringify({ status: true, user: action.payload })
      );
    },
    logout: (state) => {
      state.status = false;
      state.user = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
