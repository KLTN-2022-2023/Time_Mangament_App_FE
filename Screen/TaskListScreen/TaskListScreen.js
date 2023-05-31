import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import TaskListComponent from "./TaskListComponent";
import { FloatingAction } from "react-native-floating-action";
import Color from "../../Style/Color";

export default ({ navigation }) => {
  const actions = [
    {
      text: "Thêm công việc mới",
      name: "Thêm công việc mới",
      position: 2,
      color: Color.Button().ButtonActive,
    },
    {
      text: "Thêm loại mới",
      name: "Thêm loại mới",
      position: 1,
      color: Color.Button().ButtonActive,
    },
  ];

  const doAction = (name) => {
    if (name === "Thêm công việc mới") {
      navigation.navigate("AddTaskScreen", { taskId: null });
    } else if (name === "Thêm loại mới") {
      navigation.navigate("AddTypeScreen", { typeId: null });
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3" backgroundColor={"#fff"}>
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
