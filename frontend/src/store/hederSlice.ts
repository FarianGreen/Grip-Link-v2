import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggleHeaderMenu: false,
};

const headerSlice = createSlice({
  name: "header",
  initialState,
  reducers: {
    toggle: (state) => {
      state.toggleHeaderMenu = !state.toggleHeaderMenu;
    },
  },
});

export const { toggle } = headerSlice.actions;
export const headerReducer = headerSlice.reducer;