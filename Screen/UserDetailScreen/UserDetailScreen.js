import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import UserDetailComponent from "./UserDetailComponent";

export default ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" backgroundColor={"#fff"}>
        <UserDetailComponent navigation={navigation} />
      </Center>
    </NativeBaseProvider>
  );
};
