import {
  Box,
  Center,
  Modal,
  View,
  Text,
  Checkbox,
  HStack,
  TextArea,
} from "native-base";
import { useEffect, useState, useRef } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  CreateTask,
  DeleteTask,
  UpdateTask,
  Upload,
  CreateRepeat,
} from "../../Reducers/TaskReducer";
import { SetNotificationTriggerList } from "../../Reducers/NotificationTriggerReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { getListAllTasksByUserId } from "../../Reducers/TaskReducer.js";
import Spinner from "react-native-loading-spinner-overlay";
import Color from "../../Style/Color";
import CommonData from "../../CommonData/CommonData";
import PopupComponent from "../../Component/Common/PopupComponent";
import RepeatModal from "../../Component/Task/RepeatModal";
import TypeModal from "../../Component/Task/TypeModal";
import CreateTypeModal from "../../Component/Task/CreateTypeModal";
import { formatDateUI } from "../../helper/Helper";
import { DaysRemind } from "../../CommonData/Data";

// Warning
import { LogBox } from "react-native";

// Notification
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import RemindModal from "../../Component/Task/RemindModal";
import { convertDateTime } from "../../helper/Helper";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default ({ navigation, taskId }) => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("New Task");
  const [note, setNote] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remind, setRemind] = useState(null);
  const [remindTime, setRemindTime] = useState(null);
  const [repeat, setRepeat] = useState(null);
  const [type, setType] = useState(null);
  const [open, setOpen] = useState(false);
  const [dataBackup, setDataBackup] = useState(null);

  // Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Modal
  const [modalRepeat, setModalRepeat] = useState(false);
  const [modalRemind, setModalRemind] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [modalCreateType, setModalCreateType] = useState(false);

  // Validate
  const [errorNameRequired, setErrorNameRequired] = useState(false);
  const [errorTypeRequired, setErrorTypeRequired] = useState(false);
  const [errorDates, setErrorDates] = useState(false);
  const [errorStartPast, setStartPast] = useState(false);
  const [errorOverlap, setErrorOverlap] = useState(false);
  const [errorRemindPast, setRemindPast] = useState(false);
  const [errorRepeatTimePast, setRepeatTimePast] = useState(false);
  const [errorRepeatOverlap, setErrorRepeatOverlap] = useState(false);
  const [errorInvalidDaysWeek, setInvalidDaysWeek] = useState(false);

  // Start
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [calendarStartDate, setCalendarStartDate] = useState(false);
  const [calendarStartTime, setCalendarStartTime] = useState(false);

  // Due
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [calendarDueDate, setCalendarDueDate] = useState(false);
  const [calendarDueTime, setCalendarDueTime] = useState(false);

  // End Repeat
  const [endRepeat, setEndRepeat] = useState(null);
  const [calendarEndRepeat, setCalendarEndRepeat] = useState(false);

  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const allTypes = useSelector((state) => state.type.allTypes);
  const allTriggers = useSelector(
    (state) => state.notificationTrigger.allTriggers
  );

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

  // Get Detail
  useEffect(() => {
    let foundItem = allTasks.find((x) => x._id === taskId);
    if (foundItem) {
      setData(foundItem);
      setDataBackup(foundItem);

      let remindTimeString = convertDateTime(foundItem.remindTime);

      //set Data
      setName(foundItem.name);
      setNote(foundItem.description);
      setType(allTypes.find((x) => x._id === foundItem.typeId));
      setRemind(foundItem.remindMode);
      setRemindTime(remindTimeString);
      setRepeat(foundItem.repeatTime);
      setIsImportant(foundItem.isImportant);
      setIsDone(
        foundItem.status === CommonData.TaskStatus().Done ? true : false
      );

      let startTimeString = convertDateTime(foundItem.startTime);
      let dueTimeString = convertDateTime(foundItem.dueTime);

      setStartDate(startTimeString.split(" ").shift());
      setStartTime(startTimeString.split(" ")[1]);
      setDueDate(dueTimeString.split(" ").shift());
      setDueTime(dueTimeString.split(" ")[1]);

      if (foundItem.endRepeat) {
        let endRepeatString = convertDateTime(foundItem.endRepeat);

        setEndRepeat(endRepeatString.split(" ").shift());
      }
    } else {
      setData(null);
    }
  }, [taskId]);

  // Set default
  useEffect(() => {
    if (!taskId) {
      let dateNowString = convertDateTime(new Date());

      setStartDate(dateNowString.split(" ").shift());
      setStartTime(dateNowString.split(" ")[1]);
      setDueDate(dateNowString.split(" ").shift());
      setDueTime(dateNowString.split(" ")[1]);
      setEndRepeat(dateNowString.split(" ").shift());

      setType(allTypes ? allTypes.filter((x) => !x.isDeleted)[0] : null);
    }
  }, []);

  // Validate dates, remind, repeat
  useEffect(() => {
    let result = handleValidate(false, true, true, true);
    setErrorRepeatOverlap(false);
  }, [startDate, startTime, dueDate, dueTime]);
  useEffect(() => {
    let result = handleValidate(false, false, false, true);
    setErrorRepeatOverlap(false);
  }, [endRepeat, repeat]);
  useEffect(() => {
    let result = handleValidate(false, false, true, false);
    setErrorRepeatOverlap(false);
  }, [remind, remindTime]);

  // Validate type
  useEffect(() => {
    let result = handleValidate(true, false, false, false);
  }, [type]);

  // Recalculate Remind
  useEffect(() => {
    if (remind) {
      handleChooseRemind(remind);
    }
  }, [startTime, startDate]);

  //Notification
  async function schedulePushNotification(title, content, secs, mode, idTask) {
    let list = [];
    lits = allTriggers;

    // Mode update
    if (mode != "update") {
      if (allTriggers && allTriggers.length > 0) {
        let foundItem = allTriggers.find((x) => x.taskId == taskId);
        if (foundItem) {
          await Notifications.cancelScheduledNotificationAsync(
            foundItem.trigger
          );

          list = list.filter((x) => x.taskId != taskId);
        }
      }
    }

    if (mode != "delete") {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: content,
          data: null,
        },
        trigger: { seconds: secs },
      });
      list.push({ taskId: idTask, trigger: identifier });
    }

    dispatch(SetNotificationTriggerList(list));
  }

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

  const onChangeName = (v) => {
    if (!v || v == "") {
      setErrorNameRequired(true);
    } else {
      setErrorNameRequired(false);
    }
    setName(v);
  };

  const handlePressStar = async () => {
    setIsImportant((prevState) => !prevState);
  };

  const hideDatePicker = () => {
    setCalendarStartDate(false);
    setCalendarDueDate(false);
    setCalendarEndRepeat(false);
  };

  const hideTimePicker = () => {
    setCalendarStartTime(false);
    setCalendarDueTime(false);
  };

  const confirmStartDate = (date) => {
    let dateString = convertDateTime(date);

    setStartDate(dateString.split(" ").shift());
    setCalendarStartDate(false);
  };

  const confirmStartTime = (time) => {
    let dateString = convertDateTime(time);

    setStartTime(dateString.split(" ")[1]);
    setCalendarStartTime(false);
  };

  const confirmDueDate = (date) => {
    let dateString = convertDateTime(date);

    setDueDate(dateString.split(" ").shift());
    setCalendarDueDate(false);
  };

  const confirmDueTime = (time) => {
    let dateString = convertDateTime(time);

    setDueTime(dateString.split(" ")[1]);
    setCalendarDueTime(false);
  };

  const confirmEndRepeat = (date) => {
    let dateString = convertDateTime(date);

    setEndRepeat(dateString.split(" ").shift());
    setCalendarEndRepeat(false);
  };

  const checkPermissions = async () => {
    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (!result) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title:
              "You need to give storage permission to download and save the file",
            message: "App needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
          return true;
        } else {
          Alert.alert("Error", I18n.t("PERMISSION_ACCESS_FILE"));

          console.log("Camera permission denied");
          return false;
        }
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  async function selectFile() {
    try {
      const result = await checkPermissions();

      if (result) {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
          type: "image/*",
        });

        if (result.type === "success") {
          // Printing the log realted to the file
          console.log("res : " + JSON.stringify(result));
          // Setting the state to show single file attributes
          setFile(result);
        }
      }
    } catch (err) {
      setFile(null);
      console.warn(err);
      return false;
    }
  }

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await Upload(formData);
    // alert(response);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  // Remind
  const handleSettingRemind = async (request, response, mode) => {
    // Remind
    if (request.remindMode) {
      let startTimeString = convertDateTime(request.startTime);

      // Choose
      if (request.remindMode == CommonData.RemindType().FiveMinutes) {
        let secsBefore =
          (request.startTime.getTime() - new Date().getTime()) / 1000;
        await schedulePushNotification(
          "Remind",
          request.name + ", start time: " + startTimeString,
          secsBefore - 5 * 60,
          mode,
          response.data._id
        );
      } else if (request.remindMode == CommonData.RemindType().OnStartTime) {
        let secsBefore =
          (request.startTime.getTime() - new Date().getTime()) / 1000;
        await schedulePushNotification(
          "Remind",
          request.name + ", start Time: " + dueTimeString,
          secsBefore,
          mode,
          response.data._id
        );
      } else if (request.remindMode == CommonData.RemindType().OneDay) {
        let secsBefore =
          (request.startTime.getTime() - new Date().getTime()) / 1000;
        await schedulePushNotification(
          "Remind",
          request.name + ", start time: " + startTimeString,
          secsBefore - 24 * 60 * 60,
          mode,
          response.data._id
        );
      }
      // Custom
      else if (request.remindMode.includes(":")) {
        let secsBefore =
          (request.remindTime.getTime() - new Date().getTime()) / 1000;
        await schedulePushNotification(
          "Remind",
          request.name + ", start time: " + startTimeString,
          secsBefore,
          mode,
          response.data._id
        );
      }
    }
  };

  // CRUD
  const deleteTask = async () => {
    setIsLoading(true);

    try {
      // delete
      const token = await AsyncStorage.getItem("Token");
      if (token) {
        const response = await DeleteTask(taskId, token);

        if (response) {
          // Clear Remind
          await schedulePushNotification(null, null, null, "delete", null);

          await handleGetAllTasks();

          navigation.navigate("HomeTab", { screen: "Tasks" });
        }
      }
    } catch (err) {
      console(err);
    }

    setIsLoading(false);
  };

  const createTask = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      let request = {
        userId: decoded._id,
        typeId: type._id,
        name: name,
        description: note,
        startTime: new Date(startDate + " " + startTime),
        dueTime: new Date(dueDate + " " + dueTime),
        files: [],
        checkList: [],
        isImportant: isImportant,
        status: isDone
          ? CommonData.TaskStatus().Done
          : CommonData.TaskStatus().New,
        remindMode: remind,
        remindTime: new Date(remindTime),
        repeatTime: repeat,
        endRepeat: repeat ? new Date(endRepeat) : null,
        isRepeatedById: null,
        createdDate: new Date(),
      };

      // Repeat Setting
      if (repeat) {
        let result = getCalculatedList(
          request.startTime,
          request.dueTime,
          new Date(endRepeat + " " + startTime)
        );

        result.forEach((x) => {
          console.log(convertDateTime(x.start), convertDateTime(x.end));
        });

        // Check overlap task repeat
        if (!isInValidOverlapRepeat(result)) {
          result.shift();

          const repeatRequest = {
            data: request,
            datesRepeat: result && result.length > 0 ? result : null,
          };

          const responseRepeat = await CreateRepeat(repeatRequest, token);
          if (responseRepeat && responseRepeat.data) {
            const requestToUpdate = {
              ...responseRepeat.data,
              isRepeatedById: responseRepeat.data._id,
            };

            const responseUpdate = await UpdateTask(requestToUpdate, token);
            if (responseUpdate) {
              // Remind
              await handleSettingRemind(request, responseRepeat, "create");

              // Delay
              setTimeout(() => {
                handleGetAllTasks();
                navigation.navigate("HomeTab", { screen: "Tasks" });

                setIsLoading(false);
              }, 5000);
            }
          }
        } else {
          setIsLoading(false);
          setErrorRepeatOverlap(true);
        }
      }
      // Non repeat
      else {
        const response = await CreateTask(request, token);
        if (response) {
          // Remind
          await handleSettingRemind(request, response, "create");

          await handleGetAllTasks();
          navigation.navigate("HomeTab", { screen: "Tasks" });
          setIsLoading(false);
        }
      }
    }
  };

  const updateTask = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      let request = {
        ...data,
        typeId: type._id,
        name: name,
        description: note,
        startTime: new Date(startDate + " " + startTime),
        dueTime: new Date(dueDate + " " + dueTime),
        files: [],
        checkList: [],
        isImportant: isImportant,
        status: isDone
          ? CommonData.TaskStatus().Done
          : CommonData.TaskStatus().New,
        remindMode: remind,
        remindTime: new Date(remindTime),
        repeatTime: repeat,
        endRepeat: repeat ? new Date(endRepeat) : null,
        isRepeatedById: null,
        updatedDate: new Date(),
      };
      const response = await UpdateTask(request, token);
      if (response) {
        // Remind
        await handleSettingRemind(request, response, "update");

        await handleGetAllTasks();
        navigation.navigate("HomeTab", { screen: "Tasks" });
        setIsLoading(false);
      }
    }
  };

  const save = async () => {
    setIsLoading(true);

    try {
      if (!handleValidate(true, true, true, true)) {
        // create
        if (!taskId) {
          await createTask();
        }
        // Update
        else {
          await updateTask();
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console(err);
      setIsLoading(false);
    }
  };

  // Calculate Date
  const getCalculatedList = (start, end, endRepeat) => {
    let result = [];
    if (repeat) {
      // Daily
      if (repeat === CommonData.RepeatType().Daily) {
        let i = 0;
        for (
          var d = new Date(start.getTime());
          d <= endRepeat;
          d.setDate(d.getDate() + 1)
        ) {
          let endDate = new Date(end.getTime());
          if (i > 0) {
            endDate.setDate(endDate.getDate() + i);
          }
          result.push({ start: new Date(d), end: new Date(endDate) });
          i++;
        }
      }
      // Weekly
      else if (repeat === CommonData.RepeatType().Weekly) {
        let i = 0;
        for (
          var d = new Date(start.getTime());
          d <= endRepeat;
          d.setDate(d.getDate() + 7)
        ) {
          let endDate = new Date(end.getTime());
          if (i > 0) {
            endDate.setDate(endDate.getDate() + 7 * i);
          }
          result.push({ start: new Date(d), end: new Date(endDate) });
          i++;
        }
      }
      // Monthly
      else if (repeat === CommonData.RepeatType().Monthly) {
        let i = 0;
        for (
          var d = new Date(start.getTime());
          d <= endRepeat;
          d.setMonth(d.getMonth() + 1)
        ) {
          let endDate = new Date(end.getTime());
          if (i > 0) {
            endDate.setMonth(endDate.getMonth() + 1 * i);
          }
          result.push({ start: new Date(d), end: new Date(endDate) });
          i++;
        }
      }
      // Yearly
      else if (repeat === CommonData.RepeatType().Yearly) {
        let i = 0;
        for (
          var d = new Date(start.getTime());
          d <= endRepeat;
          d.setFullYear(d.getFullYear() + 1)
        ) {
          let endDate = new Date(end.getTime());
          if (i > 0) {
            endDate.setFullYear(endDate.getFullYear() + 1 * i);
          }
          result.push({ start: new Date(d), end: new Date(endDate) });
          i++;
        }
      }
      // Custom
      else if (repeat.includes(":")) {
        let mode = repeat.split(": ")[0];
        let days = repeat.split(": ")[1].split(", ");

        let curr = new Date(start.getTime()); // get current date
        let first = start.getDate() - start.getDay(); // First day is the day of the month - the day of the week
        first += 1;
        let last = first + 6; // last day is the first day + 6

        let firstday = new Date(curr.setDate(first));
        let lastday = new Date(curr.setDate(last));

        // Get days of first week
        let listDefault = [];
        let differenceInTime = end.getTime() - start.getTime();
        let monStart = firstday;
        let monEnd = new Date(firstday.getTime() + differenceInTime);
        days.forEach((x) => {
          let s = new Date(monStart.getTime());
          let e = new Date(monEnd.getTime());

          if (x === "Mon") {
            listDefault.push({ start: monStart, end: monEnd });
          } else if (x === "Tue") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 1)),
              end: new Date(e.setDate(e.getDate() + 1)),
            });
          } else if (x === "Wed") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 2)),
              end: new Date(e.setDate(e.getDate() + 2)),
            });
          } else if (x === "Thu") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 3)),
              end: new Date(e.setDate(e.getDate() + 3)),
            });
          } else if (x === "Fri") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 4)),
              end: new Date(e.setDate(e.getDate() + 4)),
            });
          } else if (x === "Sat") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 5)),
              end: new Date(e.setDate(e.getDate() + 5)),
            });
          } else if (x === "Sun") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 6)),
              end: new Date(e.setDate(e.getDate() + 6)),
            });
          }
        });

        // Weekly
        if (mode === CommonData.RepeatType().Weekly) {
          let i = 0;
          for (
            var d = new Date(monStart.getTime());
            d <= endRepeat;
            d.setDate(d.getDate() + 7)
          ) {
            if (i > 0) {
              listDefault.forEach((x) => {
                let s = new Date(x.start.getTime());
                let e = new Date(x.end.getTime());
                s.setDate(s.getDate() + 7 * 1 * i);
                e.setDate(e.getDate() + 7 * 1 * i);
                result.push({ start: s, end: e });
              });
            } else {
              result = [...listDefault];
            }
            i++;
          }
          result = result.filter(
            (x) => start <= x.start && x.start <= endRepeat
          );
        } else {
          let list = mode.split("Every ");
          let list2 = list[1].split(" ");
          let num = parseInt(list2[0]);
          let finalMode = list2[1];

          // Weeks
          if (finalMode === "Weeks") {
            let i = 0;
            for (
              var d = new Date(monStart.getTime());
              d <= endRepeat;
              d.setDate(d.getDate() + num * 7)
            ) {
              if (i > 0) {
                listDefault.forEach((x) => {
                  let s = new Date(x.start.getTime());
                  let e = new Date(x.end.getTime());
                  s.setDate(s.getDate() + 7 * num * i);
                  e.setDate(e.getDate() + 7 * num * i);
                  result.push({ start: s, end: e });
                });
              } else {
                result = [...listDefault];
              }
              i++;
            }
            result = result.filter(
              (x) => start <= x.start && x.start <= endRepeat
            );
          }
        }
      } else {
        let list = repeat.split("Every ");
        let list2 = list[1].split(" ");
        let num = parseInt(list2[0]);
        let finalMode = list2[1];

        // Days
        if (finalMode === "Days") {
          let i = 0;
          for (
            var d = new Date(start.getTime());
            d <= endRepeat;
            d.setDate(d.getDate() + num)
          ) {
            let endDate = new Date(end.getTime());
            if (i > 0) {
              endDate.setDate(endDate.getDate() + num * i);
            }
            result.push({ start: new Date(d), end: new Date(endDate) });
            i++;
          }
        }
        // Weeks
        else if (finalMode === "Weeks") {
          let i = 0;
          for (
            var d = new Date(start.getTime());
            d <= endRepeat;
            d.setDate(d.getDate() + num * 7)
          ) {
            let endDate = new Date(end.getTime());
            if (i > 0) {
              endDate.setDate(endDate.getDate() + 7 * num * i);
            }
            result.push({ start: new Date(d), end: new Date(endDate) });
            i++;
          }
        }
        // Months
        else if (finalMode === "Months") {
          let i = 0;
          for (
            var d = new Date(start.getTime());
            d <= endRepeat;
            d.setMonth(d.getMonth() + num)
          ) {
            let endDate = new Date(end.getTime());
            if (i > 0) {
              endDate.setMonth(endDate.getMonth() + num * i);
            }
            result.push({ start: new Date(d), end: new Date(endDate) });
            i++;
          }
        }
        // Years
        else if (finalMode === "Years") {
          let i = 0;
          for (
            var d = new Date(start.getTime());
            d <= endRepeat;
            d.setFullYear(d.getFullYear() + num)
          ) {
            let endDate = new Date(end.getTime());
            if (i > 0) {
              endDate.setFullYear(endDate.getFullYear() + num * i);
            }
            result.push({ start: new Date(d), end: new Date(endDate) });
            i++;
          }
        }
      }
      return result;
    }
  };

  // Modal Repeat
  const handleCloseRepeat = () => {
    setModalRepeat(false);
  };

  const handleChooseRepeat = (value) => {
    if (value === CommonData.RepeatType().Never) {
      setRepeat(null);
    } else {
      setRepeat(value);
    }

    setModalRepeat(false);
  };

  // Modal Remind
  const handleCloseRemind = () => {
    setModalRemind(false);
  };

  const handleChooseRemind = (value) => {
    if (!value) {
      setRemind(null);
      setRemindTime(null);
    } else {
      // Custom
      if (value.includes(":")) {
        // set Day
        let list = value.split(" (");
        let dayRemind = list[0];

        // set Hour Minute
        let list2 = list[1].split(")");
        let list3 = list2[0].split(":");
        let hourRemind = list3[0];
        let minuteRemind = list3[1];

        if (dayRemind === DaysRemind[0]) {
          setRemindTime(startDate + " " + hourRemind + ":" + minuteRemind);
        } else {
          let l1 = dayRemind.split(" ");
          let num = parseInt(l1[0]);

          let date = new Date(startDate);
          date.setTime(date.getTime() - num * 24 * 60 * 60 * 1000);
          date = new Date(date);
          let dateString = convertDateTime(date);
          dateString =
            dateString.split(" ")[0] + " " + hourRemind + ":" + minuteRemind;
          setRemindTime(dateString);
        }
      }
      // Choose
      else {
        // Before five minutes
        if (value === CommonData.RemindType().FiveMinutes) {
          let date = new Date(startDate + " " + startTime);
          date.setTime(date.getTime() - 5 * 60 * 1000);
          date = new Date(date);
          let dateString = convertDateTime(date);
          setRemindTime(dateString);
        }
        // Before one day
        else if (value === CommonData.RemindType().OneDay) {
          let date = new Date(startDate + " " + startTime);
          date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
          date = new Date(date);
          let dateString = convertDateTime(date);
          setRemindTime(dateString);
          console.log(dateString);
        }
        // On start time
        else if (value === CommonData.RemindType().OnStartTime) {
          setRemindTime(startDate + " " + startTime);
        }
      }
      setRemind(value);
    }

    setModalRemind(false);
  };

  // Modal Type
  const handleCloseType = () => {
    setModalType(false);
  };

  const handleChooseType = (value) => {
    setType(value);
    setModalType(false);
  };

  // Modal  Create Type
  const handleCloseCreateType = () => {
    setModalCreateType(false);
  };

  const handleChooseCreateType = (value) => {
    setType(value);
    setModalCreateType(false);
  };

  // Validate
  const handleValidate = (onlyName, onlyDate, onlyRemind, onlyRepeat) => {
    let result = false;
    let backupStartTimeString = dataBackup
      ? convertDateTime(dataBackup.startTime)
      : "";
    let backupDueTimeString = dataBackup
      ? convertDateTime(dataBackup.dueTime)
      : "";
    let startTimeString = startDate + " " + startTime;
    let dueTimeString = dueDate + " " + dueTime;
    let dateNowString = convertDateTime(new Date());

    if (!onlyName) {
      // Name
      if (!name || name === "") {
        setErrorNameRequired(true);
        result = true;
      } else {
        setErrorNameRequired(false);
      }

      // Type
      if (!type) {
        setErrorTypeRequired(true);
        result = true;
      } else {
        setErrorTypeRequired(false);
      }
    }

    // Start date, due date
    if (
      onlyDate &&
      (!dataBackup ||
        startTimeString !== backupStartTimeString ||
        dueTimeString !== backupDueTimeString)
    ) {
      if (startDate && startTime && dueDate && dueTime) {
        // start time in the future
        if (startTimeString < dateNowString) {
          setStartPast(true);
          result = true;
        } else {
          setStartPast(false);

          // Compare 2 dates
          let isInValidDates = false;
          if (startDate > dueDate) {
            setErrorDates(true);
            result = true;
            // Invalid Dates
            isInValidDates = true;
          } else if (startDate == dueDate) {
            if (startTime > dueTime) {
              setErrorDates(true);
              result = true;
              // Invalid Dates
              isInValidDates = true;
            } else {
              setErrorDates(false);
            }
          } else {
            setErrorDates(false);
          }

          if (!isInValidDates) {
            let countTask = 0;
            for (const x of allTasks) {
              let taskStart = convertDateTime(x.startTime);
              let taskDue = convertDateTime(x.dueTime);

              if (
                (taskStart <= startTimeString && startTimeString <= taskDue) ||
                (taskStart <= dueTimeString && dueTimeString <= taskDue)
              ) {
                countTask++;
                setErrorOverlap(true);
                result = true;
                break;
              }
            }

            if (countTask === 0) {
              setErrorOverlap(false);
            }
          }
        }
      }
    }

    // Remind not in the past
    if (onlyRemind && (!dataBackup || remind !== dataBackup.remindMode)) {
      console.log(remindTime);
      if (remindTime < dateNowString || remindTime > startTimeString) {
        setRemindPast(true);
        result = true;
      } else {
        setRemindPast(false);
      }
    }

    // End repeat
    if (
      onlyRepeat &&
      (!dataBackup || new Date(endRepeat) !== dataBackup.endRepeat)
    ) {
      if (repeat) {
        if (endRepeat < dateNowString.split(" ")[0] || endRepeat < startDate) {
          setRepeatTimePast(true);
          result = true;
        } else {
          setRepeatTimePast(false);
        }
      }
    }

    // Repeat
    if (onlyRepeat && (!dataBackup || repeat !== dataBackup.repeatTime)) {
      if (repeat && repeat.includes(":")) {
        let splitList = repeat.split(": ");
        let splitList2 = splitList[1].split(", ");

        let date = new Date(startDate + " " + startTime);
        let curr = new Date(date.getTime()); // get current date
        let first = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
        first += 1;
        let list = [];

        for (let i = 0; i < 7; i++) {
          let d = first + i;

          list.push({
            date: convertDateTime(new Date(curr.setDate(d))).split(" ")[0],
          });
        }

        let dayWeek = "";
        let indexItem = list.findIndex((x) => x.date === startDate);
        if (!indexItem || indexItem < 0) {
          setInvalidDaysWeek(true);
          result = true;
        } else {
          if (indexItem === 0) {
            dayWeek = "Mon";
          } else if (indexItem === 1) {
            dayWeek = "Tue";
          } else if (indexItem === 2) {
            dayWeek = "Wed";
          } else if (indexItem === 3) {
            dayWeek = "Thu";
          } else if (indexItem === 4) {
            dayWeek = "Fri";
          } else if (indexItem === 5) {
            dayWeek = "Sat";
          } else if (indexItem === 6) {
            dayWeek = "Sun";
          }

          let find = splitList2.find((x) => x === dayWeek);

          if (!find) {
            setInvalidDaysWeek(true);
            result = true;
          } else {
            setInvalidDaysWeek(false);
          }
        }
      } else {
        setInvalidDaysWeek(false);
      }
    }

    return result;
  };

  const isInValidModel = () => {
    return (
      errorNameRequired ||
      errorTypeRequired ||
      errorDates ||
      errorOverlap ||
      errorRemindPast ||
      errorRepeatOverlap ||
      errorStartPast
    );
  };

  const isInValidOverlapRepeat = (listDate) => {
    // Check overlap with repeat task
    for (let i = 0; i < listDate.length; i++) {
      let start = i;
      let end = i + 1;

      if (end == listDate.length) {
        break;
      }

      if (listDate[start].end >= listDate[end].start) {
        return true;
      }
    }

    // Check overlap with other tasks
    for (let item of allTasks) {
      let startString = convertDateTime(item.startTime);
      let endString = convertDateTime(item.dueTime);

      let list = listDate.filter((x) => {
        return (
          (x.start <= startString && startString <= x.end) ||
          (x.start <= startString && endString <= x.end)
        );
      });

      if (list.length > 0) {
        return false;
      }
    }

    return false;
  };

  return (
    <Center w="100%" h="100%">
      <Spinner visible={isLoading}></Spinner>

      <PopupComponent
        title={"Delete"}
        content={"Are you sure to delete this task?"}
        closeFunction={closeModal}
        isOpen={open}
        actionFunction={deleteTask}
      ></PopupComponent>

      <Box safeArea height="100%" width="100%" paddingX={1}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <HStack>
              <Icon name="angle-left" size={25} style={styles.icon} />
              <Text paddingLeft={2} fontSize={18} style={styles.textBack}>
                Tasks List
              </Text>
            </HStack>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            {taskId && (
              <TouchableOpacity onPress={() => openModal()}>
                <HStack>
                  <Text
                    paddingLeft={2}
                    fontSize={18}
                    color="red.500"
                    fontWeight={500}
                  >
                    Delete
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              disabled={isInValidModel()}
              onPress={() => save()}
            >
              <HStack>
                <Text
                  paddingLeft={2}
                  fontSize={18}
                  color="blue.500"
                  fontWeight={500}
                  style={isInValidModel() && styles.saveButtonDisable}
                >
                  Save
                </Text>
              </HStack>
            </TouchableOpacity>
          </View>
        </View>

        {/* Checkbox */}
        <HStack style={styles.title}>
          {taskId && (
            <Checkbox
              colorScheme="indigo"
              borderRadius={20}
              size="lg"
              accessibilityLabel="Tap me!"
              my={2}
              isChecked={isDone}
              onChange={() => setIsDone((prevState) => !prevState)}
            ></Checkbox>
          )}

          {/* Name */}
          <TextInput
            fontSize={18}
            value={name}
            onChangeText={(e) => onChangeName(e)}
            style={styles.checkBoxInput}
          />

          {isImportant ? (
            <Icon
              name="star"
              size={30}
              style={styles.iconStarCheck}
              onPress={handlePressStar}
            />
          ) : (
            <Icon
              name="star-o"
              size={30}
              style={styles.iconStarUnCheck}
              onPress={handlePressStar}
            />
          )}
        </HStack>

        {/* Validate Name */}
        {errorNameRequired && (
          <View style={taskId && styles.errorContainer}>
            <Text style={styles.errorText}>
              {CommonData.ErrorTaskName().Required}
            </Text>
          </View>
        )}

        <View style={styles.viewGroup}>
          {/* Type */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Type              "}</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity onPress={() => setModalType(true)}>
                <View style={styles.remindContainer}>
                  <Text style={styles.fieldText}>{type ? type.name : ""}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalCreateType(true)}>
                <Icon
                  name="plus-square"
                  size={26}
                  style={styles.iconStarCheck}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Modal Type */}
          <TypeModal
            isOpen={modalType}
            closeFunction={handleCloseType}
            actionFunction={handleChooseType}
            selected={type}
          />
          {/* Modal Create Type */}
          <CreateTypeModal
            isOpen={modalCreateType}
            closeFunction={handleCloseCreateType}
            actionFunction={handleChooseCreateType}
          />

          {/* Validate Type */}
          {errorTypeRequired && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorTaskType().Required}
              </Text>
            </View>
          )}

          {/* Start time */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Start time    "}</Text>
            <View style={styles.dateTimeContainer}>
              {/* Date */}
              <TouchableOpacity onPress={() => setCalendarStartDate(true)}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateTimeText}>
                    {formatDateUI(startDate)}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Time */}
              <TouchableOpacity onPress={() => setCalendarStartTime(true)}>
                <View style={styles.timeContainer}>
                  <Text style={styles.dateTimeText}>{startTime}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <DateTimePickerModal
            isVisible={calendarStartDate}
            mode="date"
            onConfirm={confirmStartDate}
            onCancel={hideDatePicker}
          />
          <DateTimePickerModal
            isVisible={calendarStartTime}
            mode="time"
            onConfirm={confirmStartTime}
            onCancel={hideTimePicker}
          />

          {/* Validate start */}
          {errorStartPast && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorCompareDate().StartPast}
              </Text>
            </View>
          )}

          {/* Due time */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Due time      "}</Text>
            <View style={styles.dateTimeContainer}>
              {/* Date */}
              <TouchableOpacity onPress={() => setCalendarDueDate(true)}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateTimeText}>
                    {formatDateUI(dueDate)}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Time */}
              <TouchableOpacity onPress={() => setCalendarDueTime(true)}>
                <View style={styles.timeContainer}>
                  <Text style={styles.dateTimeText}>{dueTime}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <DateTimePickerModal
            isVisible={calendarDueDate}
            mode="date"
            onConfirm={confirmDueDate}
            onCancel={hideDatePicker}
          />
          <DateTimePickerModal
            isVisible={calendarDueTime}
            mode="time"
            onConfirm={confirmDueTime}
            onCancel={hideTimePicker}
          />

          {/* Validate Dates */}
          {errorDates && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorCompareDate().GreaterOrEqual}
              </Text>
            </View>
          )}
          {/* Validate overlap */}
          {errorOverlap && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorCompareDate().Overlap}
              </Text>
            </View>
          )}

          {/* Remind */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Remind         "}</Text>
            <View style={styles.dateTimeContainer}>
              {/* Date */}
              <TouchableOpacity onPress={() => setModalRemind(true)}>
                <View style={styles.remindContainer}>
                  <Text style={styles.fieldText}>
                    {remind && remind != "" ? remind : "Never"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Modal Remind */}
          <RemindModal
            isOpen={modalRemind}
            closeFunction={handleCloseRemind}
            actionFunction={handleChooseRemind}
            selected={remind}
          />

          {/* Validate remind */}
          {errorRemindPast && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorRemind().Past}
              </Text>
            </View>
          )}

          {/* Repeat */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Repeat          "}</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity onPress={() => setModalRepeat(true)}>
                <View style={styles.remindContainer}>
                  <Text style={styles.fieldText}>
                    {repeat && repeat != "" ? repeat : "Never"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Modal Repeat */}
          <RepeatModal
            selected={repeat}
            isOpen={modalRepeat}
            actionFunction={handleChooseRepeat}
            closeFunction={handleCloseRepeat}
          />

          {/* Overlapping */}
          {errorRepeatOverlap && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorRepeat().overlap}
              </Text>
            </View>
          )}

          {/* Validate day week repeat */}
          {errorInvalidDaysWeek && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorRepeat().InvalidDayWeek}
              </Text>
            </View>
          )}

          {/* End Repeat */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"End repeat   "}</Text>
            <View style={styles.dateTimeContainer}>
              {repeat && (
                <TouchableOpacity onPress={() => setCalendarEndRepeat(true)}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateTimeText}>
                      {formatDateUI(endRepeat)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <DateTimePickerModal
            isVisible={calendarEndRepeat}
            mode="date"
            onConfirm={confirmEndRepeat}
            onCancel={hideDatePicker}
          />

          {/* Validate day week repeat */}
          {errorRepeatTimePast && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorRepeat().EndRepeatPast}
              </Text>
            </View>
          )}
        </View>

        {/* Note */}
        <View marginTop={4}>
          <TextArea
            onChangeText={(e) => setNote(e)}
            value={note}
            fontSize={16}
            h={200}
            placeholder="Add note"
            w="100%"
            maxW="400"
            style={styles.textArea}
          />
        </View>
      </Box>
    </Center>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    paddingTop: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  textBack: {
    fontWeight: "500",
    color: Color.Button().ButtonActive,
  },
  icon: {
    color: Color.Button().ButtonActive,
  },
  iconOld: {
    paddingBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: Color.Input().label,
  },
  view: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    marginTop: 10,
    gap: 20,
  },
  viewGroup: {
    marginTop: 15,
    borderColor: Color.Input().Border,
    borderWidth: 1,
    padding: 3,
    paddingBottom: 10,
    borderRadius: 5,
  },
  viewOnGroup: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    gap: 20,
  },
  textAreaContainer: {
    marginTop: 10,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 20,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
    shadowColor: "black",
  },
  title: {
    alignContent: "center",
    paddingTop: 5,
    gap: 5,
  },
  errorContainer: {
    paddingLeft: 45,
  },
  errorDateContainer: {
    paddingLeft: 117,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
  },
  iconStarCheck: {
    marginTop: 5,
    color: Color.Button().ButtonActive,
  },
  iconStarUnCheck: {
    marginTop: 5,
  },
  remindContainer: {
    height: 30,
    justifyContent: "center",
  },
  dateContainer: {
    height: 30,
    backgroundColor: Color.Button().ButtonActive,
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  timeContainer: {
    width: 50,
    height: 30,
    backgroundColor: Color.Button().ButtonActive,
    justifyContent: "center",
    borderRadius: 5,
  },
  dateTimeText: {
    color: Color.Button().Text,
    textAlign: "center",
    fontSize: 16,
  },
  fieldText: {
    textAlign: "center",
    fontSize: 16,
  },
  dateTimeContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    flex: 1,
    marginRight: 10,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  typeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flex: 1,
    marginRight: 10,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  sort: {
    paddingBottom: 20,
  },
  checkBoxInput: {
    borderColor: Color.Input().Border,
    borderWidth: 1,
    padding: 10,
    flex: 1,
    borderRadius: 5,
  },
  textArea: {
    borderColor: Color.Input().Border,
  },
  saveButtonDisable: {
    color: Color.Input().disable,
  },
});
