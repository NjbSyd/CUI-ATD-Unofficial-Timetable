import ExpoSQLiteDialect from "@expo/knex-expo-sqlite-dialect";
import Knex from "knex";

export const KnexDB = Knex({
  client: ExpoSQLiteDialect,
  connection: {
    filename: "TimeTable.db",
  },
  useNullAsDefault: true,
});

const createTimetableDataTable = async () => {
  try {
    const hasTable = await KnexDB.schema.hasTable("timetables");
    const has_idColumn = await KnexDB.schema.hasColumn("timetables", "_id");
    if (has_idColumn) {
      await KnexDB.schema.alterTable("timetables", (table) => {
        table.renameColumn("_id", "id");
      });
    }
    const has_extraColumn = await KnexDB.schema.hasColumn(
      "timetables",
      "extra"
    );
    if (hasTable) {
      if (!has_extraColumn) {
        await KnexDB.schema.alterTable("timetables", (table) => {
          table.string("extra").nullable();
        });
      }
    } else if (!hasTable) {
      await KnexDB.schema.createTable("timetables", (table) => {
        table.string("id").primary();
        table.string("class_name");
        table.string("class_room");
        table.string("day");
        table.string("subject");
        table.string("teacher");
        table.string("time_slot");
        table.string("extra").nullable();
      });
    }
  } catch (_) {}
};

const batchInsertTimetableData = async (inputDataArray) => {
  console.log(
    "🚀 ~ batchInsertTimetableData ~ inputDataArray:",
    inputDataArray.length
  );
  try {
    await clearTimetableTable();
    await KnexDB.batchInsert("timetables", inputDataArray, 500).returning("id");
  } catch (error) {
    console.log("🚀 ~ batchInsertTimetableData ~ error:", error);
    throw new Error("Error inserting data");
  }
};

const createUserCredentialsTable = async () => {
  try {
    const hasTable = await KnexDB.schema.hasTable("UserCredentials");
    if (!hasTable) {
      await KnexDB.schema.createTable("UserCredentials", (table) => {
        table.increments("id").primary();
        table.string("RegistrationNumber");
        table.string("Password");
        table.string("Image");
      });
    }
  } catch (_) {}
};

async function insertOrUpdateUserCredentials(registrationNumber, password) {
  await createUserCredentialsTable();
  try {
    await KnexDB("UserCredentials")
      .insert({
        RegistrationNumber: registrationNumber,
        Password: password,
        Image: "null",
      })
      .onConflict("id")
      .merge({ Password: password });
  } catch (_) {}
}

const updateImagePath = async (registrationNumber, imagePath) => {
  try {
    await KnexDB("UserCredentials")
      .where("RegistrationNumber", registrationNumber)
      .update({ Image: imagePath });
  } catch (_) {}
};

const clearTimetableTable = async () => {
  try {
    await KnexDB("timetables").truncate();
  } catch (_) {}
};

async function initializeAllDatabasesAndTables() {
  await createTimetableDataTable();
  await createUserCredentialsTable();
}

export {
  initializeAllDatabasesAndTables,
  createTimetableDataTable,
  clearTimetableTable,
  insertOrUpdateUserCredentials,
  createUserCredentialsTable,
  updateImagePath,
  batchInsertTimetableData,
};
