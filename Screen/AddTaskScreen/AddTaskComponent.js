import {
  Box,
  Center,
  Modal,
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
import { formatInTimeZone } from "date-fns-tz";
import Spinner from "react-native-loading-spinner-overlay";
import Color from "../../Style/Color";
import CommonData from "../../CommonData/CommonData";
import PopupComponent from "../../Component/Common/PopupComponent";

export default ({ navigation, taskId }) => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("New Task");
  const [note, setNote] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remind, setRemind] = useState(null);
  const [repeat, setRepeat] = useState(null);
  const [type, setType] = useState(null);
  const [open, setOpen] = useState(false);

  // Modal
  const [modalRepeat, setModalRepeat] = useState(false);
  const [modalRemind, setModalRemind] = useState(false);
  const [modalType, setModalType] = useState(false);

  // Validate
  const [errorNameRequired, setErrorNameRequired] = useState(false);
  const [errorDates, setErrorDates] = useState(false);

  // Start
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [calendarStartDate, setCalendarStartDate] = useState(false);
  const [calendarStartTime, setCalendarStartTime] = useState(false);

  // Due
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [calendarDueDate, setCalendarDueDate] = useState(false);
  const [calendarDueTime, setCalendarDueTime] = useState(false);

  // End Repeat
  const [endRepeat, setEndRepeat] = useState(null);
  const [calendarEndRepeat, setCalendarEndRepeat] = useState(false);

  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const allTypes = useSelector((state) => state.type.allTypes);
  const navigation1 = useNavigation();
  const dateTime = moment(new Date()).format("YYYY-MM-DD");

  // Get Detail
  useEffect(() => {
    let foundItem = allTasks.find((x) => x._id === taskId);
    if (foundItem) {
      setData(foundItem);

      //set Data
      setName(foundItem.name);
      setNote(foundItem.description);
      setType(allTypes.find((x) => x._id === foundItem.typeId));
      setRemind(foundItem.remindTime);
      setRepeat(foundItem.repeatTime);
      setIsImportant(foundItem.isImportant);
      setIsDone(
        foundItem.status === CommonData.TaskStatus().Done ? true : false
      );

      let startTimeString = formatInTimeZone(
        foundItem.startTime,
        "Asia/Ho_Chi_Minh",
        "yyyy-MM-dd HH:mm"
      );
      let dueTimeString = formatInTimeZone(
        foundItem.dueTime,
        "Asia/Ho_Chi_Minh",
        "yyyy-MM-dd HH:mm"
      );
      setStartDate(startTimeString.split(" ").shift());
      setStartTime(startTimeString.split(" ")[1]);
      setDueDate(dueTimeString.split(" ").shift());
      setDueTime(dueTimeString.split(" ")[1]);

      if (foundItem.endRepeat) {
        let endRepeatString = formatInTimeZone(
          foundItem.endRepeat,
          "Asia/Ho_Chi_Minh",
          "yyyy-MM-dd HH:mm"
        );
        setEndRepeat(endRepeatString.split(" ").shift());
      }
    } else {
      setData(null);
    }
  }, [taskId]);

  // Set default
  useEffect(() => {
    if (!taskId) {
      let dateNowString = formatInTimeZone(
        new Date(),
        "Asia/Ho_Chi_Minh",
        "yyyy-MM-dd HH:mm"
      );
      setStartDate(dateNowString.split(" ").shift());
      setStartTime(dateNowString.split(" ")[1]);
      setDueDate(dateNowString.split(" ").shift());
      setDueTime(dateNowString.split(" ")[1]);
      setEndRepeat(dateNowString.split(" ").shift());

      setType(allTypes.filter((x) => !x.isDeleted)[0]);
    }
  }, []);

  //Validate
  useEffect(() => {
    if (startDate && startTime && dueDate && dueTime) {
      if (startDate > dueDate) {
        setErrorDates(true);
      } else if (startDate == dueDate) {
        if (startTime > dueTime) {
          setErrorDates(true);
        } else {
          setErrorDates(false);
        }
      } else {
        setErrorDates(false);
      }
    }
  }, [startDate, startTime, dueDate, dueTime]);

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
  };

  const inValidData = () => {
    return errorDates || errorNameRequired;
  };

  const onChangeName = (v) => {
    if (!v || v == "") {
      setErrorNameRequired(true);
    } else {
      setErrorNameRequired(false);
    }
    setName(v);
  };

  const handlePressStar = async () => {
    setIsImportant((prevState) => !prevState);
  };

  const hideDatePicker = () => {
    setCalendarStartDate(false);
    setCalendarDueDate(false);
    setCalendarEndRepeat(false);
  };

  const hideTimePicker = () => {
    setCalendarStartTime(false);
    setCalendarDueTime(false);
  };

  const confirmStartDate = (date) => {
    let dateString = formatInTimeZone(
      date,
      "Asia/Ho_Chi_Minh",
      "yyyy-MM-dd HH:mm"
    );
    setStartDate(dateString.split(" ").shift());
    setCalendarStartDate(false);
  };

  const confirmStartTime = (time) => {
    let dateString = formatInTimeZone(
      time,
      "Asia/Ho_Chi_Minh",
      "yyyy-MM-dd HH:mm"
    );
    setStartTime(dateString.split(" ")[1]);
    setCalendarStartTime(false);
  };

  const confirmDueDate = (date) => {
    let dateString = formatInTimeZone(
      date,
      "Asia/Ho_Chi_Minh",
      "yyyy-MM-dd HH:mm"
    );
    setDueDate(dateString.split(" ").shift());
    setCalendarDueDate(false);
  };

  const confirmDueTime = (time) => {
    let dateString = formatInTimeZone(
      time,
      "Asia/Ho_Chi_Minh",
      "yyyy-MM-dd HH:mm"
    );
    setDueTime(dateString.split(" ")[1]);
    setCalendarDueTime(false);
  };

  const confirmEndRepeat = (date) => {
    let dateString = formatInTimeZone(
      date,
      "Asia/Ho_Chi_Minh",
      "yyyy-MM-dd HH:mm"
    );
    setEndRepeat(dateString.split(" ").shift());
    setCalendarEndRepeat(false);
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

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setOpen(true);
  };

  const deleteTask = async () => {
    setIsLoading(true);

    try {
      // delete
      const token = await AsyncStorage.getItem("Token");
      if (token) {
        const response = await DeleteTask(taskId, token);

        if (response) {
          await handleGetAllTasks();

          navigation.navigate("HomeTab", { screen: "Tasks" });
        }
      }
    } catch (err) {
      console(err);
    }

    setIsLoading(false);
  };

  const save = async () => {
    setIsLoading(true);

    try {
      // create
      if (!taskId) {
        const token = await AsyncStorage.getItem("Token");
        if (token) {
          const decoded = jwt_decode(token);
          let request = {
            userId: decoded._id,
            typeId: type._id,
            name: name,
            description: note,
            startTime: new Date(startDate + " " + startTime),
            dueTime: new Date(dueDate + " " + dueTime),
            files: [],
            checkList: [],
            isImportant: isImportant,
            status: isDone
              ? CommonData.TaskStatus().Done
              : CommonData.TaskStatus().New,
            remindTime: remind,
            repeatTime: repeat,
            endRepeat: repeat ? new Date(endRepeat) : null,
            isRepeatedById: null,
            createdDate: new Date(),
          };

          const response = await CreateTask(request, token);

          if (response) {
            await handleGetAllTasks();

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
            typeId: type._id,
            name: name,
            description: note,
            startTime: new Date(startDate + " " + startTime),
            dueTime: new Date(dueDate + " " + dueTime),
            files: [],
            checkList: [],
            isImportant: isImportant,
            status: isDone
              ? CommonData.TaskStatus().Done
              : CommonData.TaskStatus().New,
            remindTime: remind,
            repeatTime: repeat,
            endRepeat: repeat ? new Date(endRepeat) : null,
            isRepeatedById: null,
            updatedDate: new Date(),
          };
          const response = await UpdateTask(request, token);
          console.log(response);
          if (response) {
            await handleGetAllTasks();
            navigation.navigate("HomeTab", { screen: "Tasks" });
          }
        }
      }
    } catch (err) {
      console(err);
    }

    setIsLoading(false);
  };

  return (
    <Center w="100%" h="100%">
      <Spinner visible={isLoading}></Spinner>

      <PopupComponent
        title={"Delete"}
        content={"Do you want to delete this task?"}
        closeFunction={closeModal}
        isOpen={open}
        actionFunction={deleteTask}
      ></PopupComponent>

      <Box safeArea height="100%" width="100%">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <HStack>
              <Icon name="angle-left" size={25} style={styles.icon} />
              <Text paddingLeft={2} fontSize={18} style={styles.textBack}>
                Tasks List
              </Text>
            </HStack>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            {taskId && (
              <TouchableOpacity onPress={() => openModal()}>
                <HStack>
                  <Text
                    paddingLeft={2}
                    fontSize={18}
                    color="red.500"
                    fontWeight={500}
                  >
                    Delete
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}

            <TouchableOpacity disabled={inValidData()} onPress={() => save()}>
              <HStack>
                <Text
                  paddingLeft={2}
                  fontSize={18}
                  color="blue.500"
                  fontWeight={500}
                >
                  Save
                </Text>
              </HStack>
            </TouchableOpacity>
          </View>
        </View>

        {/* Checkbox */}
        <HStack style={styles.title}>
          <Checkbox
            colorScheme="indigo"
            borderRadius={20}
            size="lg"
            accessibilityLabel="Tap me!"
            my={2}
            isChecked={isDone}
            onChange={() => setIsDone((prevState) => !prevState)}
          >
            {/* Name */}
            <TextInput
              fontSize={16}
              value={name}
              onChangeText={(e) => onChangeName(e)}
            />
          </Checkbox>

          {isImportant ? (
            <Icon
              name="star"
              size={30}
              style={styles.iconStarCheck}
              onPress={handlePressStar}
            />
          ) : (
            <Icon
              name="star-o"
              size={30}
              style={styles.iconStarUnCheck}
              onPress={handlePressStar}
            />
          )}
        </HStack>

        {/* Validate Name */}
        {errorNameRequired && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Task Name is required</Text>
          </View>
        )}

        {/* Check List */}
        {/* <TouchableOpacity>
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
        </TouchableOpacity> */}

        <View style={styles.viewGroup}>
          {/* Type */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Type            "}</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity onPress={() => setModalType(true)}>
                <View style={styles.remindContainer}>
                  <Text style={styles.dateTimeText}>
                    {type ? type.name : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Modal Type */}
          <Modal
            isOpen={modalType}
            onClose={() => setModalType(false)}
            size="lg"
          >
            <Modal.Content maxWidth="350">
              <Modal.CloseButton />
              <Modal.Header>Type</Modal.Header>
              <Modal.Body>
                {allTypes.map(
                  (x) =>
                    !x.isDeleted && (
                      <TouchableOpacity
                        style={styles.sort}
                        onPress={() => {
                          setType(x);
                          setModalType(false);
                        }}
                        key={x._id}
                      >
                        <HStack space={3}>
                          <Text>{x.name}</Text>
                        </HStack>
                      </TouchableOpacity>
                    )
                )}
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {/* Start time */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Start Time  "}</Text>
            <View style={styles.dateTimeContainer}>
              {/* Date */}
              <TouchableOpacity onPress={() => setCalendarStartDate(true)}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateTimeText}>{startDate}</Text>
                </View>
              </TouchableOpacity>

              {/* Time */}
              <TouchableOpacity onPress={() => setCalendarStartTime(true)}>
                <View style={styles.timeContainer}>
                  <Text style={styles.dateTimeText}>{startTime}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <DateTimePickerModal
            isVisible={calendarStartDate}
            mode="date"
            onConfirm={confirmStartDate}
            onCancel={hideDatePicker}
          />
          <DateTimePickerModal
            isVisible={calendarStartTime}
            mode="time"
            onConfirm={confirmStartTime}
            onCancel={hideTimePicker}
          />

          {/* Due time */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Due Time    "}</Text>
            <View style={styles.dateTimeContainer}>
              {/* Date */}
              <TouchableOpacity onPress={() => setCalendarDueDate(true)}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateTimeText}>{dueDate}</Text>
                </View>
              </TouchableOpacity>

              {/* Time */}
              <TouchableOpacity onPress={() => setCalendarDueTime(true)}>
                <View style={styles.timeContainer}>
                  <Text style={styles.dateTimeText}>{dueTime}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <DateTimePickerModal
            isVisible={calendarDueDate}
            mode="date"
            onConfirm={confirmDueDate}
            onCancel={hideDatePicker}
          />
          <DateTimePickerModal
            isVisible={calendarDueTime}
            mode="time"
            onConfirm={confirmDueTime}
            onCancel={hideTimePicker}
          />

          {/* Validate Dates */}
          {errorDates && (
            <View style={styles.errorDateContainer}>
              <Text style={styles.errorText}>
                Due Date must be greater than Start Date
              </Text>
            </View>
          )}

          {/* Remind */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Remind       "}</Text>
            <View style={styles.dateTimeContainer}>
              {/* Date */}
              <TouchableOpacity onPress={() => setModalRemind(true)}>
                <View style={styles.remindContainer}>
                  <Text style={styles.dateTimeText}>
                    {remind && remind != "" ? remind : "Never"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Modal Remind */}
          <Modal
            isOpen={modalRemind}
            onClose={() => setModalRepeat(false)}
            size="lg"
          >
            <Modal.Content maxWidth="350">
              <Modal.CloseButton />
              <Modal.Header>Remind</Modal.Header>
              <Modal.Body>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setRemind(null);
                    setModalRemind(false);
                  }}
                >
                  <HStack space={3}>
                    <Text>Never</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setModalRemind(false);
                    setRemind("On Due Time");
                  }}
                >
                  <HStack space={3}>
                    <Text>On Due Time</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setModalRemind(false);
                    setRemind("1 day before Due Time");
                  }}
                >
                  <HStack space={3}>
                    <Text>1 day before Due Time</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setModalRemind(false);
                    setRemind("5 minutes before Due Time");
                  }}
                >
                  <HStack space={3}>
                    <Text>5 minutes before Due Time</Text>
                  </HStack>
                </TouchableOpacity>
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {/* Repeat */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"Repeat        "}</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity onPress={() => setModalRepeat(true)}>
                <View style={styles.remindContainer}>
                  <Text style={styles.dateTimeText}>
                    {repeat && repeat != "" ? repeat : "Never"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* Modal Repeat */}
          <Modal
            isOpen={modalRepeat}
            onClose={() => setModalRepeat(false)}
            size="lg"
          >
            <Modal.Content maxWidth="350">
              <Modal.CloseButton />
              <Modal.Header>Repeat</Modal.Header>
              <Modal.Body>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setRepeat(null);
                    setModalRepeat(false);
                  }}
                >
                  <HStack space={3}>
                    <Text>Never</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setModalRepeat(false);
                    setRepeat("Everyday");
                  }}
                >
                  <HStack space={3}>
                    <Text>Everyday</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setModalRepeat(false);
                    setRepeat("Every Week");
                  }}
                >
                  <HStack space={3}>
                    <Text>Every Week</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setModalRepeat(false);
                    setRepeat("Every Month");
                  }}
                >
                  <HStack space={3}>
                    <Text>Every Month</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sort}
                  onPress={() => {
                    setModalRepeat(false);
                    setRepeat("Every Year");
                  }}
                >
                  <HStack space={3}>
                    <Text>Every Year</Text>
                  </HStack>
                </TouchableOpacity>
              </Modal.Body>
            </Modal.Content>
          </Modal>

          {/* End Repeat */}
          <View style={styles.viewOnGroup}>
            <Text style={styles.iconOld}>{"End Repeat"}</Text>
            <View style={styles.dateTimeContainer}>
              {repeat && (
                <TouchableOpacity onPress={() => setCalendarEndRepeat(true)}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateTimeText}>{endRepeat}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <DateTimePickerModal
            isVisible={calendarEndRepeat}
            mode="date"
            onConfirm={confirmEndRepeat}
            onCancel={hideDatePicker}
          />
        </View>

        {/* Files */}
        {/* <View>{file != null ? <Text>{file.name}</Text> : null}</View>
        <View style={styles.view}>
          <Icon size={20} name="paperclip" style={styles.icon}></Icon>
          <TouchableOpacity style={styles.button} onPress={selectFile}>
            <Text>Thêm tệp</Text>
          </TouchableOpacity>
        </View> */}

        {/* Note */}
        <View marginTop={4}>
          <TextArea
            onChangeText={(e) => setNote(e)}
            value={note}
            fontSize={16}
            h={200}
            placeholder="Add Note"
            w="100%"
            maxW="400"
          />
        </View>
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
  text_header: {
    paddingLeft: 30,
    fontSize: 20,
    paddingBottom: 30,
  },
  iconOld: {
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
  viewGroup: {
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
    padding: 3,
    paddingBottom: 10,
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
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  header_text: {
    fontSize: 20,
    paddingBottom: 30,
  },

  errorContainer: {
    paddingLeft: 45,
  },
  errorDateContainer: {
    paddingLeft: 95,
  },
  errorText: {
    color: "red",
  },
  iconStarCheck: {
    marginTop: 5,
    color: Color.Button().ButtonActive,
  },
  iconStarUnCheck: {
    marginTop: 5,
  },
  remindContainer: {
    minWidth: 80,
    height: 30,
    backgroundColor: Color.Button().ButtonActive,
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dateContainer: {
    width: 80,
    height: 30,
    backgroundColor: Color.Button().ButtonActive,
    justifyContent: "center",
    borderRadius: 5,
  },
  timeContainer: {
    width: 50,
    height: 30,
    backgroundColor: Color.Button().ButtonActive,
    justifyContent: "center",
    borderRadius: 5,
  },
  dateTimeText: {
    color: Color.Button().Text,
    textAlign: "center",
  },
  dateTimeContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    flex: 1,
    marginRight: 10,
    borderBottomColor: "#BBBBBB",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  sort: {
    paddingBottom: 20,
  },
});
