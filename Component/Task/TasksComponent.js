import Task from "./Task";
import { useState, useEffect } from "react";
import { SectionList, SafeAreaView, StyleSheet } from "react-native";
import { View, Text } from "native-base";
import CommonData from "../../CommonData/CommonData";

export default ({ navigation, listTasks, date }) => {
  const [tasks, setTasks] = useState([]);
  const [tasksImportant, setTasksImportant] = useState([]);

  useEffect(() => {
    handleSplitTasks();
  }, [listTasks, date]);

  const compareDateBetweenTwoDate = (date, date1, date2) => {
    if (date && date1 && date2) {
      let val1 = new Date(Date.parse(date1.split(" ").shift()));
      let val2 = new Date(Date.parse(date2.split(" ").shift()));
      let val = new Date(Date.parse(date.split(" ").shift()));
      if (val1 <= val && val <= val2) {
        return true;
      }
    }
    return false;
  };

  const handleFilterTasks = (list) => {
    if (date) {
      let result = list.filter(
        (t) =>
          t.startTime &&
          t.dueTime &&
          compareDateBetweenTwoDate(
            date,
            t.startTime.split(" ").shift(),
            t.dueTime.split(" ").shift()
          )
      );
      return result;
    }
    return list;
  };

  const handleSplitTasks = () => {
    if (listTasks && listTasks.length > 0) {
      let dataResult = handleFilterTasks(listTasks);
      setTasks(
        dataResult
          .filter((x) => x.status !== CommonData.TaskStatus().Done)
          .sort((x, y) =>
            x.isImportant === y.isImportant ? 0 : x.isImportant ? -1 : 1
          )
      );
      setTasksImportant(
        dataResult
          .filter((x) => x.status === CommonData.TaskStatus().Done)
          .sort((x, y) =>
            x.isImportant === y.isImportant ? 0 : x.isImportant ? -1 : 1
          )
      );
    }
  };

  return (
    <View style={styles.safe}>
      <SectionList
        sections={[
          { title: "Incomplete", data: [...tasks] },
          {
            title: "Completed",
            data: [...tasksImportant],
          },
        ]}
        renderItem={({ item }) => (
          <Task navigation={navigation} item={item}></Task>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={(item) => `basicListEntry-${item._id}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingBottom: 70,
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
