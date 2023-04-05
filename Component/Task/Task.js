import {
  ArrowForwardIcon,
  Checkbox,
  HStack,
  Text,
  VStack,
  View,
} from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
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

export default ({ navigation, item }) => {
  const dispatch = useDispatch();
  const [isImportant, setIsImportant] = useState(
    item && item.isImportant ? true : false
  );
  const [isDone, setIsDone] = useState(
    item && item.status === CommonData.TaskStatus().Done ? true : false
  );

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

  const showItemStatus = () => {
    if (item && item.dueTime) {
      return getDateTitle(item.dueTime.split(" ").shift());
    }
    return "";
  };

  const checkTaskIsLate = (task) => {
    if (task && task.startTime && task.dueTime) {
      let dateNowString = formatInTimeZone(
        new Date(),
        "Asia/Ho_Chi_Minh",
        CommonData.Format().DateTimeFormatDateFNS
      );
      let startDate = new Date(Date.parse(task.startTime.split(" ").shift()));
      let dueTime = new Date(Date.parse(task.dueTime.split(" ").shift()));
      let dateNow = new Date(Date.parse(dateNowString.split(" ").shift()));

      if (dueTime < dateNow) {
        return true;
      }
    }
    return false;
  };

  const getDateTitle = (showDate) => {
    if (showDate) {
      return (
        format(new Date(showDate), "EE") +
        ", " +
        format(new Date(showDate), "yyyy MMMM dd")
      );
    }
  };

  return (
    <HStack style={styles.root}>
      <HStack>
        <Checkbox
          style={styles.checkbox}
          colorScheme="indigo"
          borderRadius={20}
          size="lg"
          isChecked={isDone}
          accessibilityLabel="Tap me!"
          onChange={handlePressCheck}
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
            {showItemStatus()}
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
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
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
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  validText: {
    color: Color.Task().valid,
  },
});
