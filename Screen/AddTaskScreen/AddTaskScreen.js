import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import AddTaskComponent from "./AddTaskComponent";

export default ({ navigation, route }) => {
  const { taskId } = route.params;
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <AddTaskComponent navigation={navigation} taskId={taskId} />
      </Center>
    </NativeBaseProvider>
  );
};
