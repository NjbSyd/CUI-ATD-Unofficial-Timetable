import React, { useState } from "react";
import { TouchableOpacity, Text, Modal, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function DropdownMenu({ onReloadCache }) {
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownOption}
        onPress={onReloadCache}
        pointerEvents="none"
      >
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

function ThreeDotMenu({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAboutScreenNavigator = () => {
    navigation.navigate("AboutMe");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <MaterialCommunityIcons name="dots-vertical" size={30} color="black" />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View
          style={styles.modalContainer}
          onTouchEnd={() => {
            setModalVisible(false);
          }}
        >
          <DropdownMenu onReloadCache={handleAboutScreenNavigator} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 13,
    right: 16,
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#47267d",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 1,
  },
  dropdownOption: {
    paddingVertical: 10,
    alignItems: "center",
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: "white",
  },
});

export { ThreeDotMenu };
