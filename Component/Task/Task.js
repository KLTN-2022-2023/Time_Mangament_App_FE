import {
  ArrowForwardIcon,
  Checkbox,
  HStack,
  Text,
  VStack,
  View,
} from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import CommonData from "../../CommonData/CommonData";
import Color from "../../Style/Color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import {
  getListAllTasksByUserId,
  markImportant,
  updateStatus,
} from "../../Reducers/TaskReducer";
import jwt_decode from "jwt-decode";
import { convertDateTime } from "../../helper/Helper";
import PopupComponent from "../Common/PopupComponent";

export default ({ navigation, item }) => {
  const dispatch = useDispatch();
  const [isImportant, setIsImportant] = useState(
    item && item.isImportant ? true : false
  );
  const [isDone, setIsDone] = useState(
    item && item.status === CommonData.TaskStatus().Done ? true : false
  );
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsImportant(item && item.isImportant ? true : false);
    setIsDone(
      item && item.status === CommonData.TaskStatus().Done ? true : false
    );
  }, [item]);

  const handlePressStar = async () => {
    setIsImportant((prevState) => !prevState);
    await handleMarkImportant();
  };

  const handlePressCheck = async () => {
    setIsDone((prevState) => !prevState);
    setIsShow(false);
    await handleUpdateStatus();
  };

  const handleMarkImportant = async () => {
    try {
      const token = await AsyncStorage.getItem("Token");
      if (token && item && item._id) {
        let response = await markImportant(item._id, token);
        if (response) {
          await handleGetAllTasks();
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("Token");
      if (token && item && item._id) {
        let response = await updateStatus(item._id, token);
        if (response) {
          await handleGetAllTasks();
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
  };

  const showItemName = () => {
    if (item) {
      return item.name;
    }
    return "";
  };

  const showItemStatus = (start) => {
    if (item && item.dueTime && item.startTime) {
      let dueString = convertDateTime(item.dueTime);
      let startString = convertDateTime(item.startTime);

      if (start) {
        return getDateTitle(
          startString.split(" ")[0],
          startString.split(" ")[1],
          start
        );
      }
      return getDateTitle(
        dueString.split(" ")[0],
        dueString.split(" ")[1],
        start
      );
    }
    return "";
  };

  const checkTaskIsLate = (task) => {
    if (task && task.startTime && task.dueTime) {
      let dateNowString = convertDateTime(new Date());
      let dueTimeString = convertDateTime(task.dueTime);

      if (dueTimeString < dateNowString) {
        return true;
      }
    }
    return false;
  };

  const getDateTitle = (showDate, time, start) => {
    if (showDate && time) {
      if (start) {
        return (
          "Start time: " +
          format(new Date(showDate), "EE") +
          ", " +
          format(new Date(showDate), "dd MMMM yyyy") +
          " " +
          time
        );
      }

      return (
        "Due time: " +
        format(new Date(showDate), "EE") +
        ", " +
        format(new Date(showDate), "dd MMMM yyyy") +
        " " +
        time
      );
    }

    return "";
  };

  const closePopup = () => {
    setIsShow(false);
  };

  const openPopup = async () => {
    let startString = convertDateTime(item.startTime);
    let dateNowString = convertDateTime(new Date());

    if (!isDone && startString > dateNowString) {
      setIsShow(true);
    } else {
      await handlePressCheck();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("AddTaskScreen", { taskId: item._id })}
    >
      <PopupComponent
        title={"Waring"}
        content={
          "This task is till in the future. Are you sure to complete this task?"
        }
        update={true}
        isOpen={isShow}
        actionFunction={handlePressCheck}
        closeFunction={closePopup}
      />

      <HStack style={styles.root}>
        <HStack>
          <Checkbox
            style={styles.checkbox}
            colorScheme="indigo"
            borderRadius={20}
            size="lg"
            isChecked={isDone}
            accessibilityLabel="Tap me!"
            onChange={openPopup}
          ></Checkbox>
          <VStack paddingLeft={3}>
            <Text
              style={isDone ? styles.nameTaskDone : styles.nameTask}
              numberOfLines={1}
              maxWidth={200}
            >
              {showItemName()}
            </Text>
            <Text
              style={
                !isDone && checkTaskIsLate(item)
                  ? styles.invalidText
                  : styles.validText
              }
            >
              {showItemStatus(true)}
            </Text>
            <Text
              style={
                !isDone && checkTaskIsLate(item)
                  ? styles.invalidText
                  : styles.validText
              }
            >
              {showItemStatus(false)}
            </Text>
          </VStack>
        </HStack>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    borderColor: "#DDDDDD",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  nameTask: {
    fontSize: 15,
  },
  nameTaskDone: {
    fontSize: 15,
  },
  checkbox: {
    marginTop: 5,
  },
  iconStarCheck: {
    marginTop: 5,
    color: Color.Button().ButtonActive,
  },
  iconStarUnCheck: {
    marginTop: 5,
  },
  invalidText: {
    color: Color.Task().inValid,
  },
  validText: {
    color: Color.Task().valid,
  },
});
