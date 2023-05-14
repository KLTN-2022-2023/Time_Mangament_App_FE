import * as React from "react";
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
import { useState, useEffect } from "react";
import { TextInput, StyleSheet, ScrollView } from "react-native";
import { signUp, verifyAccount } from "../../Reducers/UserReducer";
import SnackBar from "../../Component/Snackbar/Snackbar";
import e from "cors";


export default ({ navigation }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [modalOTP, setModalOTP] = useState(true);
  const [disableButton, setDissableButton] = useState(true);
  const [colorButton, setColorButton] = useState("#C0C0C0");
  const [validateName, setValidateName] = useState(false);
  const [validateEmail, setValidateEmail] = useState(false);
  const [validateNumberPhone, setValidateNumberPhone] = useState(false);
  const [validateConfirmPassword, setValidateConfirmPassword] = useState(false);
  const [textConfirmPassword, setTextConfirmPassword] = useState("Confirm password is not empty");
  const [validatePass, setValidatePass] = useState(false);
  //const [validateConfirmPass, setValidateConfirmPass] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [snackBarVerify, setSnackBarVerify] = useState(false);
  const [textPhone, setTextPhone] = useState("Number phone is invalid");

  const [otp, setOtp] = useState();

  const handleSignUp = async () => {
    // validate();
    if (confirmPassword === password) {


      const result = await signUp({ name: name, email: email, phone: phone, password: password });
      console.log(result)
      if (result) {
        if (result.msg === "Phone already exist") {
          setValidateNumberPhone(true);
          setTextPhone("Phone allready exist");
          setModalOTP(true);
        }
        else if (result.msg === " Successfully") {
          setValidateNumberPhone(false);
          setModalOTP(false);
        }
      }
    } else {
      setValidateConfirmPassword(true)
      setTextConfirmPassword("Confirm password incorrect")
    }
  }

  const handleVerify = async () => {
    const result = await verifyAccount({ otp: otp });
    if (result) {
      setSnackBarVerify(true)
      setTimeout(() => {
        navigation.navigate("LoginScreen");
      }, 2000);
    }
  }
  useEffect(() => {
    setValidateConfirmPassword(false);
  }, [confirmPassword])
  const validateMail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  const validatePhone = (phone) => {
    var re = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    return re.test(phone)
  }
  const valName = (name) => {
    var re = /^[a-zA-Z]{1}+[a-z]*$/;
    return re.test(name);
  }
  const valPassword = (password) => {
    var re = /^[0-9]{6}\b/g;
    return re.test(password)
  }
  const valConfirmPassword = (confirmPassword) => {
    var re = /^[0-9]{6}\b/g;
    return re.test(confirmPassword)
  }
  const abc = () => {


    if (!validatePass && !validateConfirmPassword && !validateNumberPhone && !validateName && !validateEmail) {
      setDissableButton(false);
      setColorButton("#0000EE");
    }
    else {
      console.log("a")
      setDissableButton(true);
      setColorButton("#C0C0C0");
    }
  }
  useEffect(() => {
    validate();
    abc();
  }, [name, email, password, phone, confirmPassword]);
  const validate = () => {
    if (!valName(name)) {
      setValidateName(true)
    }
    else {
      setValidateName(false);
    }
    if (!validateMail(email)) {
      setValidateEmail(true)
    }
    else {
      setValidateEmail(false)
    }
    if (!validatePhone(phone)) {
      setValidateNumberPhone(true);
    }
    else {
      setValidateNumberPhone(false);
    }
    if (!valPassword(password)) {
      setValidatePass(true);
    }
    else {
      setValidatePass(false);
    }
    if (!valConfirmPassword(confirmPassword)) {
      setValidateConfirmPassword(true);
    }
    else {
      setValidateConfirmPassword(false);
    }
    // if (confirmPassword === password && confirmPassword) {
    //   setValidateConfirmPassword(false);
    // }
    // else {
    //   setTextConfirmPassword("Confirm password is incorrect");
    //   setValidateConfirmPassword(true);
    // }

  }
  return (
    <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <ScrollView>
          <Heading
            size="lg"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
            fontWeight="semibold"
          >
            Welcome
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
            Sign up to continue!
          </Heading>
          {modalOTP ?
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <Input value={name} onChangeText={e => setName(e)} />
                {validateName && (
                  <Text color={"#FF0000"}> Name is not empty </Text>
                )}
              </FormControl>

              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input value={email} onChangeText={e => setEmail(e)} />
                {validateEmail && (
                  <Text color={"#FF0000"}>Email is invalid</Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Phone</FormControl.Label>
                <Input value={phone} onChangeText={e => setPhone(e)} />
                {validateNumberPhone && (
                  <Text color={"#FF0000"}>{textPhone}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Input value={password} secureTextEntry={true} onChangeText={e => setPassword(e)} />
                {validatePass && (
                  <Text color={"#FF0000"}>Password is invalid</Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Confirm password</FormControl.Label>
                <Input value={confirmPassword} secureTextEntry={true} onChangeText={e => setConfirmPassword(e)} />
                {validateConfirmPassword && (
                  <Text color={"#FF0000"}>{textConfirmPassword}</Text>
                )}
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={handleSignUp} disabled={disableButton} backgroundColor={colorButton}>
                Sign up
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  Already have an account?{" "}
                </Text>
                <Link
                  _text={{
                    color: "indigo.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  Login
                </Link>
              </HStack>
            </VStack>
            : <VStack>
              <FormControl>
                <FormControl.Label>OTP</FormControl.Label>
                <Input value={otp} onChangeText={e => setOtp(e)} />
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={handleVerify}>
                Verify
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  Already have an account?{" "}
                </Text>
                <Link
                  _text={{
                    color: "indigo.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  Login
                </Link>
              </HStack>
            </VStack>
          }

        </ScrollView>

      </Box>
      {snackBar ? <SnackBar backgroundColor={{ backgroundColor: "red" }} onPress={() => setSnackBar(false)} label={message} /> : null}
      {snackBarVerify ? <SnackBar backgroundColor={{ backgroundColor: "green" }} onPress={() => navigation.navigate("LoginScreen")} label={"Sign up new account successfully"} /> : null}
    </Center>

  );
};
