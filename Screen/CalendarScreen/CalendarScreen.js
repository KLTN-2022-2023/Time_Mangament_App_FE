import { useState, useEffect, useCallback } from "react";
import {
  CalendarProvider,
  ExpandableCalendar,
  AgendaList,
} from "react-native-calendars";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import isEmpty from "lodash/isEmpty";
import CommonData from "../../CommonData/CommonData";
import Color from "../../Style/Color";
import { getListAllTasksByUserId } from "../../Reducers/TaskReducer";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertDateTime } from "../../helper/Helper";
import { format } from "date-fns";

export default ({ route, navigation }) => {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const [weekTask, setWeekTask] = useState([]);
  const [dataMarked, setDataMarked] = useState({});

  const dateNowString = convertDateTime(new Date());

  // Load Data
  useEffect(() => {
    handleGetAllTasks();
    handleCalculateDayWeek(new Date());
    handleGetMarked();
  }, []);

  useEffect(() => {
    handleCalculateDayWeek(new Date());
    handleGetMarked();
  }, [allTasks]);

  useEffect(() => {
    handleGetAllTasks();
    handleCalculateDayWeek(new Date());
    handleGetMarked();
  }, [route?.params]);

  const getDates = (startDate, stopDate) => {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  };

  const handleGetMarked = () => {
    let result = new Object();
    let dates = [];

    allTasks.forEach((element) => {
      if (!element.isDeleted) {
        let start = convertDateTime(element.startTime).split(" ")[0];
        if (!dates.find((x) => x === start)) {
          dates.push(start);
        }

        let end = convertDateTime(element.dueTime).split(" ")[0];
        if (!dates.find((x) => x === end)) {
          dates.push(end);
        }

        let listDates = getDates(new Date(start), new Date(end));
        if (listDates.length > 0) {
          listDates.forEach((x) => {
            let d = convertDateTime(x).split(" ")[0];
            if (!dates.find((x) => x === d)) {
              dates.push(d);
            }
          });
        }
      }
    });

    if (dates.length > 0) {
      dates.forEach((x) => {
        result[x] = { marked: true };
      });

      setDataMarked(result);
    }
  };

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
  };

  const handleCalculateDayWeek = (date) => {
    let d = new Date(date);
    let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    let monday = new Date(d.setDate(diff));
    let list = [];

    for (let i = 0; i < 7; i++) {
      let d = new Date(monday.getTime());
      d.setDate(d.getDate() + i);

      list.push({
        title: convertDateTime(new Date(d)).split(" ")[0],
        data: [{}],
      });
    }

    if (list.length > 0 && list.length === 7) {
      list = handleAddEventForDay(list);
      setWeekTask(list);
    }
  };

  const handleAddEventForDay = (list) => {
    for (let item of list) {
      let tasks = allTasks.filter((x) => {
        let startString = convertDateTime(x.startTime);
        let dueString = convertDateTime(x.dueTime);

        return (
          startString.split(" ")[0] <= item.title && item.title <= dueString
        );
      });

      if (tasks.length > 0) {
        let result = tasks.map((x) => {
          let startString = convertDateTime(x.startTime);
          let dueString = convertDateTime(x.dueTime);
          let start = "";
          let end = "";

          if (startString.split(" ")[0] !== item.title) {
            start = "00:00";
          } else {
            start = startString.split(" ")[1];
          }

          if (dueString.split(" ")[0] !== item.title) {
            end = "23:59";
          } else {
            end = dueString.split(" ")[1];
          }

          return {
            id: x._id,
            name: x.name,
            start: start,
            end: end,
            status: x.status,
          };
        });

        result.sort((a, b) => (a.start > b.start ? 1 : -1));
        item.data = [...result];
      }
    }

    // Add dummy data
    for (let i = 0; i < list.length; i++) {
      if (i === 6) {
        list[i].data.push({ isDummy: true });
      }
    }

    return list;
  };

  const onDateChanged = useCallback((date, updateSource) => {
    handleCalculateDayWeek(new Date(date));
  }, []);

  const onMonthChange = useCallback(({ dateString }) => {
    console.log(dateString);
  }, []);

  const renderItem = (props) => {
    const { item } = props;

    if (isEmpty(item)) {
      return (
        <View style={styles.emptyData}>
          <Text style={styles.emptyDataText}>No events</Text>
        </View>
      );
    }

    return item.isDummy ? (
      <View
        style={{
          height: 500,
          borderTopColor: "#dee2e6",
          borderTopWidth: 1,
          marginTop: 10,
        }}
      ></View>
    ) : (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AddTaskScreen", {
            taskId: item.id,
            namePath: "Calendar",
          })
        }
      >
        <View style={styles.event}>
          <View style={styles.header}>
            {/* Time */}
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {item.start + " - " + item.end}
              </Text>
            </View>

            {/* Status */}
            <View
              style={
                item.status === CommonData.TaskStatus().Done
                  ? styles.statusContainerDone
                  : styles.statusContainerNew
              }
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <View>
            <Text style={styles.taskName}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (value) => {
    let newDateString = convertDateTime(new Date()).split(" ")[0];

    return (
      <View style={styles.section}>
        <Text
          style={
            newDateString === value
              ? styles.sectionTextToday
              : styles.sectionText
          }
        >
          {format(new Date(value), "EEEE") +
            ", " +
            format(new Date(value), "dd-MM-yyyy")}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CalendarProvider
        date={dateNowString.split(" ")[0]}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        showTodayButton
        todayBottomMargin={38}
        disabledOpacity={0.6}
      >
        <ExpandableCalendar firstDay={1} markedDates={dataMarked} />
        <AgendaList
          sections={weekTask}
          renderItem={renderItem}
          sectionStyle={styles.section}
          markToday={true}
          renderSectionHeader={renderSectionHeader}
          avoidDateUpdates={true}
        />
      </CalendarProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  section: {
    backgroundColor: "#ffffff",
    marginBottom: 4,
    padding: 10,
  },
  sectionText: {
    color: "#4dabf7",
    fontSize: 18,
  },
  sectionTextToday: {
    color: "#364fc7",
    fontWeight: "500",
    fontSize: 18,
  },
  emptyData: {
    padding: 20,
  },
  emptyDataText: {
    fontSize: 16,
    color: "#868e96",
  },
  event: {
    padding: 10,
    backgroundColor: "#e7f5ff",
    borderColor: "#dbe4ff",
    borderWidth: 2,
    marginBottom: 2,
  },
  timeContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  timeText: {
    fontSize: 16,
  },
  statusContainerDone: {
    padding: 5,
    backgroundColor: "#40c057",
    width: 50,
  },
  statusContainerNew: {
    padding: 5,
    backgroundColor: "#f59f00",
    width: 50,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskName: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "500",
  },
});
