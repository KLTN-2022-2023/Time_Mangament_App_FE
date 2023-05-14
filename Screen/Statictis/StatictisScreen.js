import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import StatictisComponent from "./StatictisComponent";

export default ({ navigation }) => {
    return (
      <NativeBaseProvider>
        <Center flex={1} px="3">
          <StatictisComponent navigation={navigation} />
        </Center>
      </NativeBaseProvider>
    );
  };