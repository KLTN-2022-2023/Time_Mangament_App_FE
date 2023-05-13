import { Modal, View, Text, Input } from "native-base";
import { useEffect, useState } from "react";
import CommonData from "../../CommonData/CommonData";
import { StyleSheet, TouchableOpacity } from "react-native";
import Color from "../../Style/Color";
import {
  CreateType,
  getListAllTypesByUserId,
} from "../../Reducers/TypeReducer";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

export default ({ isOpen, actionFunction, closeFunction }) => {
  const allTypes = useSelector((state) => state.type.allTypes);
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorNameLength, setErrorNameLength] = useState(false);
  const [errorNameDup, setErrorNameDup] = useState(false);
  const [errorNameSpecial, setErrorNameSpecial] = useState(false);
  const [errorNameRequired, setErrorNameRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setErrorNameLength(false);
      setErrorNameDup(false);
      setErrorNameSpecial(false);
      setErrorNameRequired(false);
      setData(null);
    }
  }, [isOpen]);

  const isInvalidName = () => {
    return (
      errorNameDup || errorNameLength || errorNameRequired || errorNameSpecial
    );
  };

  const handleGetAllTypes = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTypesByUserId({ userId: decoded._id }, token));
    }
  };

  const onChangeName = (name) => {
    // Check required
    let invalid = handleValidateName(name);

    setName(name);
  };

  const showMessageErrorName = () => {
    if (errorNameLength) {
      return CommonData.ErrorTypeName().Length;
    }

    if (errorNameRequired) {
      return CommonData.ErrorTypeName().Required;
    }

    if (errorNameDup) {
      return CommonData.ErrorTypeName().Duplicated;
    }

    if (errorNameSpecial) {
      return CommonData.ErrorTypeName().SpecialCharacter;
    }

    return "";
  };

  const handleValidateName = (name) => {
    let result = false;

    // Check required
    if (!name || name == "") {
      setErrorNameRequired(true);
      result = true;
    } else {
      setErrorNameRequired(false);
      // Check length
      if (name.length > 30) {
        setErrorNameLength(true);
        result = true;
      } else {
        setErrorNameLength(false);
      }
      // Check Special Character
      if (/[^a-zA-Z0-9 ]/.test(name)) {
        setErrorNameSpecial(true);
        result = true;
      } else {
        setErrorNameSpecial(false);
      }
      // Check duplicate type
      let list = [];
      list = allTypes.filter((x) => !x.isDeleted && x.name === name);
      if (list.length > 0) {
        setErrorNameDup(true);
        result = true;
      } else {
        setErrorNameDup(false);
      }
    }

    return result;
  };

  const save = async () => {
    setIsLoading(true);

    try {
      if (!handleValidateName(name)) {
        // create
        const token = await AsyncStorage.getItem("Token");
        if (token) {
          const decoded = jwt_decode(token);
          let request = {
            userId: decoded._id,
            name: name,
            description: description,
            createdDate: new Date(),
          };

          console.log(request);
          const response = await CreateType(request, token);

          if (response) {
            await handleGetAllTypes();

            console.log(response.data);
            actionFunction(response.data);
          }
        }
      }
    } catch (err) {
      console(err);
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => closeFunction()} size="lg">
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>Create type</Modal.Header>
        <Modal.Body>
          <Spinner visible={isLoading}></Spinner>

          <View style={styles.container}>
            {/* Header */}
            <View style={styles.customHeader}>
              <TouchableOpacity
                onPress={() => {
                  save();
                }}
                disabled={isInvalidName()}
              >
                <Text
                  style={
                    isInvalidName()
                      ? styles.customTextDisable
                      : styles.customText
                  }
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
            {/* Body */}
            <Text style={styles.label}>Name</Text>
            <Input
              variant="outline"
              p={2}
              placeholder="Type Name"
              fontSize={16}
              value={name}
              onChange={(v) => onChangeName(v.nativeEvent.text)}
            />
            <Text style={styles.error}>{showMessageErrorName()}</Text>
            <Text style={styles.label}>Description</Text>
            <Input
              variant="outline"
              p={2}
              placeholder="Type Description"
              fontSize={16}
              value={description}
              onChange={(v) => setDescription(v.nativeEvent.text)}
            />
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  customText: {
    color: Color.Button().ButtonActive,
    fontWeight: "600",
    fontSize: 16,
  },
  customTextDisable: {
    color: Color.Input().disable,
    fontWeight: "600",
    fontSize: 16,
  },
  customContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  customHeader: {
    display: "flex",
    flexDirection: "row-reverse",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginVertical: 5,
  },
});
