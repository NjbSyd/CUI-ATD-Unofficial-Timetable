import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [
    {
      label: "null",
      image: "null",
    },
  ],
};

const StudentCredentialSlice = createSlice({
  name: "studentCredentials",
  initialState,
  reducers: {
    setRegistration: (state, action) => {
      state.users = [...action.payload];
    },
  },
});

export const { setRegistration } = StudentCredentialSlice.actions;
export default StudentCredentialSlice.reducer;
