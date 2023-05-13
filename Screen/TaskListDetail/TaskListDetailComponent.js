import {
  Box,
  Button,
  Center,
  View,
  Text,
  VStack,
  HStack,
  Popover,
  Modal,
} from "native-base";
import { useState, useEffect } from "react";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconICon from "react-native-vector-icons/Ionicons";
import React from "react";
import TasksComponent from "../../Component/Task/TasksComponent";
import { format } from "date-fns";
import Color from "../../Style/Color";
import { useSelector, useDispatch } from "react-redux";
import CommonData from "../../CommonData/CommonData";

export default ({ route, navigation }) => {
  const [showModalSort, setShowModalSort] = useState({
    data: null,
    isShow: false,
  });
  const { showDate, typeId } = route.params;
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const allTypes = useSelector((state) => state.type.allTypes);

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

  return (
    <Center w="100%" height="100%">
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
                  <View style={styles.view} marginRight={-5}>
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

        {/* Filter */}
        {showModalSort && showModalSort.data && (
          <View style={styles.filterContainer}>
            <Button
              rightIcon={
                <Icon
                  name={showModalSort.data.asc ? "caret-down" : "caret-up"}
                  size={20}
                  as="Ionicons"
                  color="white"
                />
              }
              small
              colorScheme={"indigo"}
              onPress={handleChangeAcsSort}
            >
              <Text color={Color.Button().Text}>{showModalSort.data.name}</Text>
            </Button>
            <Button
              colorScheme={"indigo"}
              size={10}
              onPress={handleClearFilter}
            >
              <Icon name="close" color={Color.Button().Text} />
            </Button>
          </View>
        )}

        {/* Task */}
        <TasksComponent
          navigation={navigation}
          listTasks={allTasks.filter((x) => !x.isDeleted)}
          date={showDate}
          typeId={typeId}
          filter={
            showModalSort && showModalSort.data ? showModalSort.data : null
          }
        />

        {/* Button plus */}
        <Button
          style={styles.button}
          size={50}
          onPress={() => navigation.navigate("AddTaskScreen", { taskId: null })}
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
              <TouchableOpacity
                style={styles.sort}
                onPress={() =>
                  setShowModalSort({
                    data: { name: "Created Date", acs: true },
                    isShow: false,
                  })
                }
              >
                <HStack space={3}>
                  <Icon style={styles.iconModal} name="folder-open" />
                  <Text>Created Date</Text>
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
    width: "100%",
    paddingBottom: 10,
    gap: 5,
  },
});
