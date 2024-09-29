import React from "react";
import { StyleSheet, Text, View } from "react-native";

import NoResults from "./NoResults";
import { ClickableText } from "../Components/ClickableText";
import Theme from "../Constants/Theme";

function renderClassroomBasedItem(item) {
  const {
    id,
    class_name,
    day,
    subject,
    teacher,
    class_room,
    time_slot,
    extra,
  } = item;
  return (
    <View key={id} style={styles.outerContainer}>
      <View style={styles.innerTopContainer}>
        <Text style={styles.topBoldText}>{class_name}</Text>
        <Text style={styles.topBoldText}>{day}</Text>
      </View>
      <View style={styles.innerBottomContainer}>
        <Text style={styles.bottomImportantText}>{subject}</Text>
        {teacher && (
          <ClickableText
            style={styles.bottomImportantText2}
            text={teacher}
            onPress={() => console.log(teacher)}
          />
        )}
        <Text style={styles.bottomNormalText}>{class_room}</Text>
        <Text style={styles.bottomNormalText}>{time_slot}</Text>
        {extra && <Text style={styles.bottomNormalText}>{extra}</Text>}
      </View>
    </View>
  );
}

function renderTeacherBasedItem(item) {
  const { id, class_name, day, subject, class_room, time_slot } = item;

  return (
    <View key={id} style={styles.outerContainer}>
      <View style={styles.innerTopContainer}>
        <ClickableText
          style={styles.topBoldText}
          text={class_name}
          onPress={() => console.log(class_name)}
        />
        <Text style={styles.topBoldText}>{day}</Text>
      </View>
      <View style={styles.innerBottomContainer}>
        <ClickableText
          style={styles.bottomImportantText}
          text={subject}
          onPress={() => null}
        />
        <Text style={styles.bottomNormalText}>{class_room}</Text>
        <Text style={styles.bottomNormalText}>{time_slot}</Text>
      </View>
    </View>
  );
}

function renderSubjectBasedItem(item) {
  const { id, teacher, subject, class_name } = item;

  return (
    <View key={id} style={styles.outerContainer}>
      <View style={styles.innerTopContainer}>
        <ClickableText
          text={teacher}
          onPress={() => {
            console.log(teacher);
          }}
          style={styles.topBoldText}
        />
      </View>
      <View style={styles.innerBottomContainer}>
        <ClickableText
          text={subject}
          onPress={() => null}
          style={styles.bottomImportantText}
        />
        <Text style={styles.bottomImportantText2}>{class_name}</Text>
      </View>
    </View>
  );
}

function renderFreeSlotBasedItem(item) {
  return (
    <View key={item} style={styles.itemContainer}>
      <Text style={styles.innerItemText}>{item}</Text>
    </View>
  );
}

export function List({ data, type }) {
  if (!data || data.length <= 0) {
    return <NoResults />;
  }
  const renderItemMap = {
    Classroom: renderClassroomBasedItem,
    Teacher: renderTeacherBasedItem,
    Subject: renderSubjectBasedItem,
    FreeSlot: renderFreeSlotBasedItem,
  };

  const renderFunction = renderItemMap[type];

  if (!renderFunction) {
    return <Text>Invalid Type</Text>;
  }
  if (type === "FreeSlot") {
    data = Object.keys(data);
  }

  return data.length === 0 ? <Text>No Record</Text> : data.map(renderFunction);
}

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 10,
    borderColor: "#cccccc",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  innerTopContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#f0f0f0",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
    padding: 10,
    elevation: 10,
  },
  innerBottomContainer: {
    padding: 10,
  },
  topBoldText: { fontSize: 18, fontWeight: "bold" },
  bottomImportantText: { fontSize: 16, color: Theme.COLORS.BLACK },
  bottomImportantText2: { fontSize: 14, color: Theme.COLORS["BLACK-2"] },
  bottomNormalText: {
    fontSize: 12,
    color: Theme.COLORS["BLACK-1"],
  },
  innerItemText: {
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    elevation: 5,
    borderRadius: 5,
    backgroundRadius: 50,
    marginBottom: 10,
    marginHorizontal: 30,
  },
});
