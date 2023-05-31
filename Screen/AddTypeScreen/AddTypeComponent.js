import {
  Box,
  Center,
  View,
  Text,
  HStack,
  Input,
  Stack,
  FormControl,
} from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Color from "../../Style/Color";
import PopupComponent from "../../Component/Common/PopupComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import {
  CreateType,
  UpdateType,
  DeleteType,
  getListAllTypesByUserId,
} from "../../Reducers/TypeReducer";
import { getListAllTasksByUserId } from "../../Reducers/TaskReducer";
import Spinner from "react-native-loading-spinner-overlay";

export default ({ navigation, typeId }) => {
  const allTypes = useSelector((state) => state.type.allTypes);
  const dispatch = useDispatch();

  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [errorNameLength, setErrorNameLength] = useState(false);
  const [errorNameDup, setErrorNameDup] = useState(false);
  // const [errorNameSpecial, setErrorNameSpecial] = useState(false);
  const [errorNameRequired, setErrorNameRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeId) {
      let foundItem = allTypes.find((x) => x._id == typeId);
      if (foundItem) {
        setName(foundItem.name);
        setDescription(foundItem.description);
        setData(foundItem);
      } else {
        setName("");
        setDescription("");
        setData(null);
      }
    }
  }, [typeId]);

  const isInvalidName = () => {
    return (
      // errorNameDup || errorNameLength || errorNameRequired || errorNameSpecial
      errorNameDup || errorNameLength || errorNameRequired
    );
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  const save = async () => {
    setIsLoading(true);

    try {
      if (!handleValidateName(name)) {
        // create
        if (!typeId) {
          const token = await AsyncStorage.getItem("Token");
          if (token) {
            const decoded = jwt_decode(token);
            let request = {
              userId: decoded._id,
              name: name,
              description: description,
              createdDate: new Date(),
            };

            const response = await CreateType(request, token);

            if (response) {
              await handleGetAllTypes();

              navigation.navigate("HomeTab", { screen: "Tasks" });
            }
          }
        }
        // Update
        else {
          const token = await AsyncStorage.getItem("Token");

          if (token) {
            let request = {
              ...data,
              name: name,
              description: description,
              updatedDate: new Date(),
            };

            const response = await UpdateType(request, token);

            if (response) {
              await handleGetAllTypes();

              navigation.navigate("HomeTab", { screen: "Tasks" });
            }
          }
        }
      }
    } catch (err) {
      console(err);
    }

    setIsLoading(false);
  };

  const deleteType = async () => {
    setIsLoading(true);

    try {
      // delete
      const token = await AsyncStorage.getItem("Token");
      if (token) {
        const response = await DeleteType(typeId, token);

        if (response) {
          await handleGetAllTypes();
          await handleGetAllTasks();

          navigation.navigate("HomeTab", { screen: "Tasks" });
        }
      }
    } catch (err) {
      console(err);
    }

    setIsLoading(false);
  };

  const handleGetAllTypes = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTypesByUserId({ userId: decoded._id }, token));
    }
  };

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
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
      // // Check Special Character
      // if (/[^a-zA-Z0-9 ]/.test(name)) {
      //   setErrorNameSpecial(true);
      //   result = true;
      // } else {
      //   setErrorNameSpecial(false);
      // }
      // Check duplicate type
      let list = [];
      if (typeId) {
        list = allTypes.filter(
          (x) => !x.isDeleted && x.name === name && x._id !== typeId
        );
      } else {
        list = allTypes.filter((x) => !x.isDeleted && x.name === name);
      }
      if (list.length > 0) {
        setErrorNameDup(true);
        result = true;
      } else {
        setErrorNameDup(false);
      }
    }

    return result;
  };

  const onChangeName = (name) => {
    let invalid = handleValidateName(name);
    setName(name);
  };

  const showMessageErrorName = () => {
    if (errorNameLength) {
      return "Tên ít nhất có 30 ký tự";
    }

    if (errorNameRequired) {
      return "Bắt buộc nhập tên";
    }

    if (errorNameDup) {
      return "Tên đã tồn tại";
    }

    // if (errorNameSpecial) {
    //   return "Tên không được chứa ký tự đặt biệt";
    // }

    return "";
  };

  return (
    <Center w="100%" h="100%">
      <Spinner visible={isLoading}></Spinner>

      <Box safeArea height="100%" width="100%">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <HStack>
              <Icon name="angle-left" size={25} style={styles.icon} />
              <Text paddingLeft={2} fontSize={18} style={styles.textBack}>
                Danh sách công việc
              </Text>
            </HStack>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            {typeId && (
              <TouchableOpacity onPress={() => openModal()}>
                <HStack>
                  <Text
                    paddingLeft={2}
                    fontSize={18}
                    color="red.500"
                    fontWeight={500}
                  >
                    Xóa
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => save()}>
              <HStack>
                <Text
                  paddingLeft={2}
                  fontSize={18}
                  color="blue.500"
                  fontWeight={500}
                  disabled={isInvalidName()}
                  style={isInvalidName() && styles.saveButtonDisable}
                >
                  Lưu
                </Text>
              </HStack>
            </TouchableOpacity>
          </View>
        </View>

        <FormControl isInvalid={isInvalidName()}>
          <Stack space={5} paddingX={3} marginBottom={2}>
            <Stack>
              <FormControl.Label
                _text={{ fontSize: 16, color: Color.Input().label }}
              >
                Tên loại công việc
              </FormControl.Label>
              <Input
                variant="outline"
                p={2}
                placeholder="Tên loại công việc"
                fontSize={16}
                value={name}
                onChange={(v) => onChangeName(v.nativeEvent.text)}
              />
              <FormControl.ErrorMessage>
                {showMessageErrorName()}
              </FormControl.ErrorMessage>
            </Stack>
          </Stack>
        </FormControl>

        <FormControl>
          <Stack space={5} paddingX={3}>
            <Stack>
              <FormControl.Label
                _text={{ fontSize: 16, color: Color.Input().label }}
              >
                Mô Tả
              </FormControl.Label>
              <Input
                variant="outline"
                p={2}
                placeholder="Mô tả"
                fontSize={16}
                value={description}
                onChange={(v) => setDescription(v.nativeEvent.text)}
              />
            </Stack>
          </Stack>
        </FormControl>

        <PopupComponent
          title={"Xóa"}
          content={"Bạn có chắc muốn xóa loại công việc này không?"}
          closeFunction={closeModal}
          isOpen={open}
          actionFunction={deleteType}
          update={false}
        ></PopupComponent>
      </Box>
    </Center>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    paddingTop: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  textBack: {
    fontWeight: "500",
    color: Color.Button().ButtonActive,
  },
  icon: {
    color: Color.Button().ButtonActive,
  },
  saveButtonDisable: {
    color: Color.Input().disable,
  },
});
