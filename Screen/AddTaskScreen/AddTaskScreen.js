import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import AddTaskComponent from "./AddTaskComponent";

export default ({ navigation, route }) => {
  const { taskId, selectedDate, isView } = route.params;
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" backgroundColor={"#fff"}>
        <AddTaskComponent
          navigation={navigation}
          taskId={taskId}
          selectedDate={selectedDate}
          isView={isView}
        />
      </Center>
    </NativeBaseProvider>
  );
};
