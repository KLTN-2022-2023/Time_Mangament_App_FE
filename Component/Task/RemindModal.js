import { Modal, View, Text, HStack, TextArea } from "native-base";
import { useEffect, useState } from "react";
import CommonData from "../../CommonData/CommonData";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Color from "../../Style/Color";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { Hours, Minutes, DaysRemind } from "../../CommonData/Data";

export default ({ isOpen, actionFunction, closeFunction, selected }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [day, setDay] = useState(DaysRemind[0]);
  const [hour, setHour] = useState(Hours[0]);
  const [minute, setMinute] = useState(Minutes[0]);

  useEffect(() => {
    if (selected && selected.includes(":")) {
      setIsCustom(true);

      // set Day
      let list = selected.split(" (");
      setDay(list[0]);

      // set Hour Minute
      let list2 = list[1].split(")");
      let list3 = list2[0].split(":");
      setHour(list3[0]);
      setMinute(list3[1]);
    } else {
      setIsCustom(false);
    }
  }, [selected]);

  const clickCustom = () => {
    setIsCustom(true);
  };

  const clickBack = () => {
    setIsCustom(false);
  };

  const isSelected = (value) => {
    if (!value && !selected) {
      return true;
    }

    return selected && selected === value;
  };

  const clickSet = () => {
    let result = day + " " + "(" + hour + ":" + minute + ")";
    actionFunction(day + " " + "(" + hour + ":" + minute + ")");
  };

  const findIndexDay = (value) => {
    return DaysRemind.findIndex((x) => x === value);
  };

  const findIndexHour = (value) => {
    return Hours.findIndex((x) => x === value);
  };

  const findIndexMinute = (value) => {
    return Minutes.findIndex((x) => x === value);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => closeFunction()} size="lg">
      <Modal.Content maxWidth="400">
        <Modal.CloseButton />
        <Modal.Header>Nhắc nhở</Modal.Header>
        <Modal.Body>
          {isCustom ? ( // Modal Custom
            <View style={styles.customModal}>
              {/* Header */}
              <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => clickBack()}>
                  <Icon name="angle-left" size={25} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.customHeaderText}>Nhắc nhở vào...</Text>
                <TouchableOpacity onPress={() => clickSet()}>
                  <Text style={styles.customText}>Đặt</Text>
                </TouchableOpacity>
              </View>
              {/* Input */}
              <View style={styles.customInput}>
                {/* Days */}
                <View style={styles.customInputItem}>
                  <ScrollPicker
                    dataSource={DaysRemind}
                    selectedIndex={findIndexDay(day)}
                    renderItem={(data, index) => {
                      return (
                        <View>
                          <Text>{data}</Text>
                        </View>
                      );
                    }}
                    onValueChange={(data, selectedIndex) => {
                      setDay(data);
                    }}
                    wrapperHeight={180}
                    wrapperWidth={150}
                    itemHeight={60}
                    highlightColor="#d8d8d8"
                    highlightBorderWidth={2}
                  />
                </View>

                {/* Hours */}
                <View style={styles.customInputItem}>
                  <ScrollPicker
                    dataSource={Hours}
                    selectedIndex={findIndexHour(hour)}
                    renderItem={(data, index) => {
                      return (
                        <View>
                          <Text>{data}</Text>
                        </View>
                      );
                    }}
                    onValueChange={(data, selectedIndex) => {
                      setHour(data);
                    }}
                    wrapperHeight={180}
                    wrapperWidth={150}
                    itemHeight={60}
                    highlightColor="#d8d8d8"
                    highlightBorderWidth={2}
                  />
                </View>

                {/* Dot */}
                <View style={styles.dotContainer}>
                  <Text style={styles.dotText}>:</Text>
                </View>

                {/* Minutes */}
                <View style={styles.customInputItem}>
                  <ScrollPicker
                    dataSource={Minutes}
                    selectedIndex={findIndexMinute(minute)}
                    renderItem={(data, index) => {
                      return (
                        <View>
                          <Text>{data}</Text>
                        </View>
                      );
                    }}
                    onValueChange={(data, selectedIndex) => {
                      setMinute(data);
                    }}
                    wrapperHeight={180}
                    wrapperWidth={150}
                    itemHeight={60}
                    highlightColor="#d8d8d8"
                    highlightBorderWidth={2}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View>
              <TouchableOpacity
                style={styles.sort}
                onPress={() => {
                  actionFunction(null);
                }}
              >
                <HStack
                  px={2}
                  py={2}
                  style={isSelected(null) && styles.selected}
                >
                  <Text
                    style={isSelected(null) ? styles.textSelected : styles.text}
                  >
                    Không
                  </Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sort}
                onPress={() => {
                  actionFunction(CommonData.RemindType().OnStartTime);
                }}
              >
                <HStack
                  px={2}
                  py={2}
                  style={
                    isSelected(CommonData.RemindType().OnStartTime) &&
                    styles.selected
                  }
                >
                  <Text
                    style={
                      isSelected(CommonData.RemindType().OnStartTime)
                        ? styles.textSelected
                        : styles.text
                    }
                  >
                    {CommonData.RemindType().OnStartTime}
                  </Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sort}
                onPress={() => {
                  actionFunction(CommonData.RemindType().OneDay);
                }}
              >
                <HStack
                  px={2}
                  py={2}
                  style={
                    isSelected(CommonData.RemindType().OneDay) &&
                    styles.selected
                  }
                >
                  <Text
                    style={
                      isSelected(CommonData.RemindType().OneDay)
                        ? styles.textSelected
                        : styles.text
                    }
                  >
                    {CommonData.RemindType().OneDay}
                  </Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sort}
                onPress={() => {
                  actionFunction(CommonData.RemindType().FiveMinutes);
                }}
              >
                <HStack
                  px={2}
                  py={2}
                  style={
                    isSelected(CommonData.RemindType().FiveMinutes) &&
                    styles.selected
                  }
                >
                  <Text
                    style={
                      isSelected(CommonData.RemindType().FiveMinutes)
                        ? styles.textSelected
                        : styles.text
                    }
                  >
                    {CommonData.RemindType().FiveMinutes}
                  </Text>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => clickCustom()}>
                <HStack px={2} py={2} style={styles.customContainer}>
                  <Text style={styles.text}>
                    {CommonData.RemindType().Custom}
                  </Text>
                  <Icon name="angle-right" size={25} />
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
  customText: {
    color: Color.Button().ButtonActive,
    fontWeight: "600",
    fontSize: 16,
  },
  icon: {
    color: Color.Button().ButtonActive,
  },
  dotContainer: {
    paddingTop: 80,
  },
  dotText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
