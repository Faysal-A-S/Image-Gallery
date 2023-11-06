import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checked: [],
};
const deleteImageSlice = createSlice({
  name: "Checked",
  initialState,
  reducers: {
    addChecked: (state, action) => {
      state.checked.push(action.payload);
    },
    removeChecked: (state, action) => {
      let newchecked = state.checked.filter(
        (item) => item.id !== action.payload.id
      );

      state.checked = newchecked;
    },
    removeCheckedAll: (state, action) => {
      state.checked = [];
    },
  },
});
export default deleteImageSlice.reducer;
export const { addChecked, removeChecked, removeCheckedAll } =
  deleteImageSlice.actions;
