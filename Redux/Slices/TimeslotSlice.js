import { createSlice } from "@reduxjs/toolkit";

const initialState = { timeSlot: [{ label: "No data", value: "No Data" }] };

const TimeslotSlice = createSlice({
  name: "timeslot",
  initialState,
  reducers: {
    setTimeslot: (state, action) => {
      state.timeSlot = [...action.payload];
    },
  },
});

export const { setTimeslot } = TimeslotSlice.actions;
export default TimeslotSlice.reducer;
