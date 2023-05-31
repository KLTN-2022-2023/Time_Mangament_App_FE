import {
  Box,
  Center,
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
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  CreateTask,
  DeleteTask,
  UpdateTask,
  CreateRepeat,
  CreateRepeatAfterUpdate,
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
import PopupDeleteMany from "../../Component/Common/PopupDeleteMany";
import PopupUpdateMany from "../../Component/Common/PopupUpdateMany";
import RepeatModal from "../../Component/Task/RepeatModal";
import TypeModal from "../../Component/Task/TypeModal";
import CreateTypeModal from "../../Component/Task/CreateTypeModal";
import { formatDateUI } from "../../helper/Helper";
import { DaysRemind } from "../../CommonData/Data";
import {
  CreateNotification,
  DeleteNotification,
} from "../../Reducers/NotificationTriggerReducer";

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

export default ({ navigation, taskId, selectedDate, isView }) => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("Công việc mới");
  const [note, setNote] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remind, setRemind] = useState(null);
  const [remindTime, setRemindTime] = useState(null);
  const [repeat, setRepeat] = useState(null);
  const [type, setType] = useState(null);
  const [open, setOpen] = useState(false);
  const [dataBackup, setDataBackup] = useState(null);
  const [warn, setWarn] = useState(false);
  const [updateMany, setUpdateMany] = useState(false);

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
        console.log(
          "Received Create",
          response.notification.request.content.data
        );
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
    let dateNowString = convertDateTime(new Date());

    if (foundItem) {
      setData(foundItem);
      setDataBackup(foundItem);

      //set Data
      setName(foundItem.name);
      setNote(foundItem.description);
      setType(allTypes.find((x) => x._id === foundItem.typeId));
      setRemind(foundItem.remindMode);
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
      } else {
        setEndRepeat(dateNowString.split(" ").shift());
      }

      if (foundItem.remindTime) {
        let remindTimeString = convertDateTime(foundItem.remindTime);

        setRemindTime(remindTimeString.split(" ").shift());
      } else {
        setRemindTime(null);
      }
    } else {
      setData(null);
      navigation.navigate("HomeTab", { screen: "Tasks" });
    }
  }, [taskId]);

  // Set default
  useEffect(() => {
    if (!taskId) {
      let dateNowString = convertDateTime(new Date());
      let selectedDateString = null;
      if (selectedDate) {
        selectedDateString = selectedDate;
      }

      setStartDate(
        selectedDate ? selectedDateString : dateNowString.split(" ").shift()
      );
      setStartTime(dateNowString.split(" ")[1]);
      setDueDate(
        selectedDate ? selectedDateString : dateNowString.split(" ").shift()
      );
      setDueTime(dateNowString.split(" ")[1]);
      setEndRepeat(dateNowString.split(" ").shift());

      setType(allTypes ? allTypes.filter((x) => !x.isDeleted)[0] : null);
    }
  }, []);

  // Validate dates, remind, repeat
  useEffect(() => {
    let result = handleValidate(false, true, true, true);
    setErrorRepeatOverlap(false);
    setErrorOverlap(false);
  }, [startDate, startTime, dueDate, dueTime]);

  // Validate repeat
  useEffect(() => {
    let result = handleValidate(false, false, false, true);
    setErrorRepeatOverlap(false);
  }, [endRepeat, repeat]);

  // Validate remind
  useEffect(() => {
    let result = handleValidate(false, false, true, false);
    setErrorRepeatOverlap(false);
  }, [remind, remindTime]);

  // Validate type
  useEffect(() => {
    // let result = handleValidate(true, false, false, false);
    if (type) {
      setErrorTypeRequired(false);
    }
  }, [type]);

  // Recalculate Remind, repeat
  useEffect(() => {
    if (remind) {
      handleChooseRemind(remind);
    }

    if (repeat) {
    }
  }, [startTime, startDate]);

  //Notification
  async function schedulePushNotification(title, content, secs, mode, idTask) {
    let list = [];
    lits = allTriggers;
    const token = await AsyncStorage.getItem("Token");

    // Mode update
    if (mode === "update" || mode === "delete") {
      if (allTriggers && allTriggers.length > 0) {
        let foundItem = allTriggers.find((x) => x.taskId == taskId);
        if (foundItem) {
          await Notifications.cancelScheduledNotificationAsync(
            foundItem.trigger
          );

          list = list.filter((x) => x.taskId != taskId);

          const token = await AsyncStorage.getItem("Token");
          await DeleteNotification(taskId, token);
        }
      }
    }

    if (mode === "create" || mode === "update") {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: content,
          data: {
            id: idTask,
          },
        },
        trigger: { seconds: secs },
      });
      list.push({
        taskId: idTask,
        trigger: identifier,
        isSeen: false,
        content: content,
        remindTime: remindTime,
      });

      const decoded = jwt_decode(token);
      await CreateNotification(
        {
          userId: decoded._id,
          taskId: idTask,
          title: title,
          content: content,
          isSeen: false,
          remindTime: new Date(remindTime),
        },
        token
      );
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

  const handleClearText = () => {
    setName(null);
    setErrorNameRequired(true);
  };

  const handlePressStar = async () => {
    if (!isView) {
      setIsImportant((prevState) => !prevState);
    }
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
          "Nhắc nhở",
          request.name + ". Bắt đầu vào ngày: " + startTimeString,
          secsBefore - 5 * 60,
          mode,
          response.data._id
        );
      } else if (request.remindMode == CommonData.RemindType().OnStartTime) {
        let secsBefore =
          (request.startTime.getTime() - new Date().getTime()) / 1000;
        await schedulePushNotification(
          "Nhắc nhở",
          request.name + ". Bắt đầu vào ngày: " + startTimeString,
          secsBefore,
          mode,
          response.data._id
        );
      } else if (request.remindMode == CommonData.RemindType().OneDay) {
        let secsBefore =
          (request.startTime.getTime() - new Date().getTime()) / 1000;
        await schedulePushNotification(
          "Nhắc nhở",
          request.name + ". Bắt đầu vào ngày: " + startTimeString,
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
          "Nhắc nhở",
          request.name + ". Bắt đầu vào ngày: " + startTimeString,
          secsBefore,
          mode,
          response.data._id
        );
      }
    }
  };

  // CRUD
  const deleteTask = async (many) => {
    setIsLoading(true);

    try {
      // delete
      const token = await AsyncStorage.getItem("Token");
      if (token) {
        if (dataBackup.isRepeatedById && many) {
          let startStringBackup = convertDateTime(dataBackup.startTime);

          let list = allTasks
            .filter((x) => {
              let startString = convertDateTime(x.startTime);
              return (
                x.isRepeatedById === dataBackup.isRepeatedById &&
                startStringBackup <= startString
              );
            })
            .map((y) => y._id);

          if (list.length > 0) {
            let isError = false;
            for (const id of list) {
              const response = await DeleteTask(id, token);
              await DeleteNotification(id, token);
              if (!response) {
                isError = true;
                break;
              }
            }

            if (!isError) {
              // Clear Remind
              await schedulePushNotification(null, null, null, "delete", null);
              await handleGetAllTasks();
              // navigation.navigate("HomeTab", { screen: "Tasks" });
              navigation.goBack();
            }
          }
        } else {
          const response = await DeleteTask(taskId, token);
          await DeleteNotification(taskId, token);
          if (response) {
            // Clear Remind
            await schedulePushNotification(null, null, null, "delete", null);
            await handleGetAllTasks();
            // navigation.navigate("HomeTab", { screen: "Tasks" });
            navigation.goBack();
          }
        }
      }
    } catch (err) {
      console(err);
    }

    setIsLoading(false);
  };

  const createTask = async () => {
    try {
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
          remindTime: remind ? new Date(remindTime) : null,
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
          if (!isInValidOverlapRepeat(result, null)) {
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
                  // navigation.navigate("HomeTab", { screen: "Tasks" });
                  navigation.goBack();

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
            // navigation.navigate("HomeTab", { screen: "Tasks" });
            navigation.goBack();
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateTask = async (clearRepeat, req, removeRemind) => {
    setIsLoading(true);
    try {
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
          remindTime: remind ? new Date(remindTime) : null,
          repeatTime: removeRemind ? null : repeat,
          endRepeat: removeRemind ? null : repeat ? new Date(endRepeat) : null,
          isRepeatedById: clearRepeat ? null : dataBackup.isRepeatedById,
          updatedDate: new Date(),
        };

        if (req) {
          request = req;
        }

        // Repeat Setting
        if (
          request.repeatTime &&
          (request.repeatTime !== dataBackup.repeatTime ||
            convertDateTime(request.endRepeat) !==
              convertDateTime(dataBackup.endRepeat))
        ) {
          let result = getCalculatedList(
            request.startTime,
            request.dueTime,
            new Date(endRepeat + " " + startTime)
          );

          // Check overlap task repeat
          if (
            !isInValidOverlapRepeat(result, null) &&
            !handleValidateOverlap()
          ) {
            result.shift();

            const response = await UpdateTask(
              { ...request, isRepeatedById: request._id },
              token
            );
            if (response) {
              const repeatRequest = {
                data: { ...request, isRepeatedById: request._id },
                datesRepeat: result && result.length > 0 ? result : null,
              };

              const responseRepeat = await CreateRepeatAfterUpdate(
                repeatRequest,
                token
              );
              if (responseRepeat) {
                // Remind
                if (request.remindTime !== dataBackup.remindTime) {
                  await handleSettingRemind(request, response, "update");
                }

                // Delay
                setTimeout(() => {
                  handleGetAllTasks();
                  // navigation.navigate("HomeTab", { screen: "Tasks" });
                  navigation.goBack();

                  setIsLoading(false);
                }, 5000);
              }
            }
          } else {
            setIsLoading(false);
            setErrorRepeatOverlap(true);
          }
        }
        // Non-repeat setting
        else {
          const response = await UpdateTask(request, token);
          if (response) {
            // Remind
            if (
              convertDateTime(request.remindTime) !==
              convertDateTime(dataBackup.remindTime)
            ) {
              await handleSettingRemind(request, response, "update");
            }

            await handleGetAllTasks();
            // navigation.navigate("HomeTab", { screen: "Tasks" });
            navigation.goBack();
            setIsLoading(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateManyRepeat = async () => {
    setIsLoading(true);
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
        remindTime: remind ? new Date(remindTime) : null,
        repeatTime: repeat,
        endRepeat: repeat ? new Date(endRepeat) : null,
        isRepeatedById: null,
        updatedDate: new Date(),
      };

      let startStringBackup = convertDateTime(dataBackup.startTime);

      //future task
      let listFutureTask = allTasks.filter((x) => {
        let startString = convertDateTime(x.startTime);
        return (
          x.isRepeatedById === dataBackup.isRepeatedById &&
          x._id !== dataBackup._id &&
          startStringBackup <= startString
        );
      });

      if (listFutureTask.length > 0) {
        // Update new repeat
        if (request.repeatTime) {
          let result = getCalculatedList(
            request.startTime,
            request.dueTime,
            new Date(endRepeat + " " + startTime)
          );

          // Check overlap task repeat
          if (
            !isInValidOverlapRepeat(result, listFutureTask) &&
            !handleValidateOverlap()
          ) {
            result.shift();

            const response = await UpdateTask(
              { ...request, isRepeatedById: request._id },
              token
            );
            if (response) {
              // Remove old task task
              let isError = false;
              for (const id of listFutureTask.filter(
                (x) => x._id !== dataBackup._id
              )) {
                const response = await DeleteTask(id._id, token);
                await DeleteNotification(id._id, token);
                if (!response) {
                  isError = true;
                  break;
                }
              }
              if (!isError) {
                const repeatRequest = {
                  data: { ...request, isRepeatedById: request._id },
                  datesRepeat: result && result.length > 0 ? result : null,
                };

                const responseRepeat = await CreateRepeatAfterUpdate(
                  repeatRequest,
                  token
                );
                if (responseRepeat) {
                  // Remind
                  if (
                    convertDateTime(request.remindTime) !==
                    convertDateTime(dataBackup.remindTime)
                  ) {
                    await handleSettingRemind(request, response, "update");
                  }

                  // Delay
                  setTimeout(() => {
                    handleGetAllTasks();
                    // navigation.navigate("HomeTab", { screen: "Tasks" });
                    navigation.goBack();

                    setIsLoading(false);
                  }, 5000);
                }
              }
            }
          } else {
            setIsLoading(false);
            setErrorRepeatOverlap(true);
          }
        }
        // Remove old repeat
        else {
          let list = allTasks.filter((x) => {
            let startString = convertDateTime(x.startTime);
            return (
              x.isRepeatedById === dataBackup.isRepeatedById &&
              x._id !== dataBackup._id &&
              startStringBackup < startString
            );
          });
          let isError = false;
          for (const id of list) {
            const response = await DeleteTask(id._id, token);
            await DeleteNotification(id._id, token);
            if (!response) {
              isError = true;
              break;
            }
          }
          if (!isError) {
            updateTask(true, request, false);
          }
        }
      }
    }
  };

  const save = async () => {
    try {
      if (!handleValidate(true, true, true, true)) {
        // create
        if (!taskId) {
          setIsLoading(true);

          if (!handleValidateOverlap()) {
            await createTask();
          } else {
            setIsLoading(false);
          }
        }
        // Update
        else {
          if (dataBackup.isRepeatedById) {
            setUpdateMany(true);
          } else {
            setIsLoading(true);
            await updateTask(true, null, false);
          }
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

        let da = new Date(start.getTime());
        let day = da.getDay(),
          diff = da.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        let monday = new Date(da.setDate(diff));

        // Get days of first week
        let listDefault = [];
        let differenceInTime = end.getTime() - start.getTime();
        let monStart = monday;
        let monEnd = new Date(monday.getTime() + differenceInTime);
        days.forEach((x) => {
          let s = new Date(monStart.getTime());
          let e = new Date(monEnd.getTime());

          if (x === "T2") {
            listDefault.push({ start: monStart, end: monEnd });
          } else if (x === "T3") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 1)),
              end: new Date(e.setDate(e.getDate() + 1)),
            });
          } else if (x === "T4") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 2)),
              end: new Date(e.setDate(e.getDate() + 2)),
            });
          } else if (x === "T5") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 3)),
              end: new Date(e.setDate(e.getDate() + 3)),
            });
          } else if (x === "T6") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 4)),
              end: new Date(e.setDate(e.getDate() + 4)),
            });
          } else if (x === "T7") {
            listDefault.push({
              start: new Date(s.setDate(s.getDate() + 5)),
              end: new Date(e.setDate(e.getDate() + 5)),
            });
          } else if (x === "CN") {
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
            let d = new Date(monStart.getTime());
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

          let startStr = convertDateTime(start);
          let endRepeatStr = convertDateTime(endRepeat);

          result = result.filter((x) => {
            let str = convertDateTime(x.start);

            return startStr <= str && str <= endRepeatStr;
          });
        } else {
          let list = mode.split("Mỗi ");
          let list2 = list[1].split(" ");
          let num = parseInt(list2[0]);
          let finalMode = list2[1];

          // Weeks
          if (finalMode === "Tuần") {
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
        let list = repeat.split("Mỗi ");
        let list2 = list[1].split(" ");
        let num = parseInt(list2[0]);
        let finalMode = list2[1];

        // Days
        if (finalMode === "Ngày") {
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
        else if (finalMode === "Tuần") {
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
        else if (finalMode === "Tháng") {
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
        else if (finalMode === "Năm") {
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
          let num = parseInt(l1[1]);

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
    setErrorTypeRequired(false);
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
          // update start date
          if (dataBackup && startTimeString !== backupStartTimeString) {
            setStartPast(true);
            result = true;
          }
          // create mode
          else if (!dataBackup) {
            setStartPast(true);
            result = true;
          }
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
        }
      }
    }

    // Remind not in the past
    // if (onlyRemind && (!dataBackup || remind !== dataBackup.remindMode))
    if (
      onlyRemind &&
      remind &&
      (!dataBackup ||
        startTimeString !== backupStartTimeString ||
        dueTimeString !== backupDueTimeString ||
        remind !== dataBackup.remindMode)
    ) {
      if (remindTime < dateNowString || remindTime > startTimeString) {
        setRemindPast(true);
        result = true;
      } else {
        setRemindPast(false);
      }
    }

    // End repeat
    // if (
    //   onlyRepeat &&
    //   (!dataBackup || new Date(endRepeat) !== dataBackup.endRepeat)
    if (
      onlyRepeat &&
      (!dataBackup ||
        startTimeString !== backupStartTimeString ||
        dueTimeString !== backupDueTimeString ||
        endRepeat !== convertDateTime(dataBackup.endRepeat).split(" ")[0])
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
    // if (onlyRepeat && (!dataBackup || repeat !== dataBackup.repeatTime))
    if (
      onlyRepeat &&
      (!dataBackup ||
        startTimeString !== backupStartTimeString ||
        dueTimeString !== backupDueTimeString ||
        repeat !== dataBackup.repeatTime)
    ) {
      if (repeat && repeat.includes(":")) {
        let splitList = repeat.split(": ");
        let splitList2 = splitList[1].split(", ");

        let d = new Date(startDate + " " + startTime);
        let day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        let monday = new Date(d.setDate(diff));
        let list = [];

        for (let i = 0; i < 7; i++) {
          let d = new Date(monday.getTime());
          d.setDate(d.getDate() + i);

          list.push({
            date: convertDateTime(new Date(d)).split(" ")[0],
          });
        }

        let dayWeek = "";
        let indexItem = list.findIndex((x) => x.date === startDate);
        if (indexItem === null || indexItem < 0) {
          setInvalidDaysWeek(true);
          result = true;
        } else {
          if (indexItem === 0) {
            dayWeek = "T2";
          } else if (indexItem === 1) {
            dayWeek = "T3";
          } else if (indexItem === 2) {
            dayWeek = "T4";
          } else if (indexItem === 3) {
            dayWeek = "T5";
          } else if (indexItem === 4) {
            dayWeek = "T6";
          } else if (indexItem === 5) {
            dayWeek = "T7";
          } else if (indexItem === 6) {
            dayWeek = "CN";
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

  const handleValidateOverlap = () => {
    let result = false;
    let startTimeString = startDate + " " + startTime;
    let dueTimeString = dueDate + " " + dueTime;

    let countTask = 0;
    for (const x of allTasks) {
      // update
      if (dataBackup && dataBackup._id === x._id) {
        continue;
      }

      let taskStart = convertDateTime(x.startTime);
      let taskDue = convertDateTime(x.dueTime);

      if (
        (taskStart <= startTimeString && startTimeString <= taskDue) ||
        (taskStart <= dueTimeString && dueTimeString <= taskDue) ||
        (startTimeString <= taskStart && taskDue <= dueTimeString)
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

    return result;
  };

  const isInValidModel = () => {
    return (
      errorNameRequired ||
      errorTypeRequired ||
      errorDates ||
      errorStartPast ||
      errorOverlap ||
      errorRemindPast ||
      errorRepeatOverlap ||
      errorRepeatTimePast ||
      errorInvalidDaysWeek
    );
  };

  const isInValidOverlapRepeat = (listDate, listTaskAvoid) => {
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
      // avoid repeated update
      if (listTaskAvoid && listTaskAvoid.find((x) => x._id === item._id)) {
        continue;
      }

      // update
      if (dataBackup && dataBackup._id === item._id) {
        continue;
      }

      let startString = convertDateTime(item.startTime);
      let endString = convertDateTime(item.dueTime);

      let list = listDate.filter((x) => {
        let s = convertDateTime(x.start);
        let e = convertDateTime(x.end);
        return (
          (startString <= s && s <= endString) ||
          (startString <= e && e <= endString) ||
          (s <= startString && endString <= e) ||
          (startString <= s && e <= endString)
        );
      });

      if (list.length > 0) {
        return true;
      }
    }

    return false;
  };

  // Go back
  const handleGoBack = () => {
    navigation.goBack();
    setWarn(false);
  };

  const closeWarning = () => {
    setWarn(false);
  };

  const handleShowWarning = () => {
    if (dataBackup) {
      let request = {
        ...data,
        typeId: type?._id,
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
        remindTime: remind ? new Date(remindTime) : null,
        repeatTime: repeat,
        endRepeat: repeat ? new Date(endRepeat) : null,
        isRepeatedById: null,
        updatedDate: new Date(),
      };

      if (
        request.name !== dataBackup.name ||
        request.typeId !== dataBackup.typeId ||
        request.description !== dataBackup.description ||
        convertDateTime(request.startTime) !==
          convertDateTime(dataBackup.startTime) ||
        convertDateTime(request.dueTime) !==
          convertDateTime(dataBackup.dueTime) ||
        request.typeId !== dataBackup.typeId ||
        request.isImportant !== dataBackup.isImportant ||
        request.status !== dataBackup.status ||
        request.remindMode !== dataBackup.remindMode ||
        convertDateTime(request.remindTime) !==
          convertDateTime(dataBackup.remindTime) ||
        request.repeatTime !== dataBackup.repeatTime ||
        convertDateTime(request.endRepeat) !==
          convertDateTime(dataBackup.endRepeat)
      ) {
        setWarn(true);
      } else {
        handleGoBack();
      }
    } else {
      handleGoBack();
    }
  };

  // Popup update many
  const closeModalUpdateMany = () => {
    setUpdateMany(false);
  };

  const handleUpdateFutureTask = async () => {
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
        remindTime: remind ? new Date(remindTime) : null,
        repeatTime: repeat,
        endRepeat: repeat ? new Date(endRepeat) : null,
        // isRepeatedById: null,
        updatedDate: new Date(),
      };

      // Change repeat
      if (
        convertDateTime(request.startTime) !==
          convertDateTime(dataBackup.startTime) ||
        convertDateTime(request.dueTime) !==
          convertDateTime(dataBackup.dueTime) ||
        request.repeatTime !== dataBackup.repeatTime ||
        convertDateTime(request.endRepeat) !==
          convertDateTime(dataBackup.endRepeat)
      ) {
        await updateManyRepeat();
      } else {
        setIsLoading(true);
        let startStringBackup = convertDateTime(dataBackup.startTime);

        //future task
        let listFutureTask = allTasks.filter((x) => {
          let startString = convertDateTime(x.startTime);
          return (
            x.isRepeatedById === dataBackup.isRepeatedById &&
            startStringBackup <= startString
          );
        });

        if (listFutureTask.length > 0) {
          let isError = false;
          for (const task of listFutureTask) {
            const requestTask = {
              ...request,
              _id: task._id,
              startTime: task.startTime,
              dueTime: task.dueTime,
              repeatTime: task.repeatTime,
              endRepeat: task.endRepeat,
            };

            const response = await UpdateTask(requestTask, token);
            if (response) {
              // Remind
              if (
                convertDateTime(requestTask.remindTime) !==
                convertDateTime(task.remindTime)
              ) {
                await handleSettingRemind(requestTask, response, "update");
              }
            } else {
              isError = true;
              break;
            }
          }

          if (!isError) {
            await handleGetAllTasks();
            navigation.goBack();
            setIsLoading(false);
          }
        }
      }
    }
  };

  const handleChooseUpdate = async (many) => {
    if (many) {
      await handleUpdateFutureTask();
    } else {
      updateTask(true, null, true);
    }
  };

  return (
    <Center w="100%" h="100%">
      <Spinner visible={isLoading}></Spinner>

      {dataBackup && dataBackup.isRepeatedById ? (
        <PopupDeleteMany
          title={"Xóa"}
          content={
            "Bạn có chắc muốn xóa công việc này không? Đây là công việc lặp lại."
          }
          closeFunction={closeModal}
          isOpen={open}
          deleteTask={deleteTask}
        ></PopupDeleteMany>
      ) : (
        <PopupComponent
          title={"Xóa"}
          content={"Bạn có chắc muốn xóa công việc này không?"}
          closeFunction={closeModal}
          isOpen={open}
          actionFunction={deleteTask.bind(false)}
          update={false}
        ></PopupComponent>
      )}

      {dataBackup && dataBackup.isRepeatedById && (
        <PopupUpdateMany
          title={"Cập nhật"}
          content={
            "Bạn có chắc muốn cập nhật công việc này không? Đây là công việc lập lại."
          }
          closeFunction={closeModalUpdateMany}
          isOpen={updateMany}
          updateTask={handleChooseUpdate}
        ></PopupUpdateMany>
      )}
      <PopupComponent
        title={"Cảnh báo"}
        content={
          "Tất cả dữ liệu chưa được lưu sẽ bị mất. Bạn có chắc muốn tiếp tục?"
        }
        closeFunction={closeWarning}
        isOpen={warn}
        actionFunction={handleGoBack}
        update={false}
      ></PopupComponent>

      <Box safeArea height="100%" width="100%" paddingX={1}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleShowWarning()}>
            <HStack>
              <Icon name="angle-left" size={25} style={styles.icon} />
              <Text paddingLeft={2} fontSize={18} style={styles.textBack}>
                Quay lại
              </Text>
            </HStack>
          </TouchableOpacity>

          {!isView && (
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
                      Xóa
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
                    Lưu
                  </Text>
                </HStack>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView>
          <HStack style={styles.title}>
            {/* Name */}
            <View
              style={!isView ? styles.textContainer : styles.textContainerView}
            >
              {!isView ? (
                <TextInput
                  fontSize={18}
                  value={name}
                  onChangeText={(e) => onChangeName(e)}
                  style={styles.checkBoxInput}
                />
              ) : (
                <View>
                  <Text style={{ fontSize: 18, marginLeft: 10 }}>{name}</Text>
                </View>
              )}

              {!isView && (
                <TouchableOpacity
                  onPress={() => {
                    handleClearText();
                  }}
                >
                  <IconMaterial name="cancel" color={"gray"} size={25} />
                </TouchableOpacity>
              )}
            </View>
          </HStack>

          {/* Validate Name */}
          {errorNameRequired && (
            <View style={taskId && styles.errorContainer}>
              <Text style={styles.errorText}>
                {CommonData.ErrorTaskName().Required}
              </Text>
            </View>
          )}

          {/* Is completed */}
          {taskId && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                marginTop: 5,
                marginLeft: 5,
              }}
            >
              <Checkbox
                colorScheme="indigo"
                borderRadius={20}
                size="lg"
                accessibilityLabel="Tap me!"
                my={2}
                isChecked={isDone}
                onChange={() => {
                  if (!isView) {
                    setIsDone((prevState) => !prevState);
                  }
                }}
              ></Checkbox>
              <Text style={{ fontSize: 16, marginTop: 10 }}>Đã hoàn thành</Text>
            </View>
          )}

          {/* Is Important */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              marginBottom: 5,
              marginTop: 5,
              marginLeft: 5,
            }}
          >
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
            <Text style={{ fontSize: 16, marginTop: 10 }}>
              Công việc quan trọng
            </Text>
          </View>

          <View style={styles.viewGroup}>
            {/* Type */}
            <View style={styles.viewOnGroup}>
              <Text style={styles.iconOld}>{"Loại                    "}</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  onPress={() => {
                    if (!isView) {
                      setModalType(true);
                    }
                  }}
                >
                  <View style={styles.remindContainer}>
                    <Text style={styles.fieldText}>
                      {type ? type.name : ""}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!isView) {
                      setModalCreateType(true);
                    }
                  }}
                >
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
              <Text style={styles.iconOld}>{"Bắt đầu             "}</Text>
              <View style={styles.dateTimeContainer}>
                {/* Date */}
                <TouchableOpacity
                  onPress={() => {
                    if (!isView) {
                      setCalendarStartDate(true);
                    }
                  }}
                >
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateTimeText}>
                      {formatDateUI(startDate)}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Time */}
                <TouchableOpacity
                  onPress={() => {
                    if (!isView) {
                      setCalendarStartTime(true);
                    }
                  }}
                >
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
              <Text style={styles.iconOld}>{"Hoàn thành      "}</Text>
              <View style={styles.dateTimeContainer}>
                {/* Date */}
                <TouchableOpacity
                  onPress={() => {
                    if (!isView) {
                      setCalendarDueDate(true);
                    }
                  }}
                >
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateTimeText}>
                      {formatDateUI(dueDate)}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Time */}
                <TouchableOpacity
                  onPress={() => {
                    if (!isView) {
                      setCalendarDueTime(true);
                    }
                  }}
                >
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
              <Text style={styles.iconOld}>{"Nhắc nhở          "}</Text>
              <View style={styles.dateTimeContainer}>
                {/* Date */}
                <TouchableOpacity
                  onPress={() => {
                    if (!isView) {
                      setModalRemind(true);
                    }
                  }}
                >
                  <View style={styles.remindContainer}>
                    <Text style={styles.fieldText}>
                      {remind && remind != "" ? remind : "Không"}
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
              <Text style={styles.iconOld}>{"Lặp lại               "}</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  onPress={() => {
                    if (!isView) {
                      setModalRepeat(true);
                    }
                  }}
                >
                  <View style={styles.remindContainer}>
                    <Text style={styles.fieldText}>
                      {repeat && repeat != "" ? repeat : "Không"}
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
              <Text style={styles.iconOld}>{"Ngừng lặp        "}</Text>
              <View style={styles.dateTimeContainer}>
                {repeat && (
                  <TouchableOpacity
                    onPress={() => {
                      if (!isView) {
                        setCalendarEndRepeat(true);
                      }
                    }}
                  >
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
              isDisabled={!!isView}
              onChangeText={(e) => setNote(e)}
              value={note}
              fontSize={16}
              h={200}
              placeholder="Thêm ghi chú"
              w="100%"
              maxW="400"
              style={styles.textArea}
            />
          </View>

          <View style={{ height: 500 }}></View>
        </ScrollView>
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
    paddingLeft: 135,
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
    padding: 10,
    flex: 1,
  },
  textContainer: {
    borderColor: Color.Input().Border,
    borderWidth: 1,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  textContainerView: {
    borderColor: Color.Input().Border,
    borderWidth: 1,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: 10,
    paddingVertical: 10,
  },
  textArea: {
    borderColor: Color.Input().Border,
  },
  saveButtonDisable: {
    color: Color.Input().disable,
  },
});
