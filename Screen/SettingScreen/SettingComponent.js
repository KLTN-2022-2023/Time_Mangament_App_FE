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
import IconEntypo from "react-native-vector-icons/Entypo";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { getUserById } from "../../Reducers/UserReducer";
import { SetNotificationTriggerList } from "../../Reducers/NotificationTriggerReducer";
import { getTaskList } from "../../Reducers/TaskReducer";
import { getTypeList } from "../../Reducers/TypeReducer";
import { getUser } from "../../Reducers/UserReducer";

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

const SettingComponent = ({ route, navigation }) => {
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
  }, []);

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
    dispatch(getTaskList([]));
    dispatch(getTypeList([]));
    dispatch(getUser({ _id: null, name: null }));
    navigation.navigate("LoginScreen");
  };

  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="2" w="100%" minW="370" width="100%">
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
            <Text color={"#C0C0C0"}>Cài đặt tài khoản</Text>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              height={50}
            >
              <Text fontSize={18} fontWeight={500}>
                Chỉnh sửa thông tin cá nhân
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
                Đăng xuất
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
