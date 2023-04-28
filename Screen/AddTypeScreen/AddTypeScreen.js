import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import AddTypeComponent from "./AddTypeComponent";

export default ({ route, navigation }) => {
  const { typeId } = route.params;
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <AddTypeComponent navigation={navigation} typeId={typeId} />
      </Center>
    </NativeBaseProvider>
  );
};
