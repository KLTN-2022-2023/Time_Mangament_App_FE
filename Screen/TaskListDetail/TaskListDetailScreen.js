import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import TaskListDetailComponent from "./TaskListDetailComponent";

export default ({ route, navigation }) => {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <TaskListDetailComponent navigation={navigation} route={route} />
      </Center>
    </NativeBaseProvider>
  );
};
