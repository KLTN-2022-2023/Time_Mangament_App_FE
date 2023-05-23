import { Box, Center, Button, Input, Icon, Text, View } from "native-base";
import IconAw from "react-native-vector-icons/FontAwesome";
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
import {
  convertDateTime,
  getMonDaySunDay,
  formatDateUI,
} from "../../helper/Helper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const allTypes = useSelector((state) => state.type.allTypes);
  const [items, setItems] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [showWeek, setShowWeek] = useState(false);
  const [daysRange, setDaysRange] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Load Data
  useEffect(() => {
    handleGetAllTasks();
    handleGetAllTypes();
  }, []);

  // set default
  useEffect(() => {
    // let days = getMonDaySunDay(new Date());
    // setDaysRange([
    //   convertDateTime(days.monday).split(" ")[0],
    //   convertDateTime(days.sunday).split(" ")[0],
    // ]);
    setDaysRange([convertDateTime(new Date()).split(" ")[0]]);
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
  }, [allTasks, allTypes, keySearch, daysRange]);

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
    let list = [];
    if (daysRange.length > 0) {
      list = allTasks.filter((x) => {
        let startDateString = convertDateTime(x.startTime).split(" ")[0];
        return (
          // daysRange[0] <= startDateString && startDateString <= daysRange[1]
          daysRange[0] === startDateString
        );
      });
    }

    if (type == CommonData.TaskType().AllTask) {
      if (list && list.length > 0) {
        let result = list.filter((x) => !x.isDeleted);

        if (result && result.length > 0) {
          return result.length;
        }
      }
    } else if (type == CommonData.TaskType().InComplete) {
      let result = list.filter(
        (x) => !x.isDeleted && x.status === CommonData.TaskStatus().New
      );

      if (result && result.length > 0) {
        return result.length;
      }
    } else if (type == CommonData.TaskType().Completed) {
      let result = list.filter(
        (x) => !x.isDeleted && x.status === CommonData.TaskStatus().Done
      );

      if (result && result.length > 0) {
        return result.length;
      }
    } else if (type == CommonData.TaskType().Important) {
      let result = list.filter((x) => !x.isDeleted && x.isImportant);

      if (result && result.length > 0) {
        return result.length;
      }
    } else {
      let result = list.filter((x) => !x.isDeleted && x.typeId === type);

      if (result && result.length > 0) {
        return result.length;
      }
    }

    return "";
  };

  const showDaysRange = () => {
    if (daysRange.length > 0) {
      // let mon = formatDateUI(daysRange[0]);
      // let sun = formatDateUI(daysRange[1]);

      // return mon + " - " + sun;

      let select = formatDateUI(daysRange[0]);
      return select;
    }

    return "";
  };

  const hideDatePicker = () => {
    setShowWeek(false);
  };

  const confirmDate = (date) => {
    setSelectedDay(date);
    // let days = getMonDaySunDay(date);
    // setDaysRange([
    //   convertDateTime(days.monday).split(" ")[0],
    //   convertDateTime(days.sunday).split(" ")[0],
    // ]);

    setDaysRange([convertDateTime(date).split(" ")[0]]);

    setShowWeek(false);
  };

  const setDiffWeek = (next) => {
    if (daysRange.length > 0) {
      // let mon = new Date(daysRange[0]);
      // let sun = new Date(daysRange[1]);
      // let monday = "";
      // let sunday = "";
      // if (next) {
      //   monday = convertDateTime(
      //     new Date(mon.setDate(mon.getDate() + 7))
      //   ).split(" ")[0];
      //   sunday = convertDateTime(
      //     new Date(sun.setDate(sun.getDate() + 7))
      //   ).split(" ")[0];
      // } else {
      //   monday = convertDateTime(
      //     new Date(mon.setDate(mon.getDate() - 7))
      //   ).split(" ")[0];
      //   sunday = convertDateTime(
      //     new Date(sun.setDate(sun.getDate() - 7))
      //   ).split(" ")[0];
      // }

      // setDaysRange([monday, sunday]);
      let select = new Date(daysRange[0]);
      let day = "";

      if (next) {
        day = convertDateTime(
          new Date(select.setDate(select.getDate() + 1))
        ).split(" ")[0];
      } else {
        day = convertDateTime(
          new Date(select.setDate(select.getDate() - 1))
        ).split(" ")[0];
      }

      setDaysRange([day]);
    }
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

        {/* Filter week  */}
        <View style={styles.sortFilterContainer}>
          <View style={styles.weekContainer}>
            <Button
              colorScheme={"indigo"}
              size={8}
              onPress={() => setDiffWeek(false)}
            >
              <IconAw
                name={"caret-left"}
                size={20}
                as="Ionicons"
                color="white"
              />
            </Button>

            <TouchableOpacity onPress={() => setShowWeek(true)}>
              <View style={styles.monthFilter}>
                <Text style={styles.monthFilterText}>{showDaysRange()}</Text>
              </View>
            </TouchableOpacity>

            <Button
              colorScheme={"indigo"}
              size={8}
              onPress={() => setDiffWeek(true)}
            >
              <IconAw
                name={"caret-right"}
                size={20}
                as="Ionicons"
                color="white"
              />
            </Button>
          </View>
        </View>
        <DateTimePickerModal
          isVisible={showWeek}
          mode="date"
          onConfirm={confirmDate}
          onCancel={hideDatePicker}
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
              type={CommonData.TaskType().Completed}
              name={"All Tasks"}
              quantity={showQty(CommonData.TaskType().AllTask)}
              actionFunc={() => {
                navigation.navigate("TaskListDetail", {
                  showDate: null,
                  typeId: CommonData.TaskType().AllTask,
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
            <View style={{ marginTop: 5 }}>
              <Text
                style={{
                  marginBottom: 15,
                  fontSize: 16,
                  color: Color.Button().ButtonActive,
                  fontWeight: 500,
                }}
              >
                Types
              </Text>
            </View>

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
    marginBottom: 10,
    marginTop: 10,
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
  sortFilterContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  weekContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  monthFilterText: {
    color: Color.Button().ButtonActive,
    fontSize: 16,
    fontWeight: "500",
  },
  monthFilter: {
    borderColor: Color.Button().ButtonActive,
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
