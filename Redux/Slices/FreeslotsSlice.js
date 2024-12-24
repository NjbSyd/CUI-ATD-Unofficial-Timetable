import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  available: false,
  freeslots: "No data",
};

const FreeslotsSlice = createSlice({
  name: "freeslots",
  initialState,
  reducers: {
    setFreeslots: (state, action) => {
      state.freeslots = action.payload;
    },
    setFreeslotsAvailable: (state, action) => {
      state.available = action.payload;
    },
  },
});

export const { setFreeslots, setFreeslotsAvailable } = FreeslotsSlice.actions;
export default FreeslotsSlice.reducer;
