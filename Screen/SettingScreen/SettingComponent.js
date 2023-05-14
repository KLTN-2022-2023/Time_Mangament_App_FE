import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Avatar,
  Box,
  Center,
  HStack,
  NativeBaseProvider,
  Text,
  View,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import IconICon from "react-native-vector-icons/Ionicons";
import IconEntypo from "react-native-vector-icons/Entypo";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { getUserById } from "../../Reducers/UserReducer";
import { SetNotificationTriggerList } from "../../Reducers/NotificationTriggerReducer";

// Notification
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// Warning
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SettingComponent = ({ navigation }) => {
  // Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const HandleGetInfoUser = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getUserById({ userId: decoded._id }, token));
    }
  };

  useEffect(() => {
    HandleGetInfoUser();
  });

  // Notification
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Received");
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const cancelNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const HandleLogOut = async () => {
    await AsyncStorage.removeItem("Token");
    await cancelNotification();
    dispatch(SetNotificationTriggerList([]));
    navigation.navigate("LoginScreen");
  };

  const style = StyleSheet.create({
    padding: {
      paddingBottom: 20,
      paddingTop: 20,
    },
    shadow: {
      borderBottomColor: "black",
      borderBottomWidth: StyleSheet.hairlineWidth,
      shadowColor: "#000000",
      borderColor: "#000000",
      shadowOpacity: 1.0,
      shadowRadius: 0,
      shadowOffset: {
        height: 3,
        width: 5,
      },
      elevation: 2,
    },
  });

  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="2" w="100%" minW="370" width="100%">
          <HStack
            paddingLeft={5}
            paddingTop={4}
            backgroundColor={"#0066FF"}
            alignItems={"center"}
            justifyContent="flex-start"
            paddingBottom={6}
            width={"100%"}
          >
            <IconICon
              color={"#FFFFFF"}
              size={25}
              name="arrow-back"
              onPress={() =>
                navigation.navigate("HomeTab", { screen: "Tasks" })
              }
            />
            <Text
              color={"#FFFFFF"}
              width={"95%"}
              paddingLeft={8}
              fontSize={20}
              fontWeight={800}
            >
              Settings
            </Text>
          </HStack>
          <View paddingLeft={18} paddingRight={18} paddingTop={5}>
            <HStack alignItems={"center"}>
              <Avatar
                bg="amber.500"
                source={{
                  uri: "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg",
                }}
              ></Avatar>
              <Text fontSize={20} fontWeight={500}>
                {user.name}
              </Text>
            </HStack>
            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
            />
            <Text color={"#C0C0C0"}>Account settings</Text>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              height={50}
            >
              <Text fontSize={18} fontWeight={500}>
                Edit profile
              </Text>
              <IconEntypo
                size={18}
                name="chevron-small-right"
                onPress={() => navigation.navigate("UserDetailScreen")}
              />
            </HStack>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              height={50}
            >
              <Text fontSize={18} fontWeight={500}>
                Log out
              </Text>
              <IconEntypo
                size={18}
                name="chevron-small-right"
                onPress={HandleLogOut}
              />
            </HStack>
          </View>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};
export default SettingComponent;
