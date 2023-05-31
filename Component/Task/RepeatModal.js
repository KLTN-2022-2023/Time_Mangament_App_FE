import { Box, Center, Modal, View, Text, HStack, TextArea } from "native-base";
import { useEffect, useState, useRef } from "react";
import CommonData from "../../CommonData/CommonData";
import { TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Color from "../../Style/Color";
import ScrollPicker from "react-native-wheel-scrollview-picker";

export default ({ isOpen, actionFunction, closeFunction, selected }) => {
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
  const [selectedRepeatType, setSelectedRepeatType] = useState("Ngày");

  const dataTypeRepeat = ["Ngày", "Tuần", "Tháng", "Năm"];
  const dataNum = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  useEffect(() => {
    if (selected && selected.includes(":")) {
      setIsCustom(true);
    } else if (selected && selected.includes("Mỗi ")) {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setMon(false);
      setTue(false);
      setThu(false);
      setWed(false);
      setFri(false);
      setSat(false);
      setSun(false);
      setSelectedRepeatType("Ngày");
      setSelectedNum(1);
    }
  }, [selected, isOpen]);

  const clickCustom = () => {
    setIsCustom(true);
  };

  const clickBack = () => {
    setIsCustom(false);
  };

  const clickSet = () => {
    let result = "Mỗi " + selectedNum.toString() + " " + selectedRepeatType;
    if (selectedRepeatType === "Tuần") {
      let listDay = [];
      if (mon) listDay.push("T2");
      if (tue) listDay.push("T3");
      if (wed) listDay.push("T4");
      if (thu) listDay.push("T5");
      if (fri) listDay.push("T6");
      if (sat) listDay.push("T7");
      if (sun) listDay.push("CN");

      if (listDay.length > 0) {
        listDay.forEach((x, index) =>
          index === 0 ? (result += ": " + x) : (result += ", " + x)
        );
      }
    }

    if (result.includes("Mỗi 1 Ngày")) {
      result = CommonData.RepeatType().Daily;
    } else if (result.includes("Mỗi 1 Tuần")) {
      if (result === "Mỗi 1 Tuần") {
        result = CommonData.RepeatType().Weekly;
      } else {
        result = CommonData.RepeatType().Weekly + result.split("Mỗi 1 Tuần")[1];
      }
    } else if (result.includes("Mỗi 1 Tháng")) {
      result = CommonData.RepeatType().Monthly;
    } else if (result.includes("Mỗi 1 Năm")) {
      result = CommonData.RepeatType().Yearly;
    }

    actionFunction(result);
  };

  const isSelected = (value) => {
    if (!value && !selected) {
      return true;
    }

    return selected && selected === value;
  };

  return (
    <Modal isOpen={isOpen} onClose={closeFunction} size="lg">
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>Lặp lại</Modal.Header>
        <Modal.Body>
          {isCustom ? (
            // Modal Custom
            <View style={styles.customModal}>
              {/* Header */}
              <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => clickBack()}>
                  <Icon name="angle-left" size={25} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.customHeaderText}>Lặp lại mỗi ...</Text>
                <TouchableOpacity onPress={() => clickSet()}>
                  <Text style={styles.customText}>Đặt</Text>
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
              {selectedRepeatType === "Tuần" && (
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
                        {"T2"}
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
                        {"T3"}
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
                        {"T4"}
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
                        {"T5"}
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
                        {"T6"}
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
                        {"T7"}
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
                        {"CN"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            // Modal Choose
            <View>
              {/* Never */}
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Never)}
              >
                <HStack
                  px={2}
                  py={2}
                  style={isSelected(null) && styles.selected}
                >
                  <Text
                    style={isSelected(null) ? styles.textSelected : styles.text}
                  >
                    {CommonData.RepeatType().Never}
                  </Text>
                </HStack>
              </TouchableOpacity>

              {/* Daily */}
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Daily)}
              >
                <HStack
                  px={2}
                  py={2}
                  style={
                    isSelected(CommonData.RepeatType().Daily) && styles.selected
                  }
                >
                  <Text
                    style={
                      isSelected(CommonData.RepeatType().Daily)
                        ? styles.textSelected
                        : styles.text
                    }
                  >
                    {CommonData.RepeatType().Daily}
                  </Text>
                </HStack>
              </TouchableOpacity>

              {/* Weekly */}
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Weekly)}
              >
                <HStack
                  px={2}
                  py={2}
                  style={
                    isSelected(CommonData.RepeatType().Weekly) &&
                    styles.selected
                  }
                >
                  <Text
                    style={
                      isSelected(CommonData.RepeatType().Weekly)
                        ? styles.textSelected
                        : styles.text
                    }
                  >
                    {CommonData.RepeatType().Weekly}
                  </Text>
                </HStack>
              </TouchableOpacity>

              {/* Monthly  */}
              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Monthly)}
              >
                <HStack
                  px={2}
                  py={2}
                  style={
                    isSelected(CommonData.RepeatType().Monthly) &&
                    styles.selected
                  }
                >
                  <Text
                    style={
                      isSelected(CommonData.RepeatType().Monthly)
                        ? styles.textSelected
                        : styles.text
                    }
                  >
                    {CommonData.RepeatType().Monthly}
                  </Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sort}
                onPress={() => actionFunction(CommonData.RepeatType().Yearly)}
              >
                <HStack
                  px={2}
                  py={2}
                  style={
                    isSelected(CommonData.RepeatType().Yearly) &&
                    styles.selected
                  }
                >
                  <Text
                    style={
                      isSelected(CommonData.RepeatType().Yearly)
                        ? styles.textSelected
                        : styles.text
                    }
                  >
                    {CommonData.RepeatType().Yearly}
                  </Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => clickCustom()}>
                <HStack px={2} py={2} style={styles.customContainer}>
                  <Text style={styles.text}>
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
    fontSize: 16,
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
  customText: {
    color: Color.Button().ButtonActive,
    fontWeight: "600",
    fontSize: 16,
  },
});
