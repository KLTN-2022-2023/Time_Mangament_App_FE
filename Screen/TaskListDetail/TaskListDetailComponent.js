import {
  Box,
  Button,
  Center,
  View,
  Text,
  HStack,
  Popover,
  Modal,
} from "native-base";
import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconICon from "react-native-vector-icons/Ionicons";
import React from "react";
import TasksComponent from "../../Component/Task/TasksComponent";
import { format } from "date-fns";
import Color from "../../Style/Color";
import { useSelector, useDispatch } from "react-redux";
import CommonData from "../../CommonData/CommonData";
import {
  convertDateTime,
  getMonDaySunDay,
  formatDateUI,
} from "../../helper/Helper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default ({ route, navigation }) => {
  const [showModalSort, setShowModalSort] = useState({
    data: null,
    isShow: false,
  });
  const { showDate, typeId } = route.params;
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const allTypes = useSelector((state) => state.type.allTypes);
  const [showWeek, setShowWeek] = useState(false);
  const [daysRange, setDaysRange] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());

  // set default
  useEffect(() => {
    // let days = getMonDaySunDay(new Date());
    // setDaysRange([
    //   convertDateTime(days.monday).split(" ")[0],
    //   convertDateTime(days.sunday).split(" ")[0],
    // ]);
    setDaysRange([convertDateTime(new Date()).split(" ")[0]]);
  }, []);

  const getDateTitle = () => {
    if (showDate) {
      return (
        format(new Date(showDate), "EE") +
        ", " +
        format(new Date(showDate), "yyyy MMMM dd")
      );
    }

    if (typeId) {
      if (typeId == CommonData.TaskType().AllTask) {
        return "All Tasks";
      }

      if (typeId == CommonData.TaskType().InComplete) {
        return "InComplete";
      }

      if (typeId == CommonData.TaskType().Completed) {
        return "Completed";
      }

      if (typeId == CommonData.TaskType().Important) {
        return "Important";
      }

      let foundItem = allTypes.find((x) => x._id === typeId && !x.isDeleted);
      if (foundItem) {
        return foundItem.name;
      }
    }

    return "";
  };

  const handleChangeAcsSort = () => {
    setShowModalSort((prev) => {
      return {
        ...prev,
        data: {
          name: prev.data.name,
          asc: !prev.data.asc,
        },
      };
    });
  };

  const handleClearFilter = () => {
    setShowModalSort({ data: null, isShow: false });
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
    <Center w="100%" height="100%" backgroundColor={"#fff"}>
      <Box safeArea py="2" maxW="350" height="100%">
        {/* Header */}
        <View style={styles.header}>
          <IconICon
            size={25}
            name="arrow-back"
            color={Color.Header().Main}
            onPress={() => navigation.goBack()}
          />
          <HStack>
            <Popover
              trigger={(triggerProps) => {
                return (
                  <View style={styles.view}>
                    <TouchableOpacity {...triggerProps}>
                      <IconICon
                        size={25}
                        color={Color.Header().Main}
                        name="ellipsis-vertical"
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
            >
              <Popover.Content w="56">
                <Popover.Body>
                  <TouchableOpacity
                    onPress={() =>
                      setShowModalSort((prev) => {
                        return { ...prev, isShow: true };
                      })
                    }
                  >
                    <HStack>
                      <Icon name="sort-alpha-asc" size={20} />
                      <Text style={{ paddingLeft: 10 }}>Sort By</Text>
                    </HStack>
                  </TouchableOpacity>
                </Popover.Body>
              </Popover.Content>
            </Popover>
          </HStack>
        </View>

        {/* Title */}
        <Text style={styles.title}>{getDateTitle()}</Text>

        <View style={styles.sortFilterContainer}>
          {/* Sort */}
          {showModalSort && showModalSort.data ? (
            <View style={styles.filterContainer}>
              <Button
                leftIcon={
                  <Icon
                    name={showModalSort.data.asc ? "caret-down" : "caret-up"}
                    size={15}
                    as="Ionicons"
                    color="white"
                  />
                }
                small
                colorScheme={"indigo"}
                onPress={handleChangeAcsSort}
              >
                <Text color={Color.Button().Text}>
                  {showModalSort.data.name}
                </Text>
              </Button>
              <Button
                colorScheme={"indigo"}
                width={8}
                onPress={handleClearFilter}
              >
                <Icon name="close" color={Color.Button().Text} />
              </Button>
            </View>
          ) : (
            <View></View>
          )}

          {/* Filter */}
          <View style={styles.weekContainer}>
            <Button
              colorScheme={"indigo"}
              size={8}
              onPress={() => {
                setDiffWeek(false);
              }}
            >
              <Icon name={"caret-left"} size={20} as="Ionicons" color="white" />
            </Button>

            <TouchableOpacity>
              <View style={styles.monthFilter}>
                <Text style={styles.monthFilterText}>{showDaysRange()}</Text>
              </View>
            </TouchableOpacity>

            <Button
              colorScheme={"indigo"}
              size={8}
              onPress={() => {
                setDiffWeek(true);
              }}
            >
              <Icon
                name={"caret-right"}
                size={20}
                as="Ionicons"
                color="white"
              />
            </Button>
          </View>
          <DateTimePickerModal
            isVisible={showWeek}
            mode="date"
            onConfirm={confirmDate}
            onCancel={hideDatePicker}
          />
        </View>

        {/* Task */}
        <TasksComponent
          navigation={navigation}
          listTasks={allTasks.filter((x) => !x.isDeleted)}
          date={showDate}
          typeId={typeId}
          filter={
            showModalSort && showModalSort.data ? showModalSort.data : null
          }
          daysRange={daysRange}
        />

        {/* Button plus */}
        <Button
          style={styles.button}
          size={50}
          onPress={() =>
            navigation.navigate("AddTaskScreen", {
              taskId: null,
              typeId: typeId,
              namePath: "TaskListDetail",
              showDate: showDate,
            })
          }
        >
          <Text fontSize={30} style={styles.buttonText}>
            +
          </Text>
        </Button>

        {/* Modal sort */}
        <Modal
          isOpen={showModalSort.isShow}
          onClose={() =>
            setShowModalSort((prev) => {
              return { ...prev, isShow: false };
            })
          }
          size="lg"
        >
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Sort By</Modal.Header>
            <Modal.Body>
              <TouchableOpacity
                style={styles.sort}
                onPress={() =>
                  setShowModalSort({
                    data: { name: "Is Important", acs: true },
                    isShow: false,
                  })
                }
              >
                <HStack space={3}>
                  <Icon style={styles.iconModal} name="star-o" size={15} />
                  <Text>Is Important</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sort}
                onPress={() =>
                  setShowModalSort({
                    data: { name: "Due Date", acs: true },
                    isShow: false,
                  })
                }
              >
                <HStack space={3}>
                  <Icon style={styles.iconModal} name="calendar" size={15} />
                  <Text>Due Date</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sort}
                onPress={() =>
                  setShowModalSort({
                    data: { name: "Alphabetically", acs: true },
                    isShow: false,
                  })
                }
              >
                <HStack space={3}>
                  <Icon style={styles.iconModal} name="pencil" size={15} />
                  <Text>Alphabetically</Text>
                </HStack>
              </TouchableOpacity>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Box>
    </Center>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    paddingTop: 30,
    paddingBottom: 15,
    fontSize: 20,
    fontWeight: "bold",
    color: Color.Header().Main,
  },
  button: {
    borderRadius: 30,
    position: "absolute",
    bottom: 25,
    right: 0,
    backgroundColor: Color.Button().ButtonActive,
  },
  buttonText: {
    color: Color.Button().Text,
  },
  sort: {
    paddingBottom: 20,
  },
  iconModal: {
    marginTop: 3,
  },
  filterContainer: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: 10,
    gap: 5,
  },
  sortFilterContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 5,
    marginBottom: 5,
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
  weekContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
});
