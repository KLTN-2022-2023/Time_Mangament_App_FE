import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import Store from "./Store/Store";
import LoginScreen from "./Screen/Login/LoginScreen";
import SignUpScreen from "./Screen/SignUp/SignUpScreen";
import UserDetailScreen from "./Screen/UserDetailScreen/UserDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
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
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
