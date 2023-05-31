import { HStack, Text, VStack, View, IconButton } from "native-base";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import CommonData from "../../CommonData/CommonData";
import Color from "../../Style/Color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { SafeAreaView, StyleSheet, FlatList, Button } from "react-native";
import TaskTypeItem from "./TaskTypeItem";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  CreateType,
  UpdateType,
  DeleteType,
  getListAllTypesByUserId,
} from "../../Reducers/TypeReducer";
import { getListAllTasksByUserId } from "../../Reducers/TaskReducer";
import Spinner from "react-native-loading-spinner-overlay";
import PopupComponent from "../../Component/Common/PopupComponent";
import { convertDateTime } from "../../helper/Helper";

export default ({ items, navigation, selectedDate }) => {
  const allTypes = useSelector((state) => state.type.allTypes);
  const allTasks = useSelector((state) => state.task.allTasks);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let row = [];
  let prevOpenedRow;

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  const deleteType = async (typeId) => {
    setIsLoading(true);

    try {
      // delete
      const token = await AsyncStorage.getItem("Token");
      if (token) {
        const response = await DeleteType(typeId, token);

        if (response) {
          await handleGetAllTypes();
          await handleGetAllTasks();

          // navigation.navigate("HomeTab", { screen: "Tasks" });
          setOpen(false);
        }
      }
    } catch (err) {
      console(err);
    }

    setIsLoading(false);
  };

  const handleGetAllTypes = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTypesByUserId({ userId: decoded._id }, token));
    }
  };

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
  };

  const renderItem = ({ item, index }) => {
    const closeRow = (index) => {
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    const renderRightActions = (progress, dragX) => {
      return (
        <View
          style={{
            margin: 0,
            alignContent: "center",
            justifyContent: "center",
            width: 100,
            flexDirection: "row",
            gap: 5,
            height: 50,
            paddingVertical: 5,
          }}
        >
          <IconButton
            size={"md"}
            variant="solid"
            _icon={{
              as: MaterialIcons,
              name: "edit",
            }}
            colorScheme="orange"
            onPress={() =>
              navigation.navigate("AddTypeScreen", { typeId: item._id })
            }
          />
          <IconButton
            size={"md"}
            variant="solid"
            _icon={{
              as: MaterialIcons,
              name: "delete",
            }}
            colorScheme="red"
            onPress={() => openModal()}
          />
        </View>
      );
    };

    return (
      <GestureHandlerRootView>
        <Spinner visible={isLoading}></Spinner>

        <PopupComponent
          title={"Xóa"}
          content={"Bạn có muốn xóa loại công việc này không"}
          closeFunction={closeModal}
          isOpen={open}
          actionFunction={deleteType.bind(this, item._id)}
          update={false}
        ></PopupComponent>

        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX)
          }
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref) => (row[index] = ref)}
          rightOpenValue={-200}
        >
          <TaskTypeItem
            type={CommonData.TaskType().CustomType}
            name={item.name}
            quantity={item.quantity}
            actionFunc={() => {
              navigation.navigate("TaskListDetail", {
                showDate: null,
                typeId: item._id,
                selectedDate: convertDateTime(selectedDate),
              });
            }}
          ></TaskTypeItem>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  return (
    <View style={styles.safe}>
      <FlatList
        data={items ? items : []}
        renderItem={(v) => renderItem(v)}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingBottom: 50,
  },
});
