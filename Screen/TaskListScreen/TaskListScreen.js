import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import TaskListComponent from "./TaskListComponent";

export default ({ navigation }) => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <TaskListComponent navigation={navigation} />
      </Center>
    </NativeBaseProvider>
  );
};
