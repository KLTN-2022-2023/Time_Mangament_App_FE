import { Checkbox, HStack, Text, VStack, View } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import CommonData from "../../CommonData/CommonData";
import Color from "../../Style/Color";
import { convertDateTime, formatDateTask } from "../../helper/Helper";

export default ({ navigation, item }) => {
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
        return "Bắt đầu: " + formatDateTask(showDate) + " " + time;
      }

      return "Kêt thúc: " + formatDateTask(showDate) + " " + time;
    }

    return "";
  };

  return (
    <TouchableOpacity>
      <HStack style={styles.root}>
        <HStack>
          {isDone ? (
            <Icon name="check" size={30} style={styles.iconStarCheck} />
          ) : (
            <View style={{ marginRight: 30 }}></View>
          )}
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
          <Icon name="star" size={30} style={styles.iconStarCheck} />
        ) : (
          <Icon name="star-o" size={30} style={styles.iconStarUnCheck} />
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
    color: "#fff",
  },
  invalidText: {
    color: Color.Task().inValid,
  },
  validText: {
    color: Color.Task().valid,
  },
});
