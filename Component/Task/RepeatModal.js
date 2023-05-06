import { Box, Center, Modal, View, Text, HStack, TextArea } from "native-base";
import { useEffect, useState, useRef } from "react";
import CommonData from "../../CommonData/CommonData";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Color from "../../Style/Color";
import ScrollPicker from "react-native-wheel-scrollview-picker";

export default ({ isOpen, actionFunction, closeFunction }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [mon, setMon] = useState(false);
  const [tue, setTue] = useState(false);
  const [wed, setWed] = useState(false);
  const [thu, setThu] = useState(false);
  const [fri, setFri] = useState(false);
  const [sat, setSat] = useState(false);
  const [sun, setSun] = useState(false);

  // Dropdown
  const [selectedNum, setSelectedNum] = useState(1);
  const [selectedRepeatType, setSelectedRepeatType] = useState("Days");

  const dataTypeRepeat = ["Days", "Weeks", "Months", "Years"];
  const dataNum = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  useEffect(() => {
    if (isOpen) {
      setIsCustom(false);
      setMon(false);
      setTue(false);
      setWed(false);
      setThu(false);
      setFri(false);
      setSat(false);
      setSun(false);
    }
  }, [isOpen]);

  const clickCustom = () => {
    setIsCustom(true);
  };

  const clickBack = () => {
    setIsCustom(false);
  };

  const clickSet = () => {
    let result = "Every " + selectedNum.toString() + " " + selectedRepeatType;
    if (selectedRepeatType === "Weeks") {
      let listDay = [];
      if (mon) listDay.push("Mon");
      if (tue) listDay.push("Tue");
      if (wed) listDay.push("Wed");
      if (thu) listDay.push("Thu");
      if (fri) listDay.push("Fri");
      if (sat) listDay.push("Sat");
      if (sun) listDay.push("Sun");

      if (listDay.length > 0) {
        listDay.forEach((x, index) =>
          index === 0 ? (result += ": " + x) : (result += ", " + x)
        );
      }
    }

    if (result.includes("Every 1 Days")) {
      result = CommonData.RepeatType().Daily;
    } else if (result.includes("Every 1 Weeks")) {
      if (result === "Every 1 Weeks") {
        result = CommonData.RepeatType().Weekly;
      } else {
        result =
          CommonData.RepeatType().Weekly + result.split("Every 1 Weeks")[1];
      }
    } else if (result.includes("Every 1 Months")) {
      result = CommonData.RepeatType().Monthly;
    } else if (result.includes("Every 1 Years")) {
      result = CommonData.RepeatType().Yearly;
    }

    actionFunction(result);
  };

  return (
    <Modal isOpen={isOpen} onClose={closeFunction} size="lg">
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>Repeat</Modal.Header>
        <Modal.Body>
          {isCustom ? (
            // Modal Custom
            <View style={styles.customModal}>
              {/* Header */}
              <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => clickBack()}>
                  <Icon name="angle-left" size={25} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.customHeaderText}>Repeat every ...</Text>
                <TouchableOpacity onPress={() => clickSet()}>
                  <Text style={styles.customText}>Set</Text>
                </TouchableOpacity>
              </View>
              {/* Input */}
              <View style={styles.customInput}>
                {/* Number */}
                <View style={styles.customInputItem}>
                  <ScrollPicker
                    dataSource={dataNum}
                    selectedIndex={0}
                    renderItem={(data, index) => {
                      return (
                        <View>
                          <Text>{data}</Text>
                        </View>
                      );
                    }}
                    onValueChange={(data, selectedIndex) => {
                      setSelectedNum(data);
                    }}
                    wrapperHeight={180}
                    wrapperWidth={150}
                    itemHeight={60}
                    highlightColor="#d8d8d8"
                    highlightBorderWidth={2}
                  />
                </View>

                {/* Type Repeat */}
                <View style={styles.customInputItem}>
                  <ScrollPicker
                    dataSource={dataTypeRepeat}
                    selectedIndex={0}
                    renderItem={(data, index) => {
                      return (
                        <View>
                          <Text>{data}</Text>
                        </View>
                      );
                    }}
                    onValueChange={(data, selectedIndex) => {
                      setSelectedRepeatType(data);
                    }}
                    wrapperHeight={180}
                    wrapperWidth={150}
                    itemHeight={60}
                    highlightColor="#d8d8d8"
                    highlightBorderWidth={2}
                  />
                </View>
              </View>
              {/* Select Day */}
              {selectedRepeatType === "Weeks" && (
                <View style={styles.selectDayContainer}>
                  {/* Mon */}
                  <TouchableOpacity onPress={() => setMon((prev) => !prev)}>
                    <View
                      style={
                        mon ? styles.selectDayItemChecked : styles.selectDayItem
                      }
                    >
                      <Text
                        style={
                          mon
                            ? styles.selectDayItemTextChecked
                            : styles.selectDayItemText
                        }
                      >
                        {"Mon"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Tue */}
                  <TouchableOpacity onPress={() => setTue((prev) => !prev)}>
                    <View
                      style={
                        tue ? styles.selectDayItemChecked : styles.selectDayItem
                      }
                    >
                      <Text
                        style={
                          tue
                            ? styles.selectDayItemTextChecked
                            : styles.selectDayItemText
                        }
                      >
                        {"Tue"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Wed */}
                  <TouchableOpacity onPress={() => setWed((prev) => !prev)}>
                    <View
                      style={
                        wed ? styles.selectDayItemChecked : styles.selectDayItem
                      }
                    >
                      <Text
                        style={
                          wed
                            ? styles.selectDayItemTextChecked
                            : styles.selectDayItemText
                        }
                      >
                        {"Wed"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Thu */}
                  <TouchableOpacity onPress={() => setThu((prev) => !prev)}>
                    <View
                      style={
                        thu ? styles.selectDayItemChecked : styles.selectDayItem
                      }
                    >
                      <Text
                        style={
                          thu
                            ? styles.selectDayItemTextChecked
                            : styles.selectDayItemText
                        }
                      >
                        {"Thu"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Fri */}
                  <TouchableOpacity onPress={() => setFri((prev) => !prev)}>
                    <View
                      style={
                        fri ? styles.selectDayItemChecked : styles.selectDayItem
                      }
                    >
                      <Text
                        style={
                          fri
                            ? styles.selectDayItemTextChecked
                            : styles.selectDayItemText
                        }
                      >
                        {"Fri"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Sat */}
                  <TouchableOpacity onPress={() => setSat((prev) => !prev)}>
                    <View
                      style={
                        sat ? styles.selectDayItemChecked : styles.selectDayItem
                      }
                    >
                      <Text
                        style={
                          sat
                            ? styles.selectDayItemTextChecked
                            : styles.selectDayItemText
                        }
                      >
                        {"Sat"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Sun */}
                  <TouchableOpacity onPress={() => setSun((prev) => !prev)}>
                    <View
                      style={
                        sun ? styles.selectDayItemChecked : styles.selectDayItem
                      }
                    >
                      <Text
                        style={
                          sun
                            ? styles.selectDayItemTextChecked
                            : styles.selectDayItemText
                        }
                      >
                        {"Sun"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            // Modal Choose
            <View>
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Never)}
              >
                <HStack space={3}>
                  <Text>{CommonData.RepeatType().Never}</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Daily)}
              >
                <HStack space={3}>
                  <Text>{CommonData.RepeatType().Daily}</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Weekly)}
              >
                <HStack space={3}>
                  <Text>{CommonData.RepeatType().Weekly}</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Monthly)}
              >
                <HStack space={3}>
                  <Text>{CommonData.RepeatType().Monthly}</Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Yearly)}
              >
                <HStack space={3}>
                  <Text>{CommonData.RepeatType().Yearly}</Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => clickCustom()}>
                <HStack space={3} style={styles.customContainer}>
                  <Text style={styles.customText}>
                    {CommonData.RepeatType().Custom}
                  </Text>
                  <Icon name="angle-right" size={25} style={styles.icon} />
                </HStack>
              </TouchableOpacity>
            </View>
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
  icon: {
    color: Color.Button().ButtonActive,
  },
  customText: {
    color: Color.Button().ButtonActive,
    fontWeight: "600",
  },
  customContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  customModal: {
    display: "flex",
    flexDirection: "column",
  },
  customHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  customHeaderText: {
    fontWeight: "500",
  },
  customInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 200,
    gap: 10,
    paddingTop: 20,
  },
  customInputItem: {
    flex: 1,
  },
  selectDayContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 30,
    justifyContent: "space-between",
  },
  selectDayItem: {
    borderColor: Color.Button().ButtonActive,
    borderWidth: 1,
    width: 35,
    height: 35,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    paddingTop: 5,
    borderRadius: 20,
  },
  selectDayItemText: {
    color: Color.Button().ButtonActive,
  },
  selectDayItemChecked: {
    borderColor: Color.Button().ButtonActive,
    borderWidth: 1,
    width: 35,
    height: 35,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    paddingTop: 5,
    borderRadius: 20,
    backgroundColor: Color.Button().ButtonActive,
  },
  selectDayItemTextChecked: {
    color: "#FFFFFF",
  },
});
