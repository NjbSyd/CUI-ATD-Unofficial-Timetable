import { createSelector } from "@reduxjs/toolkit";

export const SelectClassNames = (state) => state.SectionSlice.class_name;
// class_name is an array of this formate: class_name: [{label: string, value: string}]
// e.g. class_name: [{label: "CS-1A", value: "CS-1A"}, {label: "BCS 1B", value: "BSE 1B"}]
// This selector returns the department part of class_names as array from the state.
export const SelectDistintDepartmentNames = createSelector(
  SelectClassNames,
  (class_name) => {
    const departmentNames = class_name.map((item) => item.value.split(" ")[0]);
    return [...new Set(departmentNames)];
  },
);
