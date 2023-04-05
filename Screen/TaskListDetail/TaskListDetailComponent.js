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

export default ({ route, navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalSort, setShowModalSort] = useState(false);
  const { showDate } = route.params;
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);

  const getDateTitle = () => {
    if (showDate) {
      return (
        format(new Date(showDate), "EE") +
        ", " +
        format(new Date(showDate), "yyyy MMMM dd")
      );
    }
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
                  <TouchableOpacity onPress={() => setShowModalSort(true)}>
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
        <View style={styles.filterContainer}>
          <Button
            rightIcon={
              <Icon name="caret-down" size={20} as="Ionicons" color="white" />
            }
            small
            colorScheme={"indigo"}
          >
            <Text color={Color.Button().Text}>Created Date</Text>
          </Button>
          <Button colorScheme={"indigo"} size={10}>
            <Icon name="close" color={Color.Button().Text} />
          </Button>
        </View>

        {/* Task */}
        <TasksComponent
          navigation={navigation}
          listTasks={allTasks.filter((x) => !x.isDeleted && !x.parentId)}
          date={showDate}
        />

        {/* Button plus */}
        <Button style={styles.button} size={50}>
          <Text fontSize={30} style={styles.buttonText}>
            +
          </Text>
        </Button>

        {/* Modal sort */}
        <Modal
          isOpen={showModalSort}
          onClose={() => setShowModalSort(false)}
          size="lg"
        >
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Sort By</Modal.Header>
            <Modal.Body>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon style={styles.iconModal} name="star-o" size={15} />
                  <Text>Is Important</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon style={styles.iconModal} name="calendar" size={15} />
                  <Text>Due Date</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon style={styles.iconModal} name="pencil" size={15} />
                  <Text>Alphabetically</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon style={styles.iconModal} name="folder-open" />
                  <Text>Created Date</Text>
                </HStack>
              </TouchableOpacity>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        {/* <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Sắp xếp theo</Modal.Header>
            <Modal.Body>
              <TextInput placeholder="Tên công việc" />
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={disableButton}
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Next
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal> */}
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
