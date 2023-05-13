import { View, Text, HStack, Modal } from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";
import MonthSelector from "react-native-month-selector";
import { useState } from "react";
import { MONTHS, YEARS } from "../../CommonData/Data";
import CommonData from "../../CommonData/CommonData";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { convertDateTime } from "../../helper/Helper";
import Color from "../../Style/Color";

export default ({ isOpen, actionFunction, closeFunction }) => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  useState(() => {
    setYear(convertDateTime(new Date()).split(" ")[0].split("-")[0]);
    setMonth(convertDateTime(new Date()).split(" ")[0].split("-")[1]);
  }, []);

  const findIndexMonth = (value) => {
    return MONTHS.findIndex((x) => x === value);
  };

  const findIndexYear = (value) => {
    return YEARS.findIndex((x) => x === value);
  };

  const clickSave = () => {
    actionFunction(month, year);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => closeFunction()} size="lg">
      <Modal.Content maxWidth="400">
        <Modal.CloseButton />
        <Modal.Header>{"Month selector"}</Modal.Header>
        <Modal.Body>
          <View style={styles.customModal}>
            {/* Header */}
            <View style={styles.customHeader}>
              <TouchableOpacity onPress={() => clickSave()}>
                <Text style={styles.customText}>Save</Text>
              </TouchableOpacity>
            </View>
            {/* Input */}
            <View style={styles.customInput}>
              {/* Months */}
              <View style={styles.customInputItem}>
                <ScrollPicker
                  dataSource={MONTHS}
                  selectedIndex={findIndexMonth(month)}
                  renderItem={(data, index) => {
                    return (
                      <View>
                        <Text>{data}</Text>
                      </View>
                    );
                  }}
                  onValueChange={(data, selectedIndex) => {
                    setMonth(data);
                  }}
                  wrapperHeight={180}
                  wrapperWidth={150}
                  itemHeight={60}
                  highlightColor="#d8d8d8"
                  highlightBorderWidth={2}
                />
              </View>

              {/* Year */}
              <View style={styles.customInputItem}>
                <ScrollPicker
                  dataSource={YEARS}
                  selectedIndex={findIndexYear(year)}
                  renderItem={(data, index) => {
                    return (
                      <View>
                        <Text>{data}</Text>
                      </View>
                    );
                  }}
                  onValueChange={(data, selectedIndex) => {
                    setYear(data);
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
    justifyContent: "flex-start",
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
