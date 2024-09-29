import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Button, IconButton, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { updateUserCredentialsState } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { insertOrUpdateUserCredentials } from "../../BackEnd/KnexDB";
import {
  DeleteUserCredentialsFromDB,
  GetUserCredentialsByRegistrationNumber,
} from "../../BackEnd/KnexDB_Search";
import { SelectDistintDepartmentNames } from "../../Redux/Selectors";
import Theme from "../Constants/Theme";
import { formatInput } from "../Functions/PortalLoginHelpers";

const ScreenWidth = Dimensions.get("window").width;

const LoginScreen = ({ navigation }) => {
  const StateDispatcher = useDispatch();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      updateUserCredentialsState(StateDispatcher)
        .then(() => {})
        .catch(null);
    }, [])
  );
  const users = useSelector((state) => state.StudentCredentialsSlice.users);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [editSavedUsers, setEditSavedUsers] = useState(false);
  const departments = useSelector(SelectDistintDepartmentNames);

  const handleLogin = async () => {
    if (username === "" || password === "") {
      ToastAndroid.show("Please fill all the fields!", ToastAndroid.SHORT);
      return;
    }
    if (username.split("-").length !== 3) {
      ToastAndroid.show("Invalid Registration No!", ToastAndroid.SHORT);
      return;
    }
    if (departments.indexOf(username.split("-")[1]) === -1) {
      ToastAndroid.show("Invalid Department!", ToastAndroid.SHORT);
      return;
    }
    if (rememberMe) {
      await insertOrUpdateUserCredentials(username, password);
    } else {
      Alert.alert(
        "Credentials Not Saved⛔",
        "You opted to NOT save credentials, But it is recommended for ease of use in the future.",
        ["Ok"],
        { cancelable: true }
      );
    }
    const id = username,
      pass = password;
    setUsername("");
    setPassword("");
    setRememberMe(true);
    setShowPassword(false);
    setEditSavedUsers(false);
    navigation.navigate("Portal", { id, pass });
  };

  const handleUsernameChange = (text) => {
    const formattedText = formatInput(text, username, departments);
    setUsername(formattedText);
  };

  const handleSavedUserLogin = async (user) => {
    if (editSavedUsers) {
      DeleteUserCredentialsFromDB(user.label)
        .then(() => {
          updateUserCredentialsState(StateDispatcher)
            .then(() => {})
            .catch(null);
        })
        .catch(null);
    } else {
      GetUserCredentialsByRegistrationNumber(user.label).then((res) => {
        setUsername(res.RegistrationNumber);
        setPassword(res.Password);
        setRememberMe(true);
        setShowPassword(false);

        navigation.navigate("Portal", {
          id: res.RegistrationNumber,
          pass: res.Password,
          img: res.Image,
        });
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title} allowFontScaling numberOfLines={1}>
          Welcome Back!
        </Text>
        <TextInput
          label="Registration No"
          placeholder="FA20-BSE-023"
          placeholderTextColor="lightgrey"
          cursorColor="#000"
          value={username}
          onChangeText={handleUsernameChange}
          style={styles.input}
          mode="outlined"
          activeOutlineColor={Theme.COLORS.MAIN}
          contextMenuHidden
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          right={
            <TextInput.Icon
              size={24}
              style={{
                marginTop: 10,
              }}
              color={Theme.COLORS.MAIN}
              animated
              onPress={() => setShowPassword(!showPassword)}
              icon={showPassword ? "eye-off" : "eye"}
            />
          }
          activeOutlineColor={Theme.COLORS.MAIN}
          autoComplete="password"
        />
        <CheckBox
          checked={rememberMe}
          center
          onPress={() => setRememberMe(!rememberMe)}
          title="Remember Me"
          checkedColor={Theme.COLORS.MAIN}
          style={styles.rememberMe}
        />
        <Button
          mode="elevated"
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: "bold", fontSize: 20 }}
          style={{
            borderRadius: Theme.SIZES.BASE,
          }}
          onPress={handleLogin}
          buttonColor={Theme.COLORS.MAIN}
          textColor={Theme.COLORS.WHITE}
        >
          Login
        </Button>
      </View>
      {users.length !== 0 && users[0].label !== "null" && !isKeyboardOpen && (
        <View style={styles.savedUsersOuterContainer}>
          <View
            style={{
              width: "100%",
              height: Theme.SIZES.BASE * 3,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: Theme.COLORS.BORDER_COLOR,
              marginBottom: Theme.SIZES.BASE,
              borderRadius: Theme.SIZES.BASE,
              elevation: 1,
            }}
          >
            <Text
              style={styles.savedUsersLabel}
              allowFontScaling
              numberOfLines={1}
            >
              Saved Users:
            </Text>
            <IconButton
              icon={editSavedUsers ? "close" : "pencil"}
              size={24}
              onPress={() => setEditSavedUsers(!editSavedUsers)}
              animated
              iconColor={Theme.COLORS.MAIN}
              containerColor={Theme.COLORS.WHITE}
            />
          </View>
          <FlatList
            data={users}
            numColumns={4}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userContainer}
                onPress={() => handleSavedUserLogin(item)}
              >
                {item.image !== "null" ? (
                  <Avatar.Image
                    size={Theme.SIZES.BASE * 3.5}
                    source={{ uri: item.image }}
                  />
                ) : (
                  <Avatar.Text
                    size={Theme.SIZES.BASE * 3.5}
                    label={item.label.split("-")[2]}
                    color="white"
                    style={styles.avatarTextStyle}
                  />
                )}
                <Text style={styles.userLabel}>{item.label}</Text>
                {editSavedUsers && (
                  <FontAwesome5
                    name="trash"
                    size={Theme.SIZES.BASE}
                    color="white"
                    style={styles.deleteSavedUserBtn}
                    allowFontScaling
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: Theme.COLORS.MAIN,
    fontVariant: ["small-caps"],
    letterSpacing: 1,
  },
  input: {
    width: ScreenWidth * 0.85,
    height: ScreenWidth / 8,
    marginBottom: 16,
  },
  showPasswordButton: {
    marginLeft: 5,
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: "5%",
  },
  showPasswordButtonText: {
    color: "#4CAF50",
  },
  rememberMe: {
    marginVertical: 10,
  },
  button: {
    width: "60%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  savedUsersOuterContainer: {
    flex: 1,
    justifyContent: "center",
    width: "90%",
    alignItems: "center",
    padding: Theme.SIZES.BASE * 0.5,
  },
  loginContainer: {
    flex: 1.5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  savedUsersLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: Theme.COLORS.MAIN,
    width: "60%",
  },
  deleteSavedUserBtn: {
    position: "absolute",
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "red",
    padding: Theme.SIZES.BASE,
    borderRadius: Theme.SIZES.BASE * 2,
    height: Theme.SIZES.BASE * 3.5,
    width: Theme.SIZES.BASE * 3.5,
  },
  userContainer: {
    marginRight: Theme.SIZES.BASE,
    alignItems: "center",
  },
  avatarTextStyle: { backgroundColor: "#3e7fbd" },
  userLabel: {
    fontSize: Theme.SIZES.FONT * 0.8,
    color: "#333",
    fontFamily: "bricolage",
    textAlign: "center",
  },
});

export default LoginScreen;
