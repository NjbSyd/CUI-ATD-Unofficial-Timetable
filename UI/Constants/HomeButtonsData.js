import { Alert } from "react-native";

export const HomeButtonsData = [
  {
    iconName: "chalkboard-teacher",
    screenName: "Teachers",
    screenDescription: "See a Teacher's schedule",
  },
  {
    iconName: "university",
    screenName: "Classrooms",
    screenDescription: "Search details based on RoomNo & TimeSlot",
  },
  {
    iconName: "book",
    screenName: "Subjects",
    screenDescription: "Check assigned Teachers for a Subject",
  },
  {
    iconName: "calendar-alt",
    screenName: "Timetable",
    screenDescription: "Check a Class schedule",
  },
  {
    iconName: "user",
    screenName: "Login",
    screenDescription: "Login to SIS.CUI.ATD",
  },
  {
    iconName: "calendar-plus",
    screenName: "Freeslots",
    screenDescription: "Find free-slots for arranging extra classes",
    onPress: () => Alert.alert("Unstable feature!", "Use at your own risk"),
  },
];
