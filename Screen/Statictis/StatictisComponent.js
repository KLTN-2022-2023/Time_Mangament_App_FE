import moment from "moment";
import {
  Box,
  Button,
  Center,
  CheckIcon,
  Checkbox,
  HStack,
  NativeBaseProvider,
  ScrollView,
  Select,
  Text,
  VStack,
  View,
} from "native-base";
import { memo, useEffect } from "react";
import { useState } from "react";
import { SectionList, StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import BarChart from "react-native-bar-chart";
import PieChart from "react-native-pie-chart";
import Color from "../../Style/Color";
import { convertDateTime } from "../../helper/Helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllTask } from "../../Reducers/TaskReducer";
import jwt_decode from "jwt-decode";
import { reportMonth, reportYear } from "../../Reducers/ReportReducer";
import { getTypeWork } from "../../Reducers/TypeReducer";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Task from "../../Component/Task/Task";

const StatictisComponent = ({ navigation, abc }) => {
  const [selectMonth, setSelectMonth] = useState(
    moment(new Date()).format("YYYY-MM-DD").toString().substring(5, 7)
  );
  const [selectPieMonth, setSelectPieMonth] = useState(false);
  const [labelDay, setLabelDay] = useState([]);
  const [completeTask, setCompleteTask] = useState();
  const [uncompleteTask, setUncompleteTask] = useState();
  const [pieChart, setPieChart] = useState(false);
  const [allYear, setAllYear] = useState([]);
  const [selectYear, setSelectYear] = useState(
    moment(new Date()).format("YYYY-MM-DD").toString().substring(0, 4)
  );
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
  const [pieMonth, setPieMonth] = useState(
    moment(new Date()).format("YYYY-MM-DD").toString().substring(5, 7)
  );
  const [pieYear, setPieYear] = useState(
    moment(new Date()).format("YYYY-MM-DD").toString().substring(0, 4)
  );
  const [typeMonth, setTypeMonth] = useState(
    moment(new Date()).format("YYYY-MM-DD").toString().substring(5, 7)
  );
  const [typeYear, setTypeYear] = useState(
    moment(new Date()).format("YYYY-MM-DD").toString().substring(0, 4)
  );

  const [noJob, setNoJob] = useState(false);
  const [yearByMonth, setYearByMonth] = useState(
    moment(new Date()).format("YYYY-MM-DD").toString().substring(0, 4)
  );
  const horizontalData = [
    "Jan",
    "Jeb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const arrayMonth = [
    { month: "01" },
    { month: "02" },
    { month: "03" },
    { month: "04" },
    { month: "05" },
    { month: "06" },
    { month: "07" },
    { month: "08" },
    { month: "09" },
    { month: "10" },
    { month: "11" },
    { month: "12" },
  ];
  const widthAndHeight = 200;
  const [isLoading, setIsLoading] = useState(false);
  const [detailType, setDetailType] = useState([]);
  const [detailMonth, setDetailMonth] = useState([]);
  const [detailYear, setDetailYear] = useState([]);
  const [detailModalType, setDetailModalType] = useState(false);
  const [detailModalMonth, setDetailModalMonth] = useState(false);
  const [detailTypeComplete, setDetailTypeComplete] = useState([]);
  const [detailTypeUncomplete, setDetailTypeUncomplete] = useState([]);
  const [detailMonthComplete, setDetailMonthComplete] = useState([]);
  const [detailMonthUncomplete, setDetailMonthUncomplete] = useState([]);
  const [mainChart, setMainChart] = useState(true);


  const handleGetAllTasks = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      setIsLoading(true);
      const decoded = jwt_decode(token);
      const result = await reportMonth(
        { userId: decoded._id, month: pieMonth, year: pieYear },
        token
      );
      const data = result.data;
      var complete = 0;
      var uncomplete = 0;
      data.forEach((element) => {
        if (element.status === "New") {
          uncomplete++;
        }
        if (element.status === "Done") {
          complete++;
        }
      });
      if (complete === 0 && uncomplete === 0) {
        setUncompleteTask(1);
        setCompleteTask(1);
        setNoJob(true);
        setSelectPieMonth(false);
      } else if (complete !== 0 || uncomplete !== 0) {
        setUncompleteTask(uncomplete);
        setCompleteTask(complete);
        setSelectPieMonth(true);
        setNoJob(false);
      }
      setIsLoading(false);
    }
  };

  const handleTypeWork = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      setIsLoading(true);
      const decoded = jwt_decode(token);
      const response = await getTypeWork({ userId: decoded._id }, token);
      const type = response.data;
      var arrType = [];
      const result = await reportMonth(
        { userId: decoded._id, month: typeMonth, year: typeYear },
        token
      );
      const data = result.data;
      setDetailType(data);
      var a = [];
      var b = [];
      data.forEach((e) => {
        if (e.status === "New") {
          a.push(e);
        }
        else {
          b.push(e);
        }
      })
      setDetailTypeComplete(b);
      setDetailTypeUncomplete(a);
      var arrNameType = [];
      type.forEach((e) => {
        arrType.push({ id: e._id });
        arrNameType.push(e.name);
      });
      setNameType(arrNameType);
      var totalType = 0;
      var abc = [];
      arrType.forEach((e) => {
        data.forEach((i) => {
          if (e.id === i.typeId) {
            totalType++;
          }
        });
        abc.push(totalType);
        totalType = 0;
      });
      setCountType(abc);
      setIsLoading(false);
    }
  };
  const dropdownYear = () => {
    let thisYear = new Date().getFullYear();
    let allYears = [];
    for (let i = 0; i <= 10; i++) {
      const obj = { year: `${thisYear - i}` };
      allYears.push(obj);
    }
    setAllYear(allYears);
  };

  useEffect(() => {
    handleTypeWork();
  }, []);
  useEffect(() => {
    dropdownYear();
  }, []);

  const styles = StyleSheet.create({
    root: {
      borderColor: "#DDDDDD",
      justifyContent: "space-between",
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 10,
      padding: 10,
    },
    nameTask: {
      fontSize: 15,
    },
    nameTaskDone: {
      fontSize: 15,
    },
    checkbox: {
      marginTop: 5,
    },

    container: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: 10,
    },
    header: {
      textAlign: "center",
      fontSize: 18,
      padding: 16,
      marginTop: 16,
    },
    iconStarCheck: {
      marginTop: 5,
      color: Color.Button().ButtonActive,
    },
    iconStarUnCheck: {
      marginTop: 5,
    },
  });

  const validateMonth = () => {
    setChartMonth(false);
    if (
      selectMonth === "04" ||
      selectMonth === "06" ||
      selectMonth === "09" ||
      selectMonth === "11"
    ) {
      setLabelDay([
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
      ]);
    } else if (selectMonth === "02") {
      setLabelDay([
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
      ]);
    } else if (
      selectMonth === "01" ||
      selectMonth === "03" ||
      selectMonth === "05" ||
      selectMonth === "07" ||
      selectMonth === "08" ||
      selectMonth === "10" ||
      selectMonth === "12"
    ) {
      setLabelDay([
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ]);
    }
  };

  useEffect(() => {
    validateMonth();
  }, [selectMonth]);

  const handleReportByMonth = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      setIsLoading(true);
      const decoded = jwt_decode(token);
      const result = await reportMonth(
        { userId: decoded._id, month: selectMonth, year: yearByMonth },
        token
      );
      const dataByMonth = result.data;
      var totalNew = 0;
      var totalDone = 0;
      var arrY = [];
      var monthComplete = [];
      var monthUncomplete = [];
      dataByMonth.forEach((e) => {
        if (e.status === "New") {
          monthUncomplete.push(e);
        }
        else {
          monthComplete.push(e)
        }
      })
      setDetailMonthComplete(monthComplete);
      setDetailMonthUncomplete(monthUncomplete);
      var label;
      if (
        selectMonth === "04" ||
        selectMonth === "06" ||
        selectMonth === "09" ||
        selectMonth === "11"
      ) {
        label = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
        ];
      } else if (selectMonth === "02") {
        label = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
        ];
      } else if (
        selectMonth === "01" ||
        selectMonth === "03" ||
        selectMonth === "05" ||
        selectMonth === "07" ||
        selectMonth === "08" ||
        selectMonth === "10" ||
        selectMonth === "12"
      ) {
        label = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
        ];
      }
      if (dataByMonth.length > 0) {
        label.forEach((i) => {
          dataByMonth.forEach((e) => {
            if (e) {
              if (
                convertDateTime(e.startTime).substring(8, 10) === i &&
                e.status === "New"
              ) {
                totalNew++;
              }
              if (
                convertDateTime(e.startTime).substring(8, 10) === i &&
                e.status === "Done"
              ) {
                totalDone++;
              }
            } else {
              console.log("cmn");
            }
          });

          arrY.push([totalNew, totalDone]);
          totalNew = 0;
          totalDone = 0;
        });
        console.log(arrY);
        setChartY(arrY);
        console.log("chartY", chartY);
        if (chartY) {
          setChartMonth(true);
        } else {
          setChartMonth(false);
        }
      } else {
        // setChartMonth(false);
        label.forEach((i) => {
          dataByMonth.forEach((e) => { });
          arrY.push([totalNew, totalDone]);
        });
        console.log(arrY);
        console.log(chartY);
        setChartY(arrY);
        console.log(chartY);
        if (chartY.length > 0) {
          setChartMonth(true);
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleReportByMonth();
  }, []);

  const hanldeReportByYear = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      setIsLoading(true);
      const decoded = jwt_decode(token);
      const result = await reportYear(
        { userId: decoded._id, year: selectYear },
        token
      );
      const data = result.data;
      var total = 0;
      var arrtotal = [];
      var arrYear = [];
      var a = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      a.forEach((i) => {
        data.forEach((e) => {
          if (e.startTime.toString().substring(5, 7) === i) {
            total++;
          }
        });
        arrtotal.push(total);
        arrYear.push(total);
        total = 0;
      });
      setDataReportByYear(arrtotal);
      setTickYear(arrYear);

      if (arrtotal.length != 0 && selectYear != undefined) {
        setChartYear(true);
      }
    }
    setIsLoading(false);
  };

  const xyz = () => {
    if (selectStatictis === "typework") {
      setPieChart(false);
      setChartByMonth(false);
      setChartByYear(false);
      setBarChart(true);
      setChart(true);
    } else if (selectStatictis === "year") {
      setPieChart(false);
      setChartByMonth(false);
      setChartByYear(true);
      setBarChart(false);
      setChart(true);
    } else if (selectStatictis === "month") {
      setPieChart(false);
      setChartByMonth(true);
      setChartByYear(false);
      setBarChart(false);
      setChart(true);
    } else if (selectStatictis === "currentMonth") {
      setPieChart(true);
      setChartByMonth(false);
      setChartByYear(false);
      setBarChart(false);
      setChart(true);
    }
  };

  const getSection = () => {
    return [
      {
        title: "Uncomplete",
        data: [...detailTypeUncomplete],
      },
      {
        title: "Complete",
        data: [...detailTypeComplete]
      }
    ]
  }
  const getSectionMonth = () => {
    return [
      {
        title: "Uncomplete",
        data: [...detailMonthUncomplete],
      },
      {
        title: "Complete",
        data: [...detailMonthComplete]
      }
    ]
  }
  return (
    <NativeBaseProvider>
      <Center>
        {/* <Spinner visible={isLoading}></Spinner> */}
        <Box safeArea py="2" w="100%" maxW="350">
          <ScrollView width={350}>
            {mainChart ?
              <View>
                <HStack w={"100%"}>
                  <Select
                    selectedValue={selectStatictis}
                    minWidth="260"
                    accessibilityLabel="Chọn loại thống kê"
                    placeholder="Chọn loại thống kê"
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    mt={1}
                    onValueChange={(itemValue) => setSelectStatistic(itemValue)}
                  >
                    <Select.Item
                      label={"Thống kê công việc tổng quát"}
                      value={"currentMonth"}
                    />
                    <Select.Item
                      label={"Thống kê công việc theo loại"}
                      value={"typework"}
                    />
                    <Select.Item label={"Thống kê công việc theo năm"} value={"year"} />
                    <Select.Item
                      label={"Thống kê công việc theo tháng"}
                      value={"month"}
                    />
                  </Select>
                  <Button marginLeft={2} onPress={xyz} marginTop={1}>
                    Xác nhận
                  </Button>
                </HStack>
                {chart ? (
                  <View>
                    {pieChart ? (
                      <View >
                        <Text textAlign={"center"} paddingTop={5} fontSize={18} fontWeight={500} color={"#00BFFF"}>
                          Thống kê công việc tổng quát{" "}
                        </Text>
                        <HStack
                          alignItems={"center"}
                          paddingBottom={5}
                          justifyContent={"space-between"}
                        >
                          <Text fontWeight={500}>Tháng</Text>
                          <Select
                            selectedValue={pieMonth}
                            minWidth="90"
                            accessibilityLabel="Month"
                            placeholder="Month"
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setPieMonth(itemValue)}
                          >
                            {arrayMonth.map((e) => (
                              <Select.Item label={e.month} value={e.month} />
                            ))}
                          </Select>
                          <Text fontWeight={500}>Năm</Text>
                          <Select
                            selectedValue={pieYear}
                            minWidth="90"
                            accessibilityLabel="Year"
                            placeholder="Year"
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setPieYear(itemValue)}
                          >
                            {allYear.map((e) => (
                              <Select.Item label={e.year} value={e.year} />
                            ))}
                          </Select>
                          <Button onPress={handleGetAllTasks} marginTop={1}>
                            Xác nhận
                          </Button>
                        </HStack>
                        {selectPieMonth ? (
                          <View alignItems={"center"}>
                            <PieChart
                              widthAndHeight={widthAndHeight}
                              series={[uncompleteTask, completeTask]}
                              sliceColor={["#FFCC00", "#FF0000"]}
                            />
                            <TouchableOpacity>
                              <HStack>
                                <Button
                                  backgroundColor={"#FFCC00"}
                                  disabled={true}
                                ></Button>
                                <Text paddingLeft={5}>
                                  {uncompleteTask} Công việc chưa hoàn thành
                                </Text>
                              </HStack>
                              <HStack paddingTop={2}>
                                <Button
                                  backgroundColor={"#FF0000"}
                                  disabled={true}
                                ></Button>
                                <Text paddingLeft={5}>
                                  {completeTask} Công việc hoàn thành
                                </Text>
                              </HStack>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                        {noJob ? (
                          <TouchableOpacity>
                            <Text color={"#FF0000"} fontSize={15} paddingLeft={5}>
                              Không có công việc nào được thực hiện trong tháng này{" "}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ) : null}
                    {barChart ? (
                      <View>
                        <Text
                          textAlign={"center"}
                          alignItems={"center"}
                          paddingTop={5}
                          fontSize={18}
                          fontWeight={500}
                          color={"#00BFFF"}

                        >
                          Thống kê công việc theo loại công việc
                        </Text>
                        <HStack
                          alignItems={"center"}
                          paddingBottom={5}
                          justifyContent={"space-between"}
                        >
                          <Text fontWeight={500}>Tháng</Text>
                          <Select
                            selectedValue={typeMonth}
                            minWidth="90"
                            accessibilityLabel="Month"
                            placeholder="Month"
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setTypeMonth(itemValue)}
                          >
                            {arrayMonth.map((e) => (
                              <Select.Item label={e.month} value={e.month} />
                            ))}
                          </Select>
                          <Text fontWeight={500}>Năm</Text>
                          <Select
                            selectedValue={typeYear}
                            minWidth="90"
                            accessibilityLabel="Năm"
                            placeholder="Năm"
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setTypeYear(itemValue)}
                          >
                            {allYear.map((e) => (
                              <Select.Item label={e.year} value={e.year} />
                            ))}
                          </Select>
                          <Button onPress={handleTypeWork} marginTop={1} marginLeft={1}>
                            Xác nhận
                          </Button>
                        </HStack>
                        {/* <Button onPress={() => { setMainChart(false), setDetailModalType(true) }}>Xem chi tiết thống kê</Button> */}
                        <ScrollView horizontal={true}>
                          <View width={350}>
                            <BarChart
                              data={countType}
                              horizontalData={nameType}
                              labelColor="#000000"
                            />
                          </View>
                        </ScrollView>
                      </View>
                    ) : null}
                    {chartByMonth ? (
                      <View>
                        <Text textAlign={"center"} paddingTop={5} fontSize={18} fontWeight={500} color={"#00BFFF"}>
                          {" "}
                          Thống kê công việc theo tháng
                        </Text>
                        <HStack
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Text fontWeight={500}>Tháng</Text>
                          <Select
                            selectedValue={selectMonth}
                            minWidth="90"
                            accessibilityLabel="Tháng"
                            placeholder="Tháng"
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setSelectMonth(itemValue)}
                          >
                            {arrayMonth.map((e) => (
                              <Select.Item label={e.month} value={e.month} />
                            ))}
                          </Select>
                          <Text fontWeight={500}>Năm</Text>
                          <Select
                            selectedValue={yearByMonth}
                            minWidth="90"
                            accessibilityLabel="Năm"
                            placeholder="Năm"
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setYearByMonth(itemValue)}
                          >
                            {allYear.map((e) => (
                              <Select.Item label={e.year} value={e.year} />
                            ))}
                          </Select>
                          <Button onPress={handleReportByMonth} marginTop={1}>
                            Xác nhận
                          </Button>
                        </HStack>
                        {/* <Button onPress={() => { setMainChart(false), setDetailModalMonth(true) }}>Xem chi tiết thống kê</Button> */}
                        {chartMonth ? (
                          <View>
                            <ScrollView horizontal={true}>
                              <View width={1200} marginLeft={-50}>
                                <BarChart
                                  data={chartY}
                                  horizontalData={labelDay}
                                  labelColor="#000000"
                                />
                              </View>
                            </ScrollView>
                            <TouchableOpacity>
                              <HStack>
                                <Button
                                  backgroundColor={"#FFCC00"}
                                  disabled={true}
                                ></Button>
                                <Text paddingLeft={5}>Công việc chưa hoàn thành</Text>
                              </HStack>
                              <HStack paddingTop={2}>
                                <Button
                                  backgroundColor={"#FF0000"}
                                  disabled={true}
                                ></Button>
                                <Text paddingLeft={5}>Công việc hoàn thành</Text>
                              </HStack>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </View>
                    ) : null}
                    {chartByYear ? (
                      <View>
                        <Text textAlign={"center"} paddingTop={5} fontSize={20} fontWeight={500} color={"#00BFFF"}>
                          Thống kê công việc theo năm{" "}
                        </Text>
                        <HStack>
                          <Select
                            selectedValue={selectYear}
                            minWidth="260"
                            accessibilityLabel="Năm"
                            placeholder="Năm"
                            _selectedItem={{
                              bg: "teal.600",
                              endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(itemValue) => setSelectYear(itemValue)}
                          >
                            {allYear.map((e) => (
                              <Select.Item label={e.year} value={e.year} />
                            ))}
                          </Select>
                          <Button
                            onPress={hanldeReportByYear}
                            marginLeft={2}
                            marginTop={1}
                          >
                            Xác nhận
                          </Button>
                        </HStack>
                        {chartYear ? (
                          <ScrollView horizontal={true}>
                            <View width={500}>
                              <BarChart
                                data={dataReportByYear}
                                horizontalData={horizontalData}
                                labelColor="#000000"
                              />
                            </View>
                          </ScrollView>
                        ) : null}
                      </View>
                    ) : null}
                  </View>

                ) : <View></View>}
              </View> : <View></View>
            }

            {detailModalMonth ?
              <View>
                <Icon size={20} name="arrow-left" onPress={() => { setDetailModalMonth(false), setMainChart(true) }} />
                <Text fontSize={20} fontWeight={800}>Thống kê chi tiết theo tháng</Text>
                <SectionList
                  sections={getSectionMonth()}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item }) => (
                    <Task navigation={navigation} item={item} />
                  )}
                  renderSectionHeader={({ section }) => (
                    <Text fontSize={15} fontWeight={600}>{section.title}</Text>
                  )}
                />
              </View>
              : <View></View>}
            {detailModalType ?
              <View>
                <Icon size={20} name="arrow-left" onPress={() => { setDetailModalType(false), setMainChart(true) }} />
                <Text fontSize={20} fontWeight={800}>Thống kê chi tiết theo loại công việc</Text>
                <SectionList
                  sections={getSection()}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item }) => (
                    <Task navigation={navigation} item={item} />
                  )}
                  renderSectionHeader={({ section }) => (
                    <Text fontSize={15} fontWeight={600}>{section.title}</Text>
                  )}
                />
              </View>
              : <View></View>}
          </ScrollView>
        </Box>
      </Center>
    </NativeBaseProvider >
  );
};
export default memo(StatictisComponent);
