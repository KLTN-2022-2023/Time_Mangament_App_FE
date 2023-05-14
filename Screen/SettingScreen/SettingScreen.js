import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import SettingComponent from "./SettingComponent";

export default ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <SettingComponent navigation={navigation} />
      </Center>
    </NativeBaseProvider>
  );
};
