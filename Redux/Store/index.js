import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import ClassRoomSlice from "../Slices/ClassRoomSlice";
import FreeslotsSlice from "../Slices/FreeslotsSlice";
import SectionSlice from "../Slices/SectionSlice";
import StudentCredentialsSlice from "../Slices/StudentCredentialsSlice";
import SubjectSlice from "../Slices/SubjectSlice";
import TeacherSlice from "../Slices/TeacherSlice";
import TimeslotSlice from "../Slices/TimeslotSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["FreeslotsSlice"],
};

const rootReducer = combineReducers({
  ClassRoomSlice,
  TimeslotSlice,
  SubjectSlice,
  TeacherSlice,
  SectionSlice,
  StudentCredentialsSlice,
  FreeslotsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
