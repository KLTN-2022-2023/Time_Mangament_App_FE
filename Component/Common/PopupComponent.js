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
import Color from "../../Style/Color";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";

export default ({ isOpen, title, content, actionFunction, closeFunction }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => closeFunction()} size="lg">
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Text>{content}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => actionFunction()}>
              <HStack>
                <Text fontWeight={500} color={"red.600"}>
                  YES
                </Text>
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => closeFunction()}>
              <HStack>
                <Text fontWeight={500} color={"gray.900"}>
                  CANCEL
                </Text>
              </HStack>
            </TouchableOpacity>
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    gap: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
