import { setClassRoom } from "../../Redux/Slices/ClassRoomSlice";
import { setClassNames } from "../../Redux/Slices/SectionSlice";
import { setRegistration } from "../../Redux/Slices/StudentCredentialsSlice";
import { setSubjectNames } from "../../Redux/Slices/SubjectSlice";
import { setTeacherNames } from "../../Redux/Slices/TeacherSlice";
import { setTimeslot } from "../../Redux/Slices/TimeslotSlice";
import {
  GetClassNames,
  GetClassRooms,
  GetSubjectNames,
  GetTeacherNames,
  GetTimeSlots,
  GetUsers,
} from "../KnexDB_Search";

async function fetchDataFromSQLite(StateDispatcher, type) {
  try {
    if (type === "all") {
      await updateUserCredentialsState(StateDispatcher);

      const timeSlots = await GetTimeSlots();
      StateDispatcher(setTimeslot(timeSlots));

      const teacherNames = await GetTeacherNames();
      StateDispatcher(setTeacherNames(teacherNames));

      const subjectNames = await GetSubjectNames();
      StateDispatcher(setSubjectNames(subjectNames));

      const classRooms = await GetClassRooms();
      StateDispatcher(setClassRoom(classRooms));

      const sectionNames = await GetClassNames();
      StateDispatcher(setClassNames(sectionNames));
    }
    if (typeof type === "object") {
      if (type.includes("timeSlots")) {
        const timeSlots = await GetTimeSlots();
        StateDispatcher(setTimeslot(timeSlots));
      }
      if (type.includes("teachers")) {
        const teacherNames = await GetTeacherNames();
        StateDispatcher(setTeacherNames(teacherNames));
      }
      if (type.includes("subjects")) {
        const subjectNames = await GetSubjectNames();
        StateDispatcher(setSubjectNames(subjectNames));
      }
      if (type.includes("classRooms")) {
        const classRooms = await GetClassRooms();
        StateDispatcher(setClassRoom(classRooms));
      }
      if (type.includes("sections")) {
        const sectionNames = await GetClassNames();
        StateDispatcher(setClassNames(sectionNames));
      }
      if (type.includes("registration")) {
        await updateUserCredentialsState(StateDispatcher);
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
}

async function updateUserCredentialsState(StateDispatcher) {
  try {
    const users = await GetUsers();
    if (users.length === 0) {
      StateDispatcher(setRegistration([{ label: "null", image: "null" }]));
      return;
    }
    const usernames = [];

    for (let i = 0; i < users.length; i++) {
      const singleUserModel = {
        label: users[i].label,
        image: users[i].image,
      };
      usernames.push(singleUserModel);
    }
    StateDispatcher(setRegistration(usernames));
  } catch (error) {
    throw error;
  }
}

export { fetchDataFromSQLite, updateUserCredentialsState };
