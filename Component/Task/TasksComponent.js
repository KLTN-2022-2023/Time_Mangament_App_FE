import Task from "./Task";
import { useState, useEffect } from "react";
import { SectionList, SafeAreaView, StyleSheet } from "react-native";
import { View, Text } from "native-base";
import CommonData from "../../CommonData/CommonData";
import NoData from "../Common/NoData";
import { formatInTimeZone } from "date-fns-tz";
import { convertDateTime } from "../../helper/Helper";

export default ({ navigation, listTasks, date, typeId, filter }) => {
  const [tasks, setTasks] = useState([]);
  const [tasksImportant, setTasksImportant] = useState([]);

  useEffect(() => {
    handleSplitTasks();
  }, [listTasks, date, typeId, filter]);

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
    // Split by date
    if (date) {
      let result = list.filter((t) => {
        let startTimeString = convertDateTime(t.startTime);
        let dueTimeString = convertDateTime(t.dueTime);

        return (
          t.startTime &&
          t.dueTime &&
          compareDateBetweenTwoDate(
            date,
            startTimeString.split(" ").shift(),
            dueTimeString.split(" ").shift()
          )
        );
      });
      return result;
    }

    // Split by type
    if (typeId) {
      if (typeId === CommonData.TaskType().AllTask) {
        return list;
      }

      if (typeId === CommonData.TaskType().Completed) {
        return list.filter((t) => t.status === CommonData.TaskStatus().Done);
      }

      if (typeId === CommonData.TaskType().InComplete) {
        return list.filter((t) => t.status === CommonData.TaskStatus().New);
      }

      if (typeId === CommonData.TaskType().Important) {
        return list.filter((t) => t.isImportant);
      }

      let result = list.filter((t) => t.typeId === typeId);
      return result;
    }

    return list;
  };

  const handleSplitTasks = () => {
    if (listTasks && listTasks.length > 0) {
      let dataResult = handleFilterTasks(listTasks);
      let dataFilter = dataResult.filter(
        (x) => x.status !== CommonData.TaskStatus().Done
      );
      let dataImportantFilter = dataResult.filter(
        (x) => x.status === CommonData.TaskStatus().Done
      );
      let dataFilterCon = [];
      let dataImportantFilterCon = [];

      if (filter) {
        // Is Important
        if (filter.name == "Is Important") {
          if (filter.asc) {
            dataFilterCon = dataFilter.sort((x, y) =>
              x.isImportant === y.isImportant ? 0 : y.isImportant ? -1 : 1
            );
            dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
              x.isImportant === y.isImportant ? 0 : y.isImportant ? -1 : 1
            );
          } else {
            dataFilterCon = dataFilter.sort((x, y) =>
              x.isImportant === y.isImportant ? 0 : x.isImportant ? -1 : 1
            );
            dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
              x.isImportant === y.isImportant ? 0 : x.isImportant ? -1 : 1
            );
          }
        }
        // Due Date
        else if (filter.name == "Due Date") {
          if (filter.asc) {
            dataFilterCon = dataFilter.sort((x, y) =>
              compareString(x.dueTime, y.dueTime)
            );
            dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
              compareString(x.dueTime, y.dueTime)
            );
          } else {
            dataFilterCon = dataFilter.sort((x, y) =>
              compareString(y.dueTime, x.dueTime)
            );
            dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
              compareString(y.dueTime, x.dueTime)
            );
          }
        }
        // Alphabetically
        else if (filter.name == "Alphabetically") {
          if (filter.asc) {
            dataFilterCon = dataFilter.sort((x, y) =>
              compareString(x.name.toUpperCase(), y.name.toUpperCase())
            );
            dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
              compareString(x.name.toUpperCase(), y.name.toUpperCase())
            );
          } else {
            dataFilterCon = dataFilter.sort((x, y) =>
              compareString(y.name.toUpperCase(), x.name.toUpperCase())
            );
            dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
              compareString(y.name.toUpperCase(), x.name.toUpperCase())
            );
          }
        }
        // Created Date
        else if (filter.name == "Created Date") {
          if (filter.asc) {
            dataFilterCon = dataFilter.sort((x, y) =>
              compareString(x.createdDate, y.createdDate)
            );
            dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
              compareString(x.createdDate, y.createdDate)
            );
          } else {
            dataFilterCon = dataFilter.sort((x, y) =>
              compareString(y.createdDate, x.createdDate)
            );
            dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
              compareString(y.createdDate, x.createdDate)
            );
          }
        }
      } else {
        dataFilterCon = dataFilter.sort((x, y) =>
          x.isImportant === y.isImportant ? 0 : x.isImportant ? -1 : 1
        );
        dataImportantFilterCon = dataImportantFilter.sort((x, y) =>
          x.isImportant === y.isImportant ? 0 : x.isImportant ? -1 : 1
        );
      }

      setTasks(dataFilterCon);
      setTasksImportant(dataImportantFilterCon);
    }
  };

  function compareString(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  return (
    <View style={styles.safe}>
      {(tasks && tasks.length > 0) ||
      (tasksImportant && tasksImportant.length > 0) ? (
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
      ) : (
        <NoData></NoData>
      )}
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
