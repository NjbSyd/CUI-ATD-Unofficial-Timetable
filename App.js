import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox } from "react-native";

import { subscribeToChanges } from "./BackEnd/Supabase";
import { withReduxProvider } from "./Redux";
import { loadFonts } from "./UI/Functions/UIHelpers";
import ApplicationEntry from "./UI/Screens/ApplicationEntry";
import ErrorScreen from "./UI/Screens/ErrorScreen";
import SplashScreen from "./UI/Screens/SplashScreen";

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    loadFonts().then(null);
    const unSubscribe = subscribeToChanges();
    return () => {
      unSubscribe();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          headerLeft: () => null,
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="ApplicationEntry"
          component={ApplicationEntry}
          getId={() => "ApplicationEntry"}
        />
        <Stack.Screen name="Error" component={ErrorScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default () => withReduxProvider(<App />);
