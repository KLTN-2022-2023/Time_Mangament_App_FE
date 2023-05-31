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
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_FETCH_TASK = "background-fetch";

export default function MainLayout({ navigation, triggers }) {
  // Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);

  // 1. Define the task by providing a name and the function that should be executed
  // Note: This needs to be called in the global scope (e.g outside of your React components)
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    console.log("Job Background: " + new Date().toString());
    await resendNotification();

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

  // 2. Register the task at some point in your app by providing the same name,
  // and some configuration options for how the background fetch should behave
  // Note: This does NOT need to be in the global scope and CAN be used in your React components!
  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 1 min
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  // 3. (Optional) Unregister tasks by specifying the task name
  // This will cancel any future background fetch calls that match the given name
  // Note: This does NOT need to be in the global scope and CAN be used in your React components!
  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }

  useEffect(() => {
    checkStatusAsync();
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

  // read notifications after 1 minute foreground
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("Job Foreground: " + new Date().toString());
      await resendNotification();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // read notifications after 1 minute background
  useEffect(() => {
    console.log(isRegistered);
    if (!isRegistered) {
      registerBackgroundFetchAsync();
      checkStatusAsync();
    }
  }, [isRegistered]);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const resendNotification = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
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
  };

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
