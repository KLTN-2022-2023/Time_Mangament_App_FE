import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import SignUpComponent from "./SignUpComponent";

export default ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" backgroundColor={"#fff"}>
        <SignUpComponent navigation={navigation} />
      </Center>
    </NativeBaseProvider>
  );
};
