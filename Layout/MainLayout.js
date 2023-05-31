import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";
import {
  getListNotificationByUserId,
  DeleteNotification,
} from "../Reducers/NotificationTriggerReducer";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import jwt_decode from "jwt-decode";
import { convertDateTime } from "../helper/Helper";

export default function MainLayout({ navigation, triggers }) {
  // Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          let d = response.notification.request.content.data;
          if (d && d.id) {
            const token = await AsyncStorage.getItem("Token");
            if (token) {
              await DeleteNotification(d.id, token);
            }

            navigation.navigate("AddTaskScreen", { taskId: d.id });
          }
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // read notifications after 1 minutes foreground
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = await AsyncStorage.getItem("Token");
      if (token) {
        console.log("Job: " + new Date().toString());

        const decoded = jwt_decode(token);
        let listNoti = await getListNotificationByUserId(
          { userId: decoded._id },
          token
        );

        if (listNoti && listNoti.length > 0) {
          console.log(listNoti);
          for (let noti of listNoti) {
            if (!noti.isSeen) {
              let nowString = convertDateTime(new Date());
              let remindString = convertDateTime(noti.remindTime);
              if (nowString > remindString) {
                await schedulePushNotification(
                  "Có thể bạn đã bỏ lỡ",
                  noti.content,
                  noti.taskId
                );
              }
            }
          }
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // read notifications after 2 minutes background

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

  async function schedulePushNotification(title, content, idTask) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: content,
        data: {
          id: idTask,
        },
      },
      trigger: { seconds: 2 },
    });
  }

  return <View></View>;
}
