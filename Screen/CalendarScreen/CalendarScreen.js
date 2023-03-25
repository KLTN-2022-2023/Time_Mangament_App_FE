import { useState, useEffect } from "react";
import { Center, NativeBaseProvider } from "native-base";
import CalendarListComponent from "./CalendarListComponent";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { addDays, format } from "date-fns";
import CommonData from "../../CommonData/CommonData";
import Color from "../../Style/Color";

export default () => {
  const [data, setData] = useState([
    {
      _id: 1,
      name: "Hom nay khong bao cao nha",
      startTime: "2023-03-28",
      dueTime: "2023-03-29",
      status: "New",
    },
    {
      _id: 2,
      name: "Lam giao dien phan dang ky",
      startTime: "2023-03-25",
      dueTime: "2023-04-01",
      status: "New",
    },
    {
      _id: 3,
      name: "Lam giao dien phan dang nhap",
      startTime: "2023-03-25",
      dueTime: "2023-03-25",
      status: "Done",
    },
  ]);
  const [items, setItems] = useState({
    "2023-03-25": [
      {
        taskCount: 1,
        data: [
          {
            id: 5,
            name: "Bao cao hang nam nha",
            isShow: true,
            Status: "New",
          },
        ],
      },
    ],
    "2023-03-27": [
      {
        taskCount: 2,
        data: [
          {
            id: 1,
            name: "Bao cao hang tuan nha",
            isShow: true,
            Status: "Done",
          },
          {
            id: 2,
            name: "Bao cao hang thang nha",
            isShow: true,
            Status: "New",
          },
          {
            id: 4,
            name: "+2",
            isShow: false,
            Status: "",
          },
        ],
      },
    ],
    "2023-03-30": [
      {
        taskCount: 1,
        data: [
          {
            id: 3,
            name: "Bao cao hang nam nha",
            isShow: true,
            Status: "Late",
          },
        ],
      },
    ],
  });

  // Load Data
  useEffect(() => {
    handleParseData();
  }, []);

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
        result.push(format(x, CommonData.Format().DateFormat));
      });
    }
    return result;
  };

  const handleParseData = () => {
    if (data && data.length > 0) {
      let listDate = [];
      let listDateString = [];

      data.forEach((x) => {
        if (x.startTime && x.dueTime) {
          let startDate = new Date(Date.parse(x.startTime));
          let dueTime = new Date(Date.parse(x.dueTime));

          if (startDate == dueTime) {
            listDate.push(startDate);
          } else if (startDate < dueTime) {
            let dates = [];
            dates = getDates(startDate, dueTime);
            console.log(dates);
            listDate.push(...dates);
          }
        }
      });

      if (listDate.length > 0) {
        listDateString = convertListDateToString(listDate);
        console.log(listDateString.length, listDateString);
      }
    }
  };

  const getCardStyle = (item) => {
    if (item.isShow) {
      if (item && item.Status == "Done") {
        return stylesStatus.cardDone;
      } else if (item && item.Status == "Late") {
        return stylesStatus.CardLate;
      }
      return styles.itemCard;
    }
    return styles.itemCardPlus;
  };

  const renderItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        {item.taskCount > 0 ? (
          item.data.map((x) => (
            <View style={getCardStyle(x)} key={x.id}>
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
