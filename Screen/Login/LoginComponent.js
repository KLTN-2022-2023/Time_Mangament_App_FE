import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
} from "native-base";
import { HandleLogin } from "../../Reducers/UserReducer";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default ({ navigation }) => {
  const [email, setEmail] = useState("buithanhnam000@gmail.com");
  const [password, setPassword] = useState("123456");

  const Login = async () => {
    try {
      const value = await HandleLogin({
        email,
        password,
      });

      if (value) {
        await AsyncStorage.setItem("Token", value);
        navigation.navigate("UserDetailScreen");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Welcome
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email ID</FormControl.Label>
            <Input
              value={email || ""}
              onChange={(text) => setEmail(text.nativeEvent.text)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              value={password || ""}
              type="password"
              onChange={(text) => setPassword(text.nativeEvent.text)}
            />
            <Link
              _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500",
              }}
              alignSelf="flex-end"
              mt="1"
            >
              Forgot Password?
            </Link>
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={Login}>
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              I'm a new user.{" "}
            </Text>
            <Link
              _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};
