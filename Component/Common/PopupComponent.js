import { View, Text, HStack, Modal } from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";

export default ({
  isOpen,
  title,
  content,
  actionFunction,
  closeFunction,
  update,
}) => {
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
                <Text fontWeight={500} color={update ? "blue.600" : "red.600"}>
                  ĐỒNG Ý
                </Text>
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => closeFunction()}>
              <HStack>
                <Text fontWeight={500} color={"gray.900"}>
                  HỦY
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
