import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import Store from "./Store/Store";
import { StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Color from "./Style/Color";
import LoginScreen from "./Screen/Login/LoginScreen";
import SignUpScreen from "./Screen/SignUp/SignUpScreen";
import UserDetailScreen from "./Screen/UserDetailScreen/UserDetailScreen";
import TaskListScreen from "./Screen/TaskListScreen/TaskListScreen";
import CalendarScreen from "./Screen/CalendarScreen/CalendarScreen";
import TaskListDetailScreen from "./Screen/TaskListDetail/TaskListDetailScreen";
import AddTaskScreen from "./Screen/AddTaskScreen/AddTaskScreen";
import AddTypeScreen from "./Screen/AddTypeScreen/AddTypeScreen";
import SettingScreen from "./Screen/SettingScreen/SettingScreen";
import StatictisScreen from "./Screen/Statictis/StatictisScreen";
import ForgotPasswordScreen from "./Screen/ForgotPasswordScreen/ForgotPasswordScreen";
import StatisticDetailScreen from "./Screen/StatisticDetail/StatisticDetailScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useRef } from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Calendar") {
            iconName = focused ? "ios-calendar" : "ios-calendar-outline";
          } else if (route.name === "Tasks") {
            iconName = focused ? "ios-albums" : "ios-albums-outline";
          } else if (route.name === "Statistics") {
            iconName = focused ? "ios-stats-chart" : "ios-stats-chart-outline";
          } else if (route.name === "Notifications") {
            iconName = focused
              ? "ios-notifications"
              : "ios-notifications-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "ios-settings" : "ios-settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: () => {
          return null;
        },
        tabBarActiveTintColor: Color.Button().ButtonActive,
        tabBarInactiveTintColor: Color.Button().ButtonInActive,
        headerStyle: {
          backgroundColor: Color.Header().Main,
        },
        headerTintColor: Color.Header().Text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: "Lịch" }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskListScreen}
        options={{ title: "Danh sách công việc" }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatictisScreen}
        options={{ title: "Thống kê" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{ title: "Cài đặt" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  // read notifications after 3 minutes
  useEffect(() => {}, []);

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "flip",
          }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Statictis" component={StatictisScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="HomeTab" component={HomeTab} />
          <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            name="TaskListDetail"
            component={TaskListDetailScreen}
          />
          <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
          <Stack.Screen name="AddTypeScreen" component={AddTypeScreen} />
          <Stack.Screen
            name="StatisticDetail"
            component={StatisticDetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
