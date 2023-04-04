import { useState, useEffect } from "react";
import { Center, NativeBaseProvider } from "native-base";
import Spinner from "react-native-loading-spinner-overlay";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";
import CommonData from "../../CommonData/CommonData";
import Color from "../../Style/Color";
import { formatInTimeZone } from "date-fns-tz";
import { getListAllTasksByUserId } from "../../Reducers/TaskReducer";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default () => {
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.allTasks);
  const [isLoading, setIsLoading] = useState(false);

  // const [data, setData] = useState([
  //   {
  //     _id: 1,
  //     name: "Hom nay khong bao cao nha",
  //     startTime: "2023-04-01 00:00:00",
  //     dueTime: "2023-04-02 00:00:00",
  //     status: "New",
  //   },
  //   {
  //     _id: 2,
  //     name: "Lam giao dien phan dang ky",
  //     startTime: "2023-04-01 00:00:00",
  //     dueTime: "2023-04-01 00:00:00",
  //     status: "New",
  //   },
  //   {
  //     _id: 3,
  //     name: "Lam giao dien phan dang nhap",
  //     startTime: "2023-04-01 00:00:00",
  //     dueTime: "2023-04-05 00:00:00",
  //     status: "Done",
  //   },
  //   {
  //     _id: 4,
  //     name: "Lam giao dien list",
  //     startTime: "2023-04-01 00:00:00",
  //     dueTime: "2023-04-01 00:00:00",
  //     status: "New",
  //   },
  //   {
  //     _id: 5,
  //     name: "Lam giao dien detail",
  //     startTime: "2023-04-01 00:00:00",
  //     dueTime: "2023-04-01 00:00:00",
  //     status: "New",
  //   },
  // ]);
  const [items, setItems] = useState(null);

  // Load Data
  useEffect(() => {
    handleGetAllTasks();
  }, []);

  useEffect(() => {
    handleParseData();
  }, [allTasks]);

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getListAllTasksByUserId({ userId: decoded._id }, token));
    }
  };

  const getDates = (startDate, stopDate) => {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  };

  const convertListDateToString = (dates) => {
    let result = [];
    if (dates && dates.length > 0) {
      dates.forEach((x) => {
        let value = format(x, CommonData.Format().DateFormat);
        if (!result.includes(value)) {
          result.push(value);
        }
      });
    }
    if (result.length > 0) {
      result = result.sort();
    }

    return result;
  };

  const handleConvertDataToItemUi = (listDates) => {
    let resultArray = [];
    let resultObject = null;
    let data = [];
    if (allTasks && allTasks.length > 0) {
      data = allTasks.filter((x) => !x.isDeleted && !x.parentId);
    }

    if (listDates && listDates.length > 0) {
      listDates.forEach((x) => {
        let taskList = data.filter(
          (t) =>
            t.startTime &&
            t.dueTime &&
            compareDateBetweenTwoDate(
              x,
              t.startTime.split(" ").shift(),
              t.dueTime.split(" ").shift()
            )
        );

        if (taskList && taskList.length > 0) {
          let myObject = new Object();
          let listData = handleCustomTaskList(taskList);
          myObject[x] = [
            {
              taskCount: taskList.length,
              data: [...listData],
            },
          ];
          resultArray.push(myObject);
        }
      });
    }
    if (resultArray && resultArray.length > 0) {
      resultObject = Object.assign({}, ...resultArray);
    }

    return resultObject;
  };

  const handleParseData = () => {
    let data = [];
    if (allTasks && allTasks.length > 0) {
      data = allTasks.filter((x) => !x.isDeleted && !x.parentId);
    }
    if (data && data.length > 0) {
      let listDate = [];
      let listDateString = [];

      data.forEach((x) => {
        if (x.startTime && x.dueTime) {
          let startDate = new Date(Date.parse(x.startTime.split(" ").shift()));
          let dueTime = new Date(Date.parse(x.dueTime.split(" ").shift()));

          if (startDate == dueTime) {
            listDate.push(startDate);
          } else if (startDate < dueTime) {
            let dates = [];
            dates = getDates(startDate, dueTime);
            listDate.push(...dates);
          }
        }
      });

      if (listDate.length > 0) {
        listDateString = convertListDateToString(listDate);
        setItems(handleConvertDataToItemUi(listDateString));
      }
    }
  };

  const handleCustomTaskList = (listTasksByDate) => {
    let resultTask = [];
    if (listTasksByDate && listTasksByDate.length > 0) {
      if (listTasksByDate.length > 4) {
        let newArray = listTasksByDate.slice(0, 3);
        newArray.push({
          _id: 999,
          name: "+" + (listTasksByDate.length - 3),
          status: "New",
          isPlus: true,
        });
        resultTask = newArray;
      } else {
        resultTask = listTasksByDate;
      }
    }
    return resultTask;
  };

  const getCardStyle = (item) => {
    if (!item.isPlus) {
      if (item && item.Status == "Done") {
        return stylesStatus.cardDone;
      } else if (item && checkTaskIsLate(item)) {
        return stylesStatus.CardLate;
      }
      return styles.itemCard;
    }
    return styles.itemCardPlus;
  };

  const checkTaskIsLate = (task) => {
    if (task && task.startTime && task.dueTime) {
      let dateNowString = formatInTimeZone(
        new Date(),
        "Asia/Ho_Chi_Minh",
        "yyyy-MM-dd HH:mm:ss"
      );
      let startDate = new Date(Date.parse(task.startTime.split(" ").shift()));
      let dueTime = new Date(Date.parse(task.dueTime.split(" ").shift()));
      let dateNow = new Date(Date.parse(dateNowString.split(" ").shift()));

      if (dueTime < dateNow) {
        return true;
      }
    }
    return false;
  };

  function addHours(date, hours) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);

    return date;
  }

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

  const renderItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        {item.taskCount > 0 ? (
          item.data.map((x) => (
            <View style={getCardStyle(x)} key={x._id}>
              <Text style={styles.CardText}>{x.name}</Text>
            </View>
          ))
        ) : (
          <Text>{`🍪`}</Text>
        )}
      </View>
    );
  };

  const renderItemEmpty = () => {
    return (
      <View style={styles.itemContainerEmpty}>
        <Text>No Tasks</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Agenda
        items={items}
        renderItem={renderItem}
        renderEmptyData={renderItemEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  itemCard: {
    backgroundColor: Color.CalendarTask().Main,
    margin: 5,
    borderRadius: 15,
    padding: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  itemCardPlus: {
    backgroundColor: Color.CalendarTask().Main,
    margin: 5,
    borderRadius: 15,
    padding: 20,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  CardText: {
    color: Color.CalendarTask().Text,
    fontWeight: "400",
  },
  itemContainerEmpty: {
    backgroundColor: "white",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

const stylesStatus = StyleSheet.create({
  cardDone: {
    ...styles.itemCard,
    backgroundColor: Color.CalendarTask().Done,
  },
  CardLate: {
    ...styles.itemCard,
    backgroundColor: Color.CalendarTask().Late,
  },
});
