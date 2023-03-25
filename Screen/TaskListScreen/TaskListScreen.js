import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import TaskListComponent from "./TaskListComponent";

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <TaskListComponent />
      </Center>
    </NativeBaseProvider>
  );
};
