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
import Spinner from "react-native-loading-spinner-overlay";
import { StyleSheet } from "react-native";

export default ({ navigation }) => {
  const [email, setEmail] = useState("h2212000@gmail.com");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);

  const Login = async () => {
    setIsLoading(true);

    try {
      // const value = await HandleLogin({
      //   email,
      //   password,
      // });
      const value =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDBkMWUzOTA0NTVmZWIwMWNiZjhmNTAiLCJlbWFpbCI6ImgyMjEyMDAwQGdtYWlsLmNvbSIsImlhdCI6MTY4MjY3MTc0NywiZXhwIjoxNjgzMDM4OTQ3fQ.KoGcLzoS7gyZ8m6ROfbXckkmY0es7Sf017fob1oid3Q";

      if (value) {
        await AsyncStorage.setItem("Token", value);
        navigation.navigate("HomeTab");
      }
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

  return (
    <Center w="100%">
      <Spinner visible={isLoading}></Spinner>
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

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
