import { Box, Center, Modal, View, Text, HStack, TextArea } from "native-base";
import { useEffect, useState, useRef } from "react";
import CommonData from "../../CommonData/CommonData";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Color from "../../Style/Color";
import { useSelector, useDispatch } from "react-redux";

export default ({ isOpen, actionFunction, closeFunction, selected }) => {
  const allTypes = useSelector((state) => state.type.allTypes);

  const isSelected = (value) => {
    return selected && selected.name === value;
  };

  return (
    <Modal isOpen={isOpen} onClose={() => closeFunction()} size="lg">
      <Modal.Content maxWidth="400">
        <Modal.CloseButton />
        <Modal.Header>Type</Modal.Header>
        <Modal.Body>
          {allTypes.map(
            (x) =>
              !x.isDeleted && (
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    actionFunction(x);
                  }}
                  key={x._id}
                >
                  <HStack
                    px={2}
                    py={2}
                    style={isSelected(x.name) && styles.selected}
                  >
                    <Text
                      style={
                        isSelected(x.name) ? styles.textSelected : styles.text
                      }
                    >
                      {x.name}
                    </Text>
                  </HStack>
                </TouchableOpacity>
              )
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sort: {
    paddingBottom: 20,
  },
  selected: {
    borderColor: Color.Button().ButtonActive,
    borderWidth: 1,
    borderRadius: 5,
  },
  textSelected: {
    color: Color.Button().ButtonActive,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
});
