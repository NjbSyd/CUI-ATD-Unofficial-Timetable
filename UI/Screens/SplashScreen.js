import {View, StyleSheet, Image, Text} from "react-native";
import AnimatedLottieView from "lottie-react-native";
import React, {useState} from "react";
import {PopulateGlobalState} from "../../BackEnd/RequestGenerator";
import {useDispatch} from "react-redux";
import {useFonts} from "expo-font";

export default function SplashScreen({navigation}) {
  const [fontLoaded] = useFonts({
    'bricolage': require("../../assets/Fonts/BricolageGrotesque.ttf"),
  });
  const StateDispatcher = useDispatch();
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const onAnimationFinish = async () => {
    setInitialAnimationDone(true);
    try {
      setTimeout(async () => {
        await PopulateGlobalState(setLoadingText, StateDispatcher);
        setTimeout(() => {
          navigation.navigate("ApplicationEntry")
          alert("If You encounter any issues with data display, please use the reload icon on top right or restart the app.")
        }, 2000)
      }, 3000);
    } catch (error) {
      setLoadingText(error);
    }
  };
  return (
      <View style={{flex: 1}}>
        <AnimatedLottieView
            style={styles.splashContainer}
            source={require("../../assets/Images/SplashScreen.json")}
            resizeMode="center"
            autoPlay
            speed={1}
            loop={false}
            onAnimationFinish={onAnimationFinish}
            autoSize
        />
        {initialAnimationDone && (
            <>
              <AnimatedLottieView
                  style={styles.progressContainer}
                  source={require("../../assets/Images/Progress.json")}
                  resizeMode="center"
                  autoPlay
                  loop
                  autoSize
              />
              <Image
                  style={styles.image}
                  source={require("../../assets/Images/icon.png")}
              />
              <View
                  style={{position: "absolute", bottom: "27%", alignSelf: "center"}}
              >
                <Text
                    style={{
                      fontSize: 16,
                      color: "rgb(255,255,255)",
                      marginVertical: 40,
                      alignSelf: "center",
                      fontWeight: "100",
                      letterSpacing: 1,
                      fontFamily: fontLoaded ? "bricolage" : null
                    }}
                >
                  {loadingText}
                </Text>
              </View>
              <View
                  style={{position: "absolute", bottom: "5%", alignSelf: "center"}}
              >
                <Text
                    style={{
                      fontSize: 16,
                      color: "rgba(255,255,255,0.2)",
                      fontStyle: "italic",
                      includeFontPadding: true,
                      letterSpacing: 3,
                    }}
                >
                  Made with ❤ by NS
                </Text>
              </View>
            </>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
    width: "100%",
  },
  splashContainer: {
    width: "1000%",
    height: "100%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "40%",
    zIndex: 1,
    alignSelf: "center",
    position: "absolute",
    top: "20%",
  },
});
