import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import TaskListComponent from "./TaskListComponent";
import { FloatingAction } from "react-native-floating-action";
import Color from "../../Style/Color";

export default ({ navigation }) => {
  const actions = [
    {
      text: "Create New Task",
      name: "Create New Task",
      position: 2,
      color: Color.Button().ButtonActive,
    },
    {
      text: "Create New Type",
      name: "Create New Type",
      position: 1,
      color: Color.Button().ButtonActive,
    },
  ];

  const doAction = (name) => {
    if (name === "Create New Task") {
      navigation.navigate("AddTaskScreen", { taskId: null });
    } else if (name === "Create New Type") {
      navigation.navigate("AddTypeScreen", { typeId: null });
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <TaskListComponent navigation={navigation} />
      </Center>
      <FloatingAction
        distanceToEdge={{ vertical: 10, horizontal: 17 }}
        actions={actions}
        onPressItem={(name) => {
          doAction(name);
        }}
        color={Color.Button().ButtonActive}
      />
    </NativeBaseProvider>
  );
};
