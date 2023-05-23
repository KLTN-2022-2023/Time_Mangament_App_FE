import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import TaskListComponent from "./TaskListComponent";
import { FloatingAction } from "react-native-floating-action";
import Color from "../../Style/Color";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useState, useEffect, useRef } from "react";

export default ({ navigation }) => {
  // Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const actions = [
    {
      text: "Create New Task",
      name: "Create New Task",
      position: 2,
      color: Color.Button().ButtonActive,
    },
    {
      text: "Create New Type",
      name: "Create New Type",
      position: 1,
      color: Color.Button().ButtonActive,
    },
  ];

  const doAction = (name) => {
    if (name === "Create New Task") {
      navigation.navigate("AddTaskScreen", { taskId: null });
    } else if (name === "Create New Type") {
      navigation.navigate("AddTypeScreen", { typeId: null });
    }
  };

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
        let d = response.notification.request.content.data;
        console.log("Received", d);
        if (d && d.id) {
          navigation.navigate("AddTaskScreen", { taskId: d.id });
        }
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

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" backgroundColor={"#fff"}>
        <TaskListComponent navigation={navigation} />
      </Center>
      <FloatingAction
        distanceToEdge={{ vertical: 10, horizontal: 17 }}
        actions={actions}
        onPressItem={(name) => {
          doAction(name);
        }}
        color={Color.Button().ButtonActive}
      />
    </NativeBaseProvider>
  );
};
