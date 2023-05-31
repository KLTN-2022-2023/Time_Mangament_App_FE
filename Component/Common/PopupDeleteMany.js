import { View, Text, HStack, Modal } from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";

export default ({ isOpen, title, content, deleteTask, closeFunction }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => closeFunction()} size="lg">
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Text>{content}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => deleteTask(false)}>
              <HStack>
                <Text fontWeight={500} color={"red.600"}>
                  CHỈ XÓA CÔNG VIỆC NÀY
                </Text>
              </HStack>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(true)}>
              <HStack>
                <Text fontWeight={500} color={"red.600"}>
                  XÓA CẢ CÁC CÔNG VIỆC TRONG TƯƠNG LAI
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
