import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import LoginComponent from "./LoginComponent";

export default ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" backgroundColor={"#fff"}>
        <LoginComponent navigation={navigation} />
      </Center>
    </NativeBaseProvider>
  );
};
