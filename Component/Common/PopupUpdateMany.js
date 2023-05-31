import { View, Text, HStack, Modal } from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";

export default ({ isOpen, title, content, updateTask, closeFunction }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => closeFunction()} size="lg">
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Text>{content}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => updateTask(false)}>
              <HStack>
                <Text fontWeight={500} color={"red.600"}>
                  CHỈ CẬP NHẬT CÔNG VIỆC NÀY
                </Text>
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => updateTask(true)}>
              <HStack>
                <Text fontWeight={500} color={"red.600"}>
                  CẬP NHẬT CẢ CÔNG VIỆC TRONG TƯƠNG LAI
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
    flexDirection: "column",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
