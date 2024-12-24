import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  class_name: [{ label: "No data", value: "No Data" }],
};

const ClassNameSlice = createSlice({
  name: "class_name",
  initialState,
  reducers: {
    setClassNames: (state, action) => {
      state.class_name = [...action.payload];
    },
  },
});

export const { setClassNames } = ClassNameSlice.actions;
export default ClassNameSlice.reducer;
