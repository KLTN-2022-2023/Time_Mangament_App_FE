import { Box, Center, Button, Input, Icon, Text, View } from "native-base";
import { useState, useEffect } from "react";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TaskTypeItem from "./TaskTypeItem";
import CommonData from "../../CommonData/CommonData";
import TaskTypeItemList from "./TaskTypeItemList";
import Color from "../../Style/Color";
import { getListAllTasksByUserId } from "../../Reducers/TaskReducer";
import { getListAllTypesByUserId } from "../../Reducers/TypeReducer";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoData from "../../Component/Common/NoData";

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const allTypes = useSelector((state) => state.type.allTypes);
  const [items, setItems] = useState([]);
  const [keySearch, setKeySearch] = useState("");

  // Load Data
  useEffect(() => {
    handleGetAllTasks();
    handleGetAllTypes();
  }, []);

  //Parse Data
  useEffect(() => {
    if (keySearch && keySearch !== "") {
      let result = allTypes.filter((x) =>
        x.name.toLowerCase().includes(keySearch.toLowerCase())
      );
      if (result.length > 0) {
        handleParseData(result);
      } else {
        handleParseData([]);
      }
    } else {
      handleParseData(allTypes);
    }
  }, [allTasks, allTypes, keySearch]);

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
  };

  const handleGetAllTypes = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTypesByUserId({ userId: decoded._id }, token));
    }
  };

  const handleParseData = (types) => {
    if (types && types.length > 0) {
      let validTypes = types.filter((x) => !x.isDeleted);
      if (validTypes && validTypes.length > 0) {
        let result = [];
        validTypes.forEach((element) => {
          result.push({
            _id: element._id,
            name: element.name,
            quantity: showQty(element._id),
          });
          setItems(result);
        });
      } else {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  const showQty = (type) => {
    if (type == CommonData.TaskType().AllTask) {
      if (allTasks && allTasks.length > 0) {
        let result = allTasks.filter((x) => !x.isDeleted);

        if (result && result.length > 0) {
          return result.length;
        }
      }
    } else if (type == CommonData.TaskType().InComplete) {
      let result = allTasks.filter(
        (x) => !x.isDeleted && x.status === CommonData.TaskStatus().New
      );

      if (result && result.length > 0) {
        return result.length;
      }
    } else if (type == CommonData.TaskType().Completed) {
      let result = allTasks.filter(
        (x) => !x.isDeleted && x.status === CommonData.TaskStatus().Done
      );

      if (result && result.length > 0) {
        return result.length;
      }
    } else if (type == CommonData.TaskType().Important) {
      let result = allTasks.filter((x) => !x.isDeleted && x.isImportant);

      if (result && result.length > 0) {
        return result.length;
      }
    } else {
      let result = allTasks.filter((x) => !x.isDeleted && x.typeId === type);

      if (result && result.length > 0) {
        return result.length;
      }
    }

    return "";
  };

  return (
    <Center w="100%" height="100%">
      <Box safeArea p="2" py="2" height="100%">
        <Input
          value={keySearch}
          onChange={(v) => {
            setKeySearch(v.nativeEvent.text);
          }}
          placeholder="Search"
          width="100%"
          borderRadius="4"
          py="2"
          px="1"
          fontSize="14"
          InputLeftElement={
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<MaterialIcons name="search" />}
            />
          }
        />
        {/* space */}
        <View style={styles.searchBar}></View>
        {keySearch && keySearch != "" ? (
          items && items.length > 0 ? (
            <TaskTypeItemList items={items} navigation={navigation} />
          ) : (
            <NoData></NoData>
          )
        ) : (
          <View>
            <TaskTypeItem
              type={CommonData.TaskType().InComplete}
              name={"Incomplete"}
              quantity={showQty(CommonData.TaskType().InComplete)}
              actionFunc={() => {
                navigation.navigate("TaskListDetail", {
                  showDate: null,
                  typeId: CommonData.TaskType().InComplete,
                });
              }}
            ></TaskTypeItem>
            <TaskTypeItem
              type={CommonData.TaskType().Completed}
              name={"Completed"}
              quantity={showQty(CommonData.TaskType().Completed)}
              actionFunc={() => {
                navigation.navigate("TaskListDetail", {
                  showDate: null,
                  typeId: CommonData.TaskType().Completed,
                });
              }}
            ></TaskTypeItem>
            <TaskTypeItem
              type={CommonData.TaskType().Important}
              name={"Important"}
              quantity={showQty(CommonData.TaskType().Important)}
              actionFunc={() => {
                navigation.navigate("TaskListDetail", {
                  showDate: null,
                  typeId: CommonData.TaskType().Important,
                });
              }}
            ></TaskTypeItem>

            {/* Divider */}
            <View style={styles.divider}></View>

            {/* List */}
            {items && items.length > 0 ? (
              <TaskTypeItemList items={items} navigation={navigation} />
            ) : (
              <NoData></NoData>
            )}
          </View>
        )}
      </Box>
    </Center>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 15,
  },
  divider: {
    backgroundColor: "#DDDDDD",
    height: 1,
    marginBottom: 15,
    marginTop: 5,
  },
  button: {
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    right: 8,
    backgroundColor: Color.Button().ButtonActive,
  },
  buttonText: {
    color: Color.Button().Text,
  },
});
