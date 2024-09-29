import { KnexDB } from "./KnexDB";

const GetDistinctValues = async (columnName, tableName, orderBy) => {
  try {
    if (orderBy) {
      const results = await KnexDB(tableName)
        .distinct(columnName)
        .select(columnName)
        .orderByRaw(`${orderBy}`);
      return results.map((item) => ({
        label: item[columnName],
        value: item[columnName],
      }));
    } else {
      const results = await KnexDB(tableName)
        .distinct(columnName)
        .select(columnName);
      return results.map((item) => ({
        label: item[columnName],
        value: item[columnName],
      }));
    }
  } catch (error) {
    throw error;
  }
};
const GetTeacherNames = async () =>
  await GetDistinctValues("teacher", "timetables", "teacher");
const GetSubjectNames = async () =>
  await GetDistinctValues("subject", "timetables", "subject ASC");
const GetTimeSlots = async () =>
  await GetDistinctValues("time_slot", "timetables", "time_slot ASC");
const GetClassRooms = async () =>
  await GetDistinctValues("class_room", "timetables", "class_room ASC");
const GetClassNames = async () =>
  await GetDistinctValues("class_name", "timetables", "class_name ASC");

const GetUsers = async () => {
  try {
    const distinctRegistrationNumbers = await GetDistinctValues(
      "RegistrationNumber",
      "UserCredentials",
      null
    );

    return await Promise.all(
      distinctRegistrationNumbers.map(async (user) => {
        const imagePath = await KnexDB("UserCredentials")
          .select("Image")
          .where("RegistrationNumber", user.value)
          .first();
        const image = imagePath?.Image;
        return {
          label: user.label,
          image,
        };
      })
    );
  } catch (error) {
    throw error;
  }
};

const GetUserCredentialsByRegistrationNumber = async (RegistrationNumber) => {
  try {
    const userCredentials = await KnexDB("UserCredentials")
      .where("RegistrationNumber", RegistrationNumber)
      .first();
    return userCredentials || null;
  } catch (error) {
    throw error;
  }
};

const GetTeachersSchedule = async (teacher) => {
  try {
    return await KnexDB("timetables").where("teacher", teacher).orderByRaw(`
        CASE day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END
      `);
  } catch (error) {
    throw error;
  }
};

const GetSubjectsSchedule = async (subject) => {
  try {
    const resultSet = await KnexDB("timetables")
      .select("id", "subject", "teacher", "class_name")
      .where("subject", subject)
      .groupBy("class_name", "teacher")
      .orderBy("teacher");

    return resultSet;
  } catch (error) {
    throw error;
  }
};

const GetTimeslotBasedClassRoomTimetable = async (class_room, time_slot) => {
  try {
    const resultSet = await KnexDB("timetables")
      .where("class_room", class_room)
      .where("time_slot", time_slot).orderByRaw(`
        CASE day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END
      `);

    return resultSet;
  } catch (error) {
    throw error;
  }
};

const GetTimetableByClassName = async (class_name) => {
  try {
    return await KnexDB("timetables")
      .select(
        "id",
        "class_name",
        "class_room",
        "day",
        "subject",
        "teacher",
        "time_slot",
        "extra"
      )
      .where("class_name", class_name).orderByRaw(`
        CASE day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
          ELSE 8
        END,
        time_slot
      `);
  } catch (error) {
    throw error;
  }
};

const DeleteUserCredentialsFromDB = async (registrationNumber) => {
  try {
    await KnexDB("UserCredentials")
      .where("RegistrationNumber", registrationNumber)
      .del();
  } catch (error) {
    throw error;
  }
};

export {
  GetTeacherNames,
  GetTimeSlots,
  GetClassRooms,
  GetSubjectNames,
  GetTeachersSchedule,
  GetTimeslotBasedClassRoomTimetable,
  GetSubjectsSchedule,
  GetClassNames,
  GetTimetableByClassName,
  DeleteUserCredentialsFromDB,
  GetUserCredentialsByRegistrationNumber,
  GetUsers,
};
