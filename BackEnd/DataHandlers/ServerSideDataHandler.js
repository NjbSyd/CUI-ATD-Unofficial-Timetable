import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { RenderAPI } from "./APIs";
import {
  setFreeslots,
  setFreeslotsAvailable,
} from "../../Redux/FreeslotsSlice";
import { RemoveLabData } from "../../UI/Functions/UIHelpers";
import { batchInsertTimetableData, clearTimetableTable } from "../KnexDB";

// Function to check if an update is needed
async function shouldUpdateDataFromServer() {
  try {
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate");
    if (!lastSyncDate) {
      return true;
    } else {
      if (!(await NetInfo.fetch()).isInternetReachable) {
        return false;
      }
      const res = await RenderAPI.post(`timetable/shouldUpdate`, {
        lastSyncDate,
      });
      const data = {
        shouldUpdate: undefined,
        lastScrapDate: undefined,
        title: undefined,
      };
      data.shouldUpdate = res.data.shouldUpdate;
      data.lastScrapDate = res.data.lastScrapDate;
      data.title = res.data.title;
      return !!data?.shouldUpdate;
    }
  } catch (error) {
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate");
    if (lastSyncDate) {
      return false;
    }
    throw error;
  }
}

// Function to update data and sync date
async function updateDataFromServerIfNeeded(setLoadingText) {
  if (setLoadingText === undefined) {
    setLoadingText = () => {};
  }
  try {
    const updateNeeded = await shouldUpdateDataFromServer();
    // const updateNeeded = true;
    if (updateNeeded) {
      setLoadingText("Fetching Data ...");
      const timetableData = await fetchDataFromMongoDB("timetable");
      setLoadingText("Removing Old Data...");
      // await fakeSleep(100);
      await clearTimetableTable();
      setLoadingText("Removing Old Data...✅");
      // await fakeSleep(100);
      await batchInsertTimetableData(timetableData);
      await AsyncStorage.setItem("lastSyncDate", new Date().toJSON());
    } else {
      setLoadingText("Proceeding with existing data...");
    }
  } catch (error) {
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate");
    if (error.message.toUpperCase().includes("NETWORK")) {
      throw new Error("Please! Check your internet connection and try again.");
    } else if (
      error.message.toUpperCase().includes("TIMEOUT") &&
      lastSyncDate
    ) {
      setLoadingText(
        "Server Connection Timeout...⛔\nProceeding with existing data..."
      );
    } else {
      throw new Error("Please! Restart the App or Try Again.");
    }
  }
}

async function fetchDataFromMongoDB(URL) {
  try {
    const res = await RenderAPI.get(URL);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function fetchAndStoreFreeslotsData(StateDispatcher) {
  try {
    const isConnected = (await NetInfo.fetch()).isInternetReachable;
    if (!isConnected) {
      alert("No internet connection.");
      return;
    }
    const res = await fetchDataFromMongoDB("freeslots");
    const freeslots = RemoveLabData(res);
    StateDispatcher(setFreeslots(freeslots));
    StateDispatcher(setFreeslotsAvailable(true));
    return true;
  } catch (error) {
    if (error.message.toUpperCase().includes("TIMEOUT")) {
      alert("Server is taking too long to respond.\nTry again later.");
    } else {
      throw error;
    }
  }
}

export {
  shouldUpdateDataFromServer,
  updateDataFromServerIfNeeded,
  fetchAndStoreFreeslotsData,
};
