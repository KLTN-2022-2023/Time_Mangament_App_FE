import { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { getListAllTasksByUserId } from "../../Reducers/TaskReducer";
import { getListAllTypesByUserId } from "../../Reducers/TypeReducer";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertDateTime, convertMonthYear } from "../../helper/Helper";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Color from "../../Style/Color";
import { Calendar } from "react-native-big-calendar";
import CommonData from "../../CommonData/CommonData";
import "dayjs/locale/vi";

export default ({ route, navigation }) => {
  // Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const allTypes = useSelector((state) => state.type.allTypes);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvent] = useState([]);
  const [mode, setMode] = useState("week");

  // Load Data
  useEffect(() => {
    handleGetAllTasks();
    handleGetAllTypes();
    handleSetDataCalendar();
  }, []);

  useEffect(() => {
    handleSetDataCalendar();
    handleGetAllTypes();
  }, [allTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    console.log("refresh");

    handleGetAllTypes();
    handleGetAllTasks();
    handleSetDataCalendar();
    setTimeout(() => {
      setRefreshing(false);
    }, 4000);
  };

  const handleGetAllTypes = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTypesByUserId({ userId: decoded._id }, token));
    }
  };

  const onSetDateNow = () => {
    setSelectedDate(new Date());
  };

  const onSetMode = () => {
    if (mode === "week") {
      setMode("month");
    } else {
      setMode("week");
    }
  };

  useEffect(() => {
    handleGetAllTasks();
    handleSetDataCalendar();
  }, [route?.params]);

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

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
  };

  const handleSetDataCalendar = () => {
    if (allTasks && allTasks.length > 0) {
      let list = allTasks.map((x) => {
        return {
          title: x.name,
          start: new Date(convertDateTime(x.startTime)),
          end: new Date(convertDateTime(x.dueTime)),
          id: x._id,
          status: x.status,
        };
      });

      setEvent(list);
    }
  };

  const handlePressEvent = (id) => {
    navigation.navigate("AddTaskScreen", {
      taskId: id,
      namePath: "Calendar",
    });
  };

  const handleShowMode = () => {
    if (mode === "week") {
      return "Tuần";
    }
    return "Tháng";
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Spinner visible={refreshing}></Spinner>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.buttonPlus}
          onPress={() => {
            let date = convertDateTime(selectedDate).split(" ")[0];
            navigation.navigate("AddTaskScreen", {
              taskId: null,
              selectedDate: date,
            });
          }}
        >
          <View>
            <Text style={styles.buttonPlusText}>+</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerButtons}>
          {/* <TouchableOpacity style={styles.button} onPress={() => onRefresh()}>
            <View>
              <Text style={styles.buttonText}>Refresh</Text>
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.button}
            onPress={() => onSetDateNow()}
          >
            <View>
              <Text style={styles.buttonText}>Hôm nay</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => onSetMode()}>
            <View>
              <Text style={styles.buttonText}>
                {"Xem: " + handleShowMode()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Month */}
      <View style={styles.monthContainer}>
        <Text style={styles.monthText}>{convertMonthYear(selectedDate)}</Text>
      </View>

      {/* Calendar */}
      <Calendar
        eventCellStyle={(e) => {
          if (e && e.status === CommonData.TaskStatus().Done) {
            return {
              backgroundColor: Color.CalendarTask().Done,
            };
          }

          return {
            backgroundColor: Color.CalendarTask().Main,
          };
        }}
        onPressCell={(e) => {
          if (mode === "month") {
            setSelectedDate(e);
            setMode("week");
          }
        }}
        onPressDateHeader={(e) => {
          setSelectedDate(e);
        }}
        onPressEvent={(e) => {
          handlePressEvent(e.id);
        }}
        onChangeDate={(e) => {
          setDateRange(e);
          setSelectedDate(e[0]);
        }}
        activeDate={selectedDate}
        events={events}
        mode={mode}
        date={selectedDate}
        bodyContainerStyle={{ backgroundColor: "#fff" }}
        headerContainerStyle={{ backgroundColor: "#fff" }}
        weekStartsOn={1}
        height={600}
        hideNowIndicator={true}
        locale="vi"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    color: Color.Button().ButtonActive,
  },
  headerButtons: {
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "row-reverse",
    gap: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  monthContainer: {
    backgroundColor: "#fff",
    paddingBottom: 10,
    paddingTop: 5,
    alignItems: "center",
  },
  monthText: {
    fontSize: 18,
    color: "#212529",
    fontWeight: "500",
  },
  button: {
    borderColor: Color.Button().ButtonActive,
    borderWidth: 1,
    padding: 4,
    borderRadius: 12,
  },
  header: {
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  buttonPlus: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: Color.Button().ButtonActive,
  },
  buttonPlusText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    color: "#fff",
  },
});
