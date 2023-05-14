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
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { StyleSheet } from "react-native";

export default ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validatePhone, setValidatePhone] = useState(false);
  const [validatePassword, setValidatePassword] = useState(false);
  const [textPassword, setTextPassword] = useState("Password is not empty");
  const [textError, setTextError] = useState(false);

  const Login = async () => {
    setIsLoading(true);

    try {
      // const value = await HandleLogin({
      //   email,
      //   password,
      // });
      const value =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDBkMWUzOTA0NTVmZWIwMWNiZjhmNTAiLCJwaG9uZSI6IjA3OTQ0NDMyNDUiLCJpYXQiOjE2ODM5NDQ5NDcsImV4cCI6MTY4NDMxMjE0N30.dDJzue68KqKBxl1bxX2MkMnsqka5HQQZ7ZecpUEpbPY";

      if (value) {
        await AsyncStorage.setItem("Token", value);
        navigation.navigate("HomeTab");
      } else {
        if (validatePhone || validatePassword) {
          setTextError(false);
        } else {
          setTextError(true);
        }
      }
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

  const validateNumberPhone = (phone) => {
    var re = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    return re.test(phone);
  };
  const validatePass = (password) => {
    var re = /^[0-9]{6}\b/g;
    //var re = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    return re.test(password);
  };
  const validate = () => {
    if (!validateNumberPhone(phone)) {
      setValidatePhone(true);
    } else {
      setValidatePhone(false);
    }
    if (!validatePass(password)) {
      setValidatePassword(true);
    } else {
      setValidatePassword(false);
    }
  };
  useEffect(() => {
    validate();
  }, [phone, password]);
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
            <FormControl.Label>Number Phone</FormControl.Label>
            <Input
              value={phone || ""}
              onChange={(text) => setPhone(text.nativeEvent.text)}
            />
            {validatePhone && <Text color={"#FF0000"}>Phone is not empty</Text>}
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              value={password || ""}
              type="password"
              onChange={(text) => setPassword(text.nativeEvent.text)}
            />
            {validatePassword && <Text color={"#FF0000"}>{textPassword}</Text>}
            {textError && (
              <Text color={"#FF0000"}>Phone or password is incorrect</Text>
            )}
            <Link
              _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500",
              }}
              alignSelf="flex-end"
              mt="1"
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
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
