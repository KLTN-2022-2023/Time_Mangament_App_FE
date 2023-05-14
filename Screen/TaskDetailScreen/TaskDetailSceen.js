import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import TaskDetailComponent from "./TaskDetailComponent";

export default ({ navigation }) => {
    return (
      <NativeBaseProvider>
        <Center flex={1} px="3">
          <TaskDetailComponent navigation={navigation} />
        </Center>
      </NativeBaseProvider>
    );
  };