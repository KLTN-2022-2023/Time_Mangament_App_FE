import moment from 'moment';
import { Box, Button, Center, CheckIcon, HStack, NativeBaseProvider, Radio, ScrollView, Select, Text, VStack, View } from 'native-base';
import { memo, useEffect } from 'react';
import { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllTask } from '../../Reducers/TaskReducer';
import jwt_decode from "jwt-decode";
import { reportDate } from '../../Reducers/ReportReducer';

const StatictisComponent = ({ navigation }) => {
  const [dayStart, setDayStart] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [dayEnd, setDayEnd] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [selectDateStart, setSelectDateStart] = useState(new Date());
  const [selectDateEnd, setSelectDateEnd] = useState(new Date());
  const [calendarStart, setCalendarStart] = useState(false);
  const [calendarEnd, setCalendarEnd] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [selectMonth, setSelectMonth] = useState("");
  const [radioValue, setRadioValue] = useState("All");
  const [labelDay, setLabelDay] = useState([]);
  const [countTask, setCountTask] = useState();
  const [completeTask, setCompleteTask] = useState();
  const [uncompleteTask, setUncompleteTask] = useState();
  const [month, setMonth] = useState();
  const [labelMonth, setLabelMonth] = useState([]);
  const [dataLabel, setDataLabel] = useState([]);
  const [data, setData] = useState([]);
  const [allYear, setAllYear] = useState([]);
  const [selectYear, setSelectYear] = useState();
  const [totalTaskYear, setTotalTaskYear] = useState();


  const hideDatePicker = () => {
    setCalendarStart(false);
    setCalendarEnd(false);
  };
  const confirmDayStart = (date) => {
    setDayStart(moment(date).format("YYYY-MM-DD"));
    setSelectDateStart(date);
    hideDatePicker();
  }

  const confirmDayEnd = (date) => {
    setDayEnd(moment(date).format("YYYY-MM-DD"));
    setSelectDateEnd(date)
    hideDatePicker();
  }

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      const result = await getAllTask({ userId: decoded._id }, token);
      const data = result.data;
      var countComplete = 0;
      var countUncomplete = 0;
      const a = [];
      data.forEach(element => {

        if (element.status === "New") {
          countUncomplete++;
        }
        if (element.status === "Done") {
          countComplete++;
        }
      });
      console.log(a);
      setUncompleteTask(countUncomplete);
      setCompleteTask(countComplete);
    }
  };
  const dropdownYear = () => {
    let thisYear = (new Date()).getFullYear();
    let allYears = [];
    for (let i = 0; i <= 10; i++) {
      allYears.push(thisYear - i)
    }
    setAllYear(allYears);

  }

  useEffect(() => {
    handleGetAllTasks();

  }, [selectMonth]);
  useEffect(() => {
    dropdownYear()
  }, [])

  const totalTaskByYear = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      const result = await getAllTask({ userId: decoded._id }, token);
      const data = result.data;
      var total = 0;
      data.forEach(element => {
        if (element.startTime.toString().substring(0, 4) === selectYear.toString()) {
          total++;
        }
      })
      setTotalTaskYear(total);
    }
  }
  useEffect(() => {
    totalTaskByYear();
  }, [selectYear]);
  const validateDay = () => {
    const end = dayEnd.toString().substring(5, 7);
    const start = dayStart.toString().substring(5, 7);
    if (end === start) {
      setColor("#FFFFFF")
    }
    else {
      setColor("#FF0000")
    }
  }

  useEffect(() => {
    validateDay();
    validateMonth();
    handleDay();
  }, [selectMonth, dayEnd, dayStart]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 10,
    },
    header: {
      textAlign: 'center',
      fontSize: 18,
      padding: 16,
      marginTop: 16,
    },
  });

  const handleDay = () => {
    const start = dayStart.toString().substring(8, 10);
    const end = dayEnd.toString().substring(8, 10);
    console.log(start, end);
    const data = [];
    for (let i = start; i <= end; i++) {
      data.push(i);
    }
    setLabelMonth(data);
  }

  const dataMonth = [20, 30, 25, 11, 23, 55, 36, 14, 25, 13, 15, 53];
  const arrayMonth = [{ month: "01" }, { month: "02" }, { month: "03" }, { month: "04" }, { month: "05" }, { month: "06" }, { month: "07" }, { month: "08" }, { month: "09" }, { month: "10" }, { month: "11" }, { month: "12" }]
  const validateMonth = () => {
    if (selectMonth === "04" || selectMonth === "06" || selectMonth === "09" || selectMonth === "11") {
      setLabelDay(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'])
    }
    else if (selectMonth === "2") {
      setLabelDay(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'])
    }
    else if (selectMonth === "01" || selectMonth === "03" || selectMonth === "05" || selectMonth === "07" || selectMonth === "08" || selectMonth === "10" || selectMonth === "12") {
      setLabelDay(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'])
    }
  }
  const handleReportByDate = async () => {
    const token = await AsyncStorage.getItem("Token");

    if (token) {
      const decoded = jwt_decode(token);
      const result = await reportDate({
        userId: decoded._id, startDate: new Date(dayStart), endDate: new Date(dayEnd)
      }, token)
      // const data = result.data;
      const data = result.data;
      var total = 0;
      let arrTotal = [];
      var start = dayStart.toString().substring(8, 10);
      var end = dayEnd.toString().substring(8, 10);
      var arrDay = [];
      for (let i = start; i <= end; i++) {
        arrDay.push(i);
      }
      console.log(arrDay)
      data.forEach(e => {
        // console.log("StartTime", e.startTime.toString().substring(8, 10));
        // console.log("DayStart", dayStart.substring(8, 10));
        arrDay.forEach(i => {
          if (Number(e.startTime.toString().substring(8, 10)) === i) {
            total++;

          }
          else {
            total = 0;
          }
          //  console.log(i)
          arrTotal.push(total);
        })
      })
      setData(arrTotal);
      //   console.log(arrTotal)
      //  console.log(data)
      // console.log(decoded._id)
      // console.log(dayStart)
      // console.log(dayEnd)
      // console.log("resul", result.data)
    }
  }
  useEffect(() => {
    handleReportByDate();
  }, [dayStart, dayEnd])
  return (

    <NativeBaseProvider>
      <Center>
        <Box safeArea p="2" py="2" w="100%" maxW="350">
          <ScrollView>
            <View paddingTop={10}>

              <Text fontSize={18} fontWeight={500} color={"#00BFFF"}>Statistics of jobs in the current month</Text>
              <View>
                <PieChart
                  data={[
                    {
                      name: 'Uncomplete',
                      population: 215,
                      color: 'rgba(131, 167, 234, 1)',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 12,
                    },
                    {
                      name: 'Complete',
                      population: 28,
                      color: '#F00',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 12,
                    },

                  ]}
                  width={Dimensions.get('window').width - 16}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute //for the absolute number remove if you want percentage
                />
              </View>
            </View>
            <View paddingTop={5}>
              <Text fontSize={18} fontWeight={500} color={"#00BFFF"}>Job statistics by selected date</Text>
              <HStack justifyContent={"space-between"} paddingTop={5} paddingBottom={5}>
                <Button width={130} onPress={() => setCalendarStart(true)}><Text fontWeight={500} color={color} >{moment(dayStart).format("YYYY-MM-DD").toString()}</Text></Button>
                <Button width={130} onPress={() => setCalendarEnd(true)}><Text fontWeight={500} color={color}>{moment(dayEnd).format("YYYY-MM-DD").toString()}</Text></Button>
              </HStack>
              <DateTimePickerModal
                isVisible={calendarStart}
                mode="date"
                onConfirm={confirmDayStart}
                onCancel={hideDatePicker}
              />
              <DateTimePickerModal
                isVisible={calendarEnd}
                mode="date"
                onConfirm={confirmDayEnd}
                onCancel={hideDatePicker}
              />
              <ScrollView horizontal={true}>
                <BarChart
                  data={{
                    labels: labelMonth,
                    datasets: [
                      {
                        data: data
                      },
                    ],
                  }}
                  width={Dimensions.get('window').width + 300}
                  height={250}
                  yAxisLabel={'Tasks: '}
                  chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </ScrollView>
            </View>
            <View>
              <Text fontSize={20} fontWeight={500} color={"#00BFFF"}> Monthly Statictis</Text>
              <Select selectedValue={selectMonth} minWidth="200" accessibilityLabel="Month" placeholder="Month" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setSelectMonth(itemValue)} >
                {arrayMonth.map((e) => <Select.Item key={e} label={e.month} value={e.month} />)}
              </Select>
              <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={radioValue} onChange={nextValue => {
                setRadioValue(nextValue);
              }}>
                <Radio value="All" my={1}>All</Radio>
                <Radio value="Complete" my={1}>Complete</Radio>
                <Radio value="Uncomplete" my={1}>Uncomplete</Radio>
              </Radio.Group>
              <ScrollView horizontal={true}>
                <BarChart data={{
                  labels: labelDay,
                  datasets: [
                    {
                      data: [20, 45, 28, 80, 99, 43, 7, 9, 41, 23, 6, 42, 5, 6, 8, 6, 7, 21, 32, 14, 2, 19, 36, 2, 3, 4, 6, 9, 5, 6, 3],
                    },
                  ],
                }}
                  width={Dimensions.get('window').width + 900}
                  height={250}
                  yAxisLabel={'Tasks: '}
                  chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </ScrollView>
            </View>
            <View>
              <Text fontSize={20} fontWeight={500} color={"#00BFFF"}>Year Statictis </Text>
              <Select selectedValue={selectYear} minWidth="200" accessibilityLabel="Year" placeholder="Year" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setSelectYear(itemValue)} >
                {allYear.map((e) => <Select.Item key={e} label={e} value={e} />)}
              </Select>
              <Text fontWeight={500} fontSize={18}>Total number of tasks in the year is<Text color={"#FF0000"}> {totalTaskYear}</Text></Text>
            </View>
          </ScrollView>
        </Box>
      </Center>
    </NativeBaseProvider>

  )
}
export default memo(StatictisComponent);