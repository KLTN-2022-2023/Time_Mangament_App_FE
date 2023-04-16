import {
  Box,
  Center,
  Heading,
  Input,
  View,
  Text,
  Checkbox,
  HStack,
  Popover,
  NativeBaseProvider,
  TextArea,
} from "native-base";
import { useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  CreateTask,
  DeleteTask,
  MarkImportant,
  UpdateStatus,
  UpdateTask,
  Upload,
} from "../../Reducers/TaskReducer";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntIcon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import moment from "moment/moment";
import { Snackbar } from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { getListAllTasksByUserId } from "../../Reducers/TaskReducer.js";

const AddTaskComponent = ({ navigation }) => {
  const navigation1 = useNavigation();
  const [name, setName] = useState("Tieu de");
  const [repeatTime, setRepeatTime] = useState("Nhắc tôi");
  const [dueTime, setDueTime] = useState("Thêm ngày đến hạn");
  const [reuse, setReuse] = useState("Lặp lại");
  const [description, setDescription] = useState();
  const [file, setFile] = useState(null);
  const [colorStar, setColorStar] = useState("black");
  const [calendarRepeat, setCalendarRepeat] = useState(false);
  const [calendarDue, setCalendarDue] = useState(false);
  const [message, setMessage] = useState();
  const allTasks = useSelector((state) => state.task.allTasks);

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
  };

  useEffect(() => {
    console.log(allTasks.length);
  }, [allTasks]);

  const styles = StyleSheet.create({
    header: {
      alignContent: "center",
      justifyContent: "space-between",
    },
    text_header: {
      paddingLeft: 30,
      fontSize: 20,
      paddingBottom: 30,
    },
    icon: {
      paddingBottom: 10,
      paddingLeft: 10,
    },
    view: {
      display: "flex",
      flexDirection: "row",
      paddingTop: 10,
      marginTop: 10,
      gap: 20,
      shadowColor: "#000000",
      borderColor: "#000000",
      shadowOpacity: 1.0,
      shadowRadius: 0,
      shadowOffset: {
        height: 3,
        width: 5,
      },
      elevation: 2,
    },
    viewgroup: {
      marginTop: 10,
      borderColor: "#000000",
      shadowColor: "#000000",
      shadowOpacity: 1.0,
      shadowRadius: 0,
      shadowOffset: {
        height: 3,
        width: 0,
      },
      elevation: 2,
    },
    viewOnGroup: {
      display: "flex",
      flexDirection: "row",
      paddingTop: 10,
      gap: 20,
    },
    textAreaContainer: {
      marginTop: 10,
      borderColor: "grey",
      borderWidth: 1,
      borderRadius: 20,
    },
    textArea: {
      height: 150,
      justifyContent: "flex-start",
      shadowColor: "black",
    },
    title: {
      justifyContent: "space-between",
      alignContent: "center",
    },
    header_text: {
      fontSize: 20,
      paddingBottom: 30,
    },
    footer: {
      justifyContent: "space-between",
      paddingTop: 20,
    },
    star: {
      color: colorStar,
    },
  });
  const hideDatePicker = () => {
    setCalendarRepeat(false);
    // setCalendarDue(false);
  };

  const confirmRepeatTime = (date) => {
    setRepeatTime(moment(date).format("YYYY-MM-DD hh:mm:ss"));
    hideDatePicker();
  };
  const confirmDueTime = (date) => {
    setDueTime(moment(date).format("YYYY-MM-DD"));
  };
  const checkPermissions = async () => {
    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (!result) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title:
              "You need to give storage permission to download and save the file",
            message: "App needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
          return true;
        } else {
          Alert.alert("Error", I18n.t("PERMISSION_ACCESS_FILE"));

          console.log("Camera permission denied");
          return false;
        }
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  async function selectFile() {
    try {
      const result = await checkPermissions();

      if (result) {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
          type: "image/*",
        });

        if (result.type === "success") {
          // Printing the log realted to the file
          console.log("res : " + JSON.stringify(result));
          // Setting the state to show single file attributes
          setFile(result);
        }
      }
    } catch (err) {
      setFile(null);
      console.warn(err);
      return false;
    }
  }
  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await Upload(formData);
    // alert(response);
  };
  const dateTime = moment(new Date()).format("YYYY-MM-DD");
  const Important = async () => {
    // uploadFile();
    setColorStar("red");
    // const id = "640d20e7efa0dc571c1277bb";
    // const token = await AsyncStorage.getItem("Token");
    // try {
    //   const result = await MarkImportant(id, token);
    //   //alert(result);
    // } catch (err) {
    //   alert("Error");
    // }
  };

  const AddTask = async () => {
    const token = await AsyncStorage.getItem("Token");
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDBkMWUzOTA0NTVmZWIwMWNiZjhmNTAiLCJlbWFpbCI6ImgyMjEyMDAwQGdtYWlsLmNvbSIsImlhdCI6MTY4MDY3NjU3NSwiZXhwIjoxNjgxMDQzNzc1fQ.xUxpSX-3H8UtXKVXL2syFUtWyrzSu9ZjGISC6_0mXzE";
    const decoded = jwt_decode(token);
    const userId = decoded._id;
    try {
      const result = await CreateTask(
        { name, dueTime, repeatTime, description, userId },
        token
      );
      if (result && result.data) {
        uploadFile();
        await handleGetAllTasks();
      }
    } catch (err) {
      //   alert("userId");
    }
  };

  const Delete = async () => {
    const token = await AsyncStorage.getItem("Token");
    //const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDBkMWUzOTA0NTVmZWIwMWNiZjhmNTAiLCJlbWFpbCI6ImgyMjEyMDAwQGdtYWlsLmNvbSIsImlhdCI6MTY4MDY3NjU3NSwiZXhwIjoxNjgxMDQzNzc1fQ.xUxpSX-3H8UtXKVXL2syFUtWyrzSu9ZjGISC6_0mXzE";
    const id = "642c6297b920b4b1e69fa3b8";
    try {
      const result = await DeleteTask(id, token);
      setMessage(result.message);
      await setTimeout(() => {
        setMessage(null);
      }, 3000);
      navigation1.navigate("TaskListScreen");
    } catch (err) {
      //   alert(err);
    }
  };

  const updateTask = async () => {
    const token = await AsyncStorage.getItem("Token");
    try {
      const response = await UpdateTask(
        { name, dueTime, repeatTime, description, userId },
        token
      );
    } catch (err) {
      //   alert(err);
    }
  };

  const Update = async () => {
    const token = await AsyncStorage.getItem("Token");
    const id = "640d20e7efa0dc571c1277bb";
    try {
      const response = await UpdateStatus(id, token);
    } catch (err) {
      //   alert(err);
    }
  };
  return (
    <NativeBaseProvider>
      <Center w="100%" paddingTop={10}>
        <Box safeArea p="2" py="2" w="100%" maxW="350">
          <HStack style={styles.header}>
            <TouchableOpacity style={styles.header_text}>
              <HStack>
                <Icon
                  onPress={() => navigation.goBack()}
                  name="angle-left"
                  size={30}
                />
                <Text paddingLeft={5} fontSize={20}>
                  List Task
                </Text>
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity style={styles.header_text} onPress={AddTask}>
              <HStack>
                <Text paddingLeft={2} fontSize={20} color="blue.500">
                  Save
                </Text>
              </HStack>
            </TouchableOpacity>
          </HStack>
          <HStack style={styles.title}>
            <Checkbox value="one" my={2} onChange={Update}>
              <TextInput value={name} onChangeText={(e) => setName(e)} />
            </Checkbox>
            <Icon
              size={30}
              style={styles.star}
              name="star-o"
              onPress={Important}
            />
          </HStack>
          <TouchableOpacity>
            <HStack>
              <Text fontSize={30} color="blue.500">
                +
              </Text>
              <TextInput
                placeholder="Thêm bước"
                paddingLeft={20}
                paddingTop={5}
              ></TextInput>
            </HStack>
          </TouchableOpacity>
          <View style={styles.viewgroup}>
            <Popover
              trigger={(triggerProps) => {
                return (
                  <View style={styles.viewOnGroup} onCh>
                    <EvilIcons
                      size={25}
                      name="bell"
                      style={styles.icon}
                    ></EvilIcons>

                    <Text
                      {...triggerProps}
                      borderBottomWidth={1}
                      width="80%"
                      borderBottomColor="#BBBBBB"
                      onChange
                    >
                      {repeatTime}
                    </Text>
                  </View>
                );
              }}
            >
              <Popover.Content w="56">
                <Popover.Body>
                  <HStack paddingBottom={5}>
                    <Icon name="clock-o" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() =>
                        setRepeatTime(
                          moment(dateTime).format("YYYY-MM-DD hh:mm:ss")
                        )
                      }
                    >
                      Cuối ngày
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <Icon name="clock-o" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() =>
                        setRepeatTime(
                          moment(dateTime)
                            .add(1, "day")
                            .format("YYYY-MM-DD hh:mm:ss")
                        )
                      }
                    >
                      Ngày mai
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <Icon name="clock-o" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() =>
                        setRepeatTime(
                          moment(dateTime)
                            .add(1, "week")
                            .format("YYYY-MM-DD hh:mm:ss")
                        )
                      }
                    >
                      Tuần tới
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <Icon name="clock-o" size={20} />
                    <Text
                      onPress={() => setCalendarRepeat(true)}
                      style={{ paddingLeft: 10 }}
                    >
                      Chọn ngày
                    </Text>
                  </HStack>
                  <DateTimePickerModal
                    isVisible={calendarRepeat}
                    mode="date"
                    onConfirm={confirmRepeatTime}
                    onCancel={hideDatePicker}
                  />
                </Popover.Body>
              </Popover.Content>
            </Popover>

            <Popover
              trigger={(triggerProps) => {
                return (
                  <View style={styles.viewOnGroup}>
                    <AntIcon size={25} name="calendar" style={styles.icon} />
                    <Text
                      {...triggerProps}
                      borderBottomWidth={1}
                      width="80%"
                      borderBottomColor="#BBBBBB"
                    >
                      {dueTime}
                    </Text>
                  </View>
                );
              }}
            >
              <Popover.Content w="56">
                <Popover.Body>
                  <HStack paddingBottom={5}>
                    <AntIcon name="calendar" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() => setDueTime(dateTime)}
                    >
                      Hôm nay
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <AntIcon name="calendar" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() =>
                        setDueTime(
                          moment(dateTime).add(1, "day").format("YYYY-MM-DD")
                        )
                      }
                    >
                      Ngày mai
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <AntIcon name="calendar" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() =>
                        setDueTime(
                          moment(dateTime).add(1, "week").format("YYYY-MM-DD")
                        )
                      }
                    >
                      Tuần tới
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <Icon name="calendar" size={20} />
                    <Text
                      onPress={() => setCalendarDue(true)}
                      style={{ paddingLeft: 10 }}
                    >
                      Chọn ngày
                    </Text>
                  </HStack>
                  <DateTimePickerModal
                    isVisible={calendarDue}
                    mode="date"
                    onConfirm={confirmDueTime}
                    onCancel={hideDatePicker}
                  />
                </Popover.Body>
              </Popover.Content>
            </Popover>

            <Popover
              trigger={(triggerProps) => {
                return (
                  <View style={styles.viewOnGroup}>
                    <AntIcon
                      size={20}
                      name="retweet"
                      style={styles.icon}
                    ></AntIcon>
                    <Text {...triggerProps}>{reuse}</Text>
                  </View>
                );
              }}
            >
              <Popover.Content w="56">
                <Popover.Body>
                  <HStack paddingBottom={5}>
                    <Icon name="magic" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() => setReuse()}
                    >
                      Mỗi 1 ngày
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <Icon name="magic" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() => setReuse()}
                    >
                      Mỗi tuần
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <Icon name="magic" size={20} />
                    <Text
                      style={{ paddingLeft: 10 }}
                      onPress={() => setReuse()}
                    >
                      Mỗi tháng
                    </Text>
                  </HStack>
                  <HStack paddingBottom={5}>
                    <Icon name="magic" size={20} />
                    <Text style={{ paddingLeft: 10 }}>Mỗi năm</Text>
                  </HStack>
                </Popover.Body>
              </Popover.Content>
            </Popover>
          </View>

          <View>{file != null ? <Text>{file.name}</Text> : null}</View>

          <View style={styles.view}>
            <Icon size={20} name="paperclip" style={styles.icon}></Icon>
            <TouchableOpacity style={styles.button} onPress={selectFile}>
              <Text>Thêm tệp</Text>
            </TouchableOpacity>
          </View>
          <View marginTop={4}>
            <TextArea
              onChangeText={(e) => setDescription(e)}
              h={200}
              placeholder="Thêm chú thích"
              w="100%"
              maxW="400"
            />
          </View>
          <View>
            <TouchableOpacity>
              <HStack style={styles.footer}>
                <Text>Đã tạo vào </Text>
                <AntIcon size={20} name="delete" onPress={Delete} />
              </HStack>
            </TouchableOpacity>
          </View>
          {message ? <Snackbar textColor="black" message={message} /> : null}
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};
export default AddTaskComponent;
