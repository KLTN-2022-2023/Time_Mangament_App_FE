import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import UserDetailComponent from "./UserDetailComponent";

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <UserDetailComponent />
      </Center>
    </NativeBaseProvider>
  );
};
