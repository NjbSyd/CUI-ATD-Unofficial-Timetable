import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  classRoom: [{ label: "No data", value: "No Data" }],
};

const ClassRoomSlice = createSlice({
  name: "classroom",
  initialState,
  reducers: {
    setClassRoom: (state, action) => {
      state.classRoom = [...action.payload];
    },
  },
});

export const { setClassRoom } = ClassRoomSlice.actions;
export default ClassRoomSlice.reducer;
