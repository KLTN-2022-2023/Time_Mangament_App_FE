import moment from 'moment';
import { Box, Button, Center, CheckIcon, HStack, NativeBaseProvider, ScrollView, Select, Text, VStack, View } from 'native-base';
import { memo, useEffect } from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import BarChart from 'react-native-bar-chart';
import PieChart from 'react-native-pie-chart';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllTask } from '../../Reducers/TaskReducer';
import jwt_decode from "jwt-decode";
import { reportMonth, reportYear } from '../../Reducers/ReportReducer';
import { getTypeWork } from '../../Reducers/TypeReducer';
import { TouchableOpacity } from 'react-native';

const StatictisComponent = ({ navigation }) => {
  const [dayStart, setDayStart] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [dayEnd, setDayEnd] = useState(moment(new Date()).format("YYYY-MM-DD"));

  const [color, setColor] = useState("#ffffff");
  const [selectMonth, setSelectMonth] = useState(moment(new Date()).format("YYYY-MM-DD").toString().substring(5, 7));
  const [selectPieMonth, setSelectPieMonth] = useState(false);
  const [labelDay, setLabelDay] = useState([]);
  const [countTask, setCountTask] = useState();
  const [completeTask, setCompleteTask] = useState();
  const [uncompleteTask, setUncompleteTask] = useState();
  const [pieChart, setPieChart] = useState(false);
  const [labelMonth, setLabelMonth] = useState([]);

  const [allYear, setAllYear] = useState([]);
  const [selectYear, setSelectYear] = useState(moment(new Date()).format("YYYY-MM-DD").toString().substring(0, 4));
  const [totalTaskYear, setTotalTaskYear] = useState();
  const [dataReportByYear, setDataReportByYear] = useState([]);
  const [tickYear, setTickYear] = useState([]);
  const [chartByYear, setChartByYear] = useState(false);
  const [chartByMonth, setChartByMonth] = useState(false);
  const [chartY, setChartY] = useState([]);
  const [barChart, setBarChart] = useState(false);
  const [countType, setCountType] = useState([]);
  const [nameType, setNameType] = useState([]);
  const [selectStatictis, setSelectStatistic] = useState();
  const [chart, setChart] = useState(false);
  const [chartMonth, setChartMonth] = useState(false);
  const [chartYear, setChartYear] = useState(false);
  const [pieMonth, setPieMonth] = useState(moment(new Date()).format("YYYY-MM-DD").toString().substring(5, 7));
  const [noJob, setNoJob] = useState(false);

  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      const result = await reportMonth({ userId: decoded._id, month: pieMonth }, token);
      const data = result.data;
      var complete = 0;
      var uncomplete = 0;
      data.forEach(element => {
        if (element.status === "New") {
          uncomplete++;
        }
        if (element.status === "Done") {
          complete++;
        }
      });
      if (complete === 0 || uncomplete === 0) {
        setUncompleteTask(1);
        setCompleteTask(1);
        setNoJob(true);
        setSelectPieMonth(false);
      }
      else if (complete !== 0 && uncomplete !== 0) {
        setUncompleteTask(uncomplete);
        setCompleteTask(complete);
        setSelectPieMonth(true);
        setNoJob(false);
      }
    }
  };

  const handleTypeWork = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      const response = await getTypeWork({ userId: decoded._id }, token);
      const type = response.data;
      var arrType = [];
      const a = moment(new Date()).format("YYYY-MM-DD").toString().substring(5, 7);
      const result = await reportMonth({ userId: decoded._id, month: a }, token);
      const data = result.data;
      var arrNameType = [];
      type.forEach(e => {
        arrType.push({ id: e._id });
        arrNameType.push(e.name);
      })
      setNameType(arrNameType);
      var totalType = 0;
      var abc = [];
      arrType.forEach(e => {
        data.forEach(i => {
          if (e.id === i.typeId) {
            totalType++;
          }

        })
        abc.push(totalType)
        totalType = 0;
      })
      setCountType(abc);
    }
  }
  const dropdownYear = () => {
    let thisYear = (new Date()).getFullYear();
    let allYears = [];
    for (let i = 0; i <= 10; i++) {
      const obj = { year: `${thisYear - i}` };
      allYears.push(obj)
    }
    setAllYear(allYears);
  }

  useEffect(() => {
    handleTypeWork();
  }, []);
  useEffect(() => {

    dropdownYear();
  }, []);

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

  const validateDay = () => {
    const endMonth = dayEnd.toString().substring(5, 7);
    const startMonth = dayStart.toString().substring(5, 7);
    const endDay = dayEnd.toString().substring(8, 10);
    const startDay = dayStart.toString().substring(8, 10);
    if (startMonth === endMonth || endDay > startDay || endDay === startDay) {
      setColor("#FFFFFF");
    }
    else if (startMonth < endMonth || startMonth > endMonth || endDay < startDay) {
      setColor("#FF0000");
    }
  }


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
    const data = [];
    for (let i = start; i <= end; i++) {
      data.push(i);
    }
    setLabelMonth(data);
  }

  const arrayMonth = [{ month: "01" }, { month: "02" }, { month: "03" }, { month: "04" }, { month: "05" }, { month: "06" }, { month: "07" }, { month: "08" }, { month: "09" }, { month: "10" }, { month: "11" }, { month: "12" }]
  const validateMonth = () => {
    if (selectMonth === "04" || selectMonth === "06" || selectMonth === "09" || selectMonth === "11") {
      setLabelDay(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'])
    }
    else if (selectMonth === "02") {
      setLabelDay(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'])
    }
    else if (selectMonth === "01" || selectMonth === "03" || selectMonth === "05" || selectMonth === "07" || selectMonth === "08" || selectMonth === "10" || selectMonth === "12") {
      setLabelDay(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'])
    }
  }
  useEffect(() => {
    validateMonth();
  }, [])

  const handleReportByMonth = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      const result = await reportMonth({ userId: decoded._id, month: selectMonth }, token);
      const dataByMonth = result.data;
      console.log(result)
      var totalNew = 0;
      var totalDone = 0;
      var totalY = 0;
      var arrTaskNew = [];
      var arrTaskDone = [];
      var arrY = [];
      let label;
      if (selectMonth === "04" || selectMonth === "06" || selectMonth === "09" || selectMonth === "11") {
        label = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
      }
      else if (selectMonth === "02") {
        label = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];
      }
      else if (selectMonth === "01" || selectMonth === "03" || selectMonth === "05" || selectMonth === "07" || selectMonth === "08" || selectMonth === "10" || selectMonth === "12") {
        label = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
      }

      label.forEach(i => {
        dataByMonth.forEach(e => {
          if (e.startTime.toString().substring(8, 10) === i && e.status === "New") {
            totalNew++;
          }
          if (e.startTime.toString().substring(8, 10) === i && e.status === "Done") {
            totalDone++;
          }
          if (e.startTime.toString().substring(8, 10)) {
            totalY++;
          }
        })

        arrY.push([totalNew, totalDone]);
        totalNew = 0;
        totalDone = 0;
        totalY = 0;

      })
      setChartY(arrY);
      console.log("arrayY", chartY)
      if (arrY) {
        // setDataTaskNew(arrTaskNew);
        // setDataTaskDone(arrTaskDone);
        setChartMonth(true);
      }
    }
  }
  useEffect(() => {
    handleReportByMonth();
  }, [])

  const hanldeReportByYear = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      const result = await reportYear({ userId: decoded._id, year: selectYear }, token);
      const data = result.data;
      var total = 0;
      var arrtotal = [];
      var arrYear = [];
      var a = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
      a.forEach(i => {
        data.forEach(e => {

          if (e.startTime.toString().substring(5, 7) === i) {
            total++;
          }
        })
        arrtotal.push(total);
        arrYear.push(total);
        total = 0;
      })
      setDataReportByYear(arrtotal);
      setTickYear(arrYear);

      if (arrtotal.length != 0 && selectYear != undefined) {
        setChartYear(true);
      }
    }
  }
  //   const token = await AsyncStorage.getItem("Token");
  //   if (token) {
  //     const decoded = jwt_decode(token);
  //     const response = await getTypeWork({ userId: decoded._id }, token);
  //     const data = response.data;
  //   }
  // };


  const widthAndHeight = 200;

  const xyz = () => {
    // validateMonth();
    if (selectStatictis === "typework") {
      setPieChart(false);
      setChartByMonth(false);
      setChartByYear(false);
      setBarChart(true);
      setChart(true);
    }
    else if (selectStatictis === "year") {
      setPieChart(false);
      setChartByMonth(false);
      setChartByYear(true);
      setBarChart(false);
      setChart(true);
    }
    else if (selectStatictis === "month") {
      setPieChart(false);
      setChartByMonth(true);
      setChartByYear(false);
      setBarChart(false);
      setChart(true);
    }
    else if (selectStatictis === "currentMonth") {
      setPieChart(true);
      setChartByMonth(false);
      setChartByYear(false);
      setBarChart(false);
      setChart(true);
    }
  }


  const horizontalData = ['Jan', 'Jeb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return (

    <NativeBaseProvider>
      <Center>
        <Box safeArea py="2" w="100%" maxW="350">
          <ScrollView width={350} >
            <Text fontSize={25} fontWeight={500} color={"#0000FF"}>Please choose type statictis</Text>
            <HStack w={"100%"}>
              <Select selectedValue={selectStatictis} minWidth="300" accessibilityLabel="Type statictis" placeholder="Type statictis" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setSelectStatistic(itemValue)} >
                <Select.Item label={"Statistic tasks global in the current month"} value={"currentMonth"} />
                <Select.Item label={"Statistic tasks by type work"} value={"typework"} />
                <Select.Item label={"Statictis tasks by year"} value={"year"} />
                <Select.Item label={"Statictis tasks by month"} value={"month"} />
              </Select>
              <Button onPress={xyz} marginTop={1} >OK</Button>
            </HStack>
            {chart ?
              <View>
                {pieChart ?
                  <View>
                    <Text fontSize={18} fontWeight={500} color={"#00BFFF"}>Statistics of jobs in the month current </Text>
                    <HStack paddingBottom={5}>
                      <Select selectedValue={pieMonth} minWidth="300" accessibilityLabel="Month" placeholder="Month" _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                      }} mt={1} onValueChange={itemValue => setPieMonth(itemValue)} >
                        {arrayMonth.map((e) => <Select.Item label={e.month} value={e.month} />)}
                      </Select>
                      <Button onPress={handleGetAllTasks} marginTop={1}>OK</Button>
                    </HStack>
                    {selectPieMonth ?
                      <View alignItems={"center"}>
                        <PieChart
                          widthAndHeight={widthAndHeight}
                          series={[uncompleteTask, completeTask]}
                          sliceColor={['#fbd203', '#ffb300']}
                        />
                        <TouchableOpacity>
                          <HStack>
                            <Button backgroundColor={"#fbd203"} disabled={true}></Button>
                            <Text paddingLeft={5}> {uncompleteTask} Task uncomplete</Text>
                          </HStack>
                          <HStack paddingTop={2}>
                            <Button backgroundColor={"#ffb300"} disabled={true}></Button>
                            <Text paddingLeft={5}>{completeTask} Task complete</Text>
                          </HStack>
                        </TouchableOpacity>
                      </View>
                      : null}
                    {noJob ? <TouchableOpacity >
                      <Text color={"#FF0000"} fontSize={15} paddingLeft={5}>There are no jobs created in the current month </Text>
                    </TouchableOpacity> : null}
                  </View>
                  : null
                }
                {barChart ?
                  <View>
                    <Text fontSize={18} fontWeight={500} color={"#00BFFF"}>Statictis task by type work in the month current</Text>
                    <ScrollView horizontal={true} >
                      <View width={350}>
                        <BarChart data={countType} horizontalData={nameType} />
                      </View>
                    </ScrollView>
                  </View>
                  : null}
                {chartByMonth ?
                  <View>
                    <Text fontSize={18} fontWeight={500} color={"#00BFFF"}> Statictis task by month in 2023</Text>
                    <HStack>
                      <Select selectedValue={selectMonth} minWidth="300" accessibilityLabel="Month" placeholder="Month" _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                      }} mt={1} onValueChange={itemValue => setSelectMonth(itemValue)} >
                        {arrayMonth.map((e) => <Select.Item label={e.month} value={e.month} />)}
                      </Select>
                      <Button onPress={handleReportByMonth} marginTop={1}>OK</Button>
                    </HStack>
                    {chartMonth ?
                      <View>
                        <ScrollView horizontal={true}>
                          <View width={1200} marginLeft={-50}>
                            <BarChart data={chartY} horizontalData={labelDay} />
                          </View>
                        </ScrollView>
                        <TouchableOpacity>
                          <HStack>
                            <Button backgroundColor={"#FFCC00"} disabled={true}></Button>
                            <Text paddingLeft={5}>Task uncomplete</Text>
                          </HStack>
                          <HStack paddingTop={2}>
                            <Button backgroundColor={"#FF0000"} disabled={true}></Button>
                            <Text paddingLeft={5}>Task complete</Text>
                          </HStack>
                        </TouchableOpacity>
                      </View>
                      : null}
                  </View>
                  : null
                }
                {chartByYear ?
                  <View>
                    <Text fontSize={20} fontWeight={500} color={"#00BFFF"}>Year Statictis </Text>
                    <HStack >
                      <Select selectedValue={selectYear} minWidth="300" accessibilityLabel="Year" placeholder="Year" _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />
                      }} mt={1} onValueChange={itemValue => setSelectYear(itemValue)} >
                        {allYear.map((e) => <Select.Item label={e.year} value={e.year} />)}
                      </Select>
                      <Button onPress={hanldeReportByYear} marginTop={1}>OK</Button>
                    </HStack>
                    {chartYear ?
                      <ScrollView horizontal={true}>
                        <View width={500}>
                          <BarChart data={dataReportByYear} horizontalData={horizontalData} />
                        </View>
                      </ScrollView>
                      : null
                    }
                  </View>
                  : null}
              </View>
              : null
            }

          </ScrollView>
        </Box>
      </Center>
    </NativeBaseProvider>

  )
}
export default memo(StatictisComponent);