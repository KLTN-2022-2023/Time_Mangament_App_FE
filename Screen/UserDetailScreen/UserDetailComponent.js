import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  HStack,
  Text,
  Link,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { getUserById } from "../../Reducers/UserReducer";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";

export default () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // useEffect(() => {
  //   HandleGetInfoUser();
  // }, []);

  const HandleGetInfoUser = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getUserById({ userId: decoded._id }, token));
    }
  };

  return (
    <Center w="100%">
      <Box safeArea w="100%" maxW="290">
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          fontWeight="medium"
          size="xs"
        >
          {user.email}
        </Heading>
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          fontWeight="medium"
          size="xs"
        >
          {user.age}
        </Heading>
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          fontWeight="medium"
          size="xs"
        >
          {user.address}
        </Heading>
      </Box>
    </Center>
  );
};
