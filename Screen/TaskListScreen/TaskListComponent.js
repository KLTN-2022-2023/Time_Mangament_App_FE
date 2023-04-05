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
import { useState } from "react";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconICon from "react-native-vector-icons/Ionicons";
import Task from "../../Component/Task/Task";
import React from "react";

export default ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalSort, setShowModalSort] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  return (
    <Center w="100%" height="100%">
      <Box safeArea p="2" py="2" maxW="350" height="100%">
        <View style={styles.header}>
          <IconICon size={30} name="arrow-back" />
          <HStack>
            <Popover
              trigger={(triggerProps) => {
                return (
                  <View style={styles.view} marginRight={-5}>
                    <TouchableOpacity {...triggerProps}>
                      <IconICon size={30} name="ellipsis-vertical-outline" />
                    </TouchableOpacity>
                  </View>
                );
              }}
            >
              <Popover.Content w="56">
                <Popover.Body>
                  <TouchableOpacity onPress={() => setShowModalSort(true)}>
                    <HStack paddingBottom={5}>
                      <Icon name="edit" size={20} />
                      <Text style={{ paddingLeft: 10 }}>Đổi tên danh sách</Text>
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowModalSort(true)}>
                    <HStack paddingBottom={5}>
                      <Icon name="sort-alpha-asc" size={20} />
                      <Text style={{ paddingLeft: 10 }}>Sắp xếp danh sách</Text>
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <HStack paddingBottom={5}>
                      <Icon name="exchange" size={20} />
                      <Text style={{ paddingLeft: 10 }}>Thay đổi chủ đề</Text>
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <HStack paddingBottom={5}>
                      <Icon name="print" size={20} />
                      <Text style={{ paddingLeft: 10 }}>In danh sách</Text>
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <HStack paddingBottom={5}>
                      <Icon name="trash-o" size={20} />
                      <Text style={{ paddingLeft: 10 }}>Xóa danh sách</Text>
                    </HStack>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <HStack paddingBottom={5}>
                      <Icon name="calendar-o" size={20} />
                      <Text style={{ paddingLeft: 10 }}>Bật đề xuất</Text>
                    </HStack>
                  </TouchableOpacity>
                </Popover.Body>
              </Popover.Content>
            </Popover>
          </HStack>
        </View>
        <Text style={styles.title}>Name Task</Text>
        <Task />
        <Task />
        <Button
          onPress={() => setShowModal(true)}
          style={styles.button}
          size={50}
        >
          <Text fontSize={30}>+</Text>
        </Button>
        <Modal
          isOpen={showModalSort}
          onClose={() => setShowModalSort(false)}
          size="lg"
        >
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Sắp xếp theo</Modal.Header>
            <Modal.Body>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon name="star-o" />
                  <Text>Tầm quan trọng</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon name="star-o" />
                  <Text>Ngày đến hạn</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon name="star-o" />
                  <Text>Đã thêm vào ngày của Tôi</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon name="star-o" />
                  <Text>Theo thứ tự bảng chữ cái</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sort}>
                <HStack space={3}>
                  <Icon name="star-o" />
                  <Text>Ngày tạo</Text>
                </HStack>
              </TouchableOpacity>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
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
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 30,
  },
  button: {
    borderRadius: 30,
    position: "absolute",
    bottom: 50,
    right: 20,
  },
  sort: {
    paddingBottom: 20,
  },
});
