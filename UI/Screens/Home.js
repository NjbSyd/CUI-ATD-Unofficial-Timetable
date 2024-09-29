import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { BackHandler, FlatList, StyleSheet, View } from "react-native";

import { RenderButton } from "../Components/MainScreenButton";
import { HomeButtonsData } from "../Constants/HomeButtonsData";
import Theme from "../Constants/Theme";
import { handleBackPress } from "../Functions/UIHelpers";

const Main = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <></>,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = handleBackPress;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme.COLORS.WHITE,
      }}
    >
      <FlatList
        style={{
          height: Theme.ScreenHeight * 0.9,
          flex: 1,
          paddingBottom: Theme.ScreenHeight * 0.1,
        }}
        numColumns={2}
        contentContainerStyle={styles.buttonContainer}
        data={HomeButtonsData}
        keyExtractor={(item, index) => `${item.screenName}${index}`}
        renderItem={({ item }) => (
          <RenderButton
            iconName={item.iconName}
            screenName={item.screenName}
            screenDescription={item.screenDescription}
            navigation={navigation}
            onPress={item?.onPress ?? (() => null)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "space-between",
    maxWidth: "100%",
    marginTop: 0,
    marginHorizontal: 10,
  },
});

export default Main;
