import { Box, Center, View, Text } from "native-base";
import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, SectionList } from "react-native";
import IconICon from "react-native-vector-icons/Ionicons";
import React from "react";
import Color from "../../Style/Color";
import { useSelector, useDispatch } from "react-redux";
import { convertDateTime, formatDateUI } from "../../helper/Helper";
import TaskView from "./TaskView";
import NoData from "../../Component/Common/NoData";
import TypeModal from "../../Component/Task/TypeModal";

export default ({ route, navigation }) => {
  const { year, month, type } = route.params;
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const allTypes = useSelector((state) => state.type.allTypes);

  const [tasks, setTasks] = useState([]);
  const [taskType, setTaskType] = useState();
  const [modalType, setModalType] = useState(false);

  useEffect(() => {
    if (month && year) {
      let tasksFilter = [];
      if (type && allTypes && allTypes.length > 0) {
        setTaskType(allTypes[0]);

        tasksFilter = allTasks.filter(
          (x) =>
            convertDateTime(x.startTime).split(" ")[0].split("-")[1] ===
              month &&
            convertDateTime(x.startTime).split(" ")[0].split("-")[0] === year &&
            x.typeId === allTypes[0]._id
        );
      } else {
        tasksFilter = allTasks.filter(
          (x) =>
            convertDateTime(x.startTime).split(" ")[0].split("-")[1] ===
              month &&
            convertDateTime(x.startTime).split(" ")[0].split("-")[0] === year
        );
      }
      setTasks(tasksFilter);
    }
  }, []);

  useEffect(() => {
    if (month && year && type) {
      let tasksFilter = [];
      if (taskType) {
        tasksFilter = allTasks.filter(
          (x) =>
            convertDateTime(x.startTime).split(" ")[0].split("-")[1] ===
              month &&
            convertDateTime(x.startTime).split(" ")[0].split("-")[0] === year &&
            x.typeId === taskType._id
        );
      }
      setTasks(tasksFilter);
    }
  }, [taskType]);

  const onlyUnique = (value, index, array) => {
    return array.indexOf(value) === index;
  };

  // Modal Type
  const handleCloseType = () => {
    setModalType(false);
  };

  const handleChooseType = (value) => {
    setTaskType(value);
    setModalType(false);
  };

  const getSection = () => {
    let dates = tasks.map((x) => convertDateTime(x.startTime).split(" ")[0]);
    let unique = dates.filter(onlyUnique).sort();
    let sections = unique.map((x) => {
      return {
        title: formatDateUI(x),
        data: tasks.filter(
          (y) => convertDateTime(y.startTime).split(" ")[0] === x
        ),
      };
    });
    return sections;
  };

  return (
    <Center w="100%" height="100%">
      <Box safeArea py="2" px="3" width="100%" height="100%">
        {/* Header */}
        <View style={styles.header}>
          <IconICon
            size={25}
            name="arrow-back"
            color={Color.Header().Main}
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{"Tháng " + month + ", " + year}</Text>

        {type && allTypes && allTypes.length > 0 && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setModalType(true);
              }}
            >
              <View
                style={{
                  padding: 10,
                  borderColor: Color.Button().ButtonActive,
                  borderWidth: 1,
                  borderRadius: 5,
                  minWidth: 80,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: Color.Button().ButtonActive,
                  }}
                >
                  {taskType && taskType.name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        <TypeModal
          isOpen={modalType}
          closeFunction={handleCloseType}
          actionFunction={handleChooseType}
          selected={taskType}
        />

        {/* Task */}
        {tasks && tasks.length > 0 ? (
          <SectionList
            sections={getSection()}
            renderItem={({ item }) => (
              <TaskView navigation={navigation} item={item}></TaskView>
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            keyExtractor={(item) => `basicListEntry-${item._id}`}
          />
        ) : (
          <NoData></NoData>
        )}
      </Box>
    </Center>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    paddingTop: 30,
    paddingBottom: 15,
    fontSize: 20,
    fontWeight: "bold",
    color: Color.Header().Main,
  },
  button: {
    borderRadius: 30,
    position: "absolute",
    bottom: 25,
    right: 0,
    backgroundColor: Color.Button().ButtonActive,
  },
  buttonText: {
    color: Color.Button().Text,
  },
  sort: {
    paddingBottom: 20,
  },
  iconModal: {
    marginTop: 3,
  },
  filterContainer: {
    display: "flex",
    flexDirection: "row",
    paddingBottom: 10,
    gap: 5,
  },
  sortFilterContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  monthFilterText: {
    color: Color.Button().ButtonActive,
    fontSize: 16,
    fontWeight: "500",
  },
  monthFilter: {
    borderColor: Color.Button().ButtonActive,
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  weekContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  sectionHeader: {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    fontSize: 15,
    fontWeight: "bold",
  },
});
