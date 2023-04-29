import { HStack, Text, VStack, View } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import CommonData from "../../CommonData/CommonData";
import Color from "../../Style/Color";
import { TouchableOpacity } from "react-native";

export default ({ navigation, type, name, quantity, actionFunc }) => {
  const showIcon = () => {
    if (type) {
      if (type == CommonData.TaskType().AllTask) {
        return "home";
      }
      if (type == CommonData.TaskType().Important) {
        return "star";
      }
    }

    return "list-alt";
  };

  const showIconStyle = () => {
    if (type) {
      if (type == CommonData.TaskType().AllTask) {
        return styles.iconTypeAllTask;
      }
      if (type == CommonData.TaskType().Important) {
        return styles.iconTypeImportant;
      }
    }

    return styles.iconTypeCustom;
  };

  const showNameStyle = () => {
    if (type) {
      if (
        type == CommonData.TaskType().AllTask ||
        type == CommonData.TaskType().Important
      ) {
        return styles.nameTypeDefault;
      }
    }

    return styles.nameTypeCustom;
  };

  const showBackgroundStyle = () => {
    if (type) {
      if (
        type == CommonData.TaskType().AllTask ||
        type == CommonData.TaskType().Important
      ) {
        return styles.root;
      }
    }

    return styles.rootCustom;
  };

  return (
    <TouchableOpacity onPress={() => actionFunc()}>
      <HStack style={showBackgroundStyle()}>
        <HStack>
          <Icon name={showIcon()} size={25} style={showIconStyle()} />
          <VStack paddingLeft={3} paddingTop={1}>
            <Text style={showNameStyle()} numberOfLines={1} maxWidth={200}>
              {name}
            </Text>
          </VStack>
        </HStack>
        <Text paddingTop={1} style={showNameStyle()}>
          {quantity}
        </Text>
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
  rootCustom: {
    borderColor: "#DDDDDD",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: Color.Task().background,
  },
  nameTypeDefault: {
    fontSize: 15,
    fontWeight: "500",
  },
  nameTypeCustom: {
    fontSize: 15,
    fontWeight: "500",
    color: Color.Button().ButtonActive,
  },
  iconTypeCustom: {
    marginTop: 5,
    color: Color.Button().ButtonActive,
  },
  iconTypeAllTask: {
    marginTop: 5,
    color: Color.IconTask().AllTasks,
  },
  iconTypeImportant: {
    marginTop: 5,
    color: Color.IconTask().Important,
  },
});
