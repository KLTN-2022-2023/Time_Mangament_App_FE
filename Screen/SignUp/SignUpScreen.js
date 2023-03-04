import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import SignUpComponent from "./SignUpComponent";

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <SignUpComponent />
      </Center>
    </NativeBaseProvider>
  );
};
