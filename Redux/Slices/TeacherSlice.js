import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teacher: [{ label: "No data", value: "No Data" }],
};

const TeacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setTeacherNames: (state, action) => {
      state.teacher = [...action.payload];
    },
  },
});

export const { setTeacherNames } = TeacherSlice.actions;
export default TeacherSlice.reducer;
