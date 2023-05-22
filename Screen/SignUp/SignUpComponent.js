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
import { ScrollView } from "react-native";
import { signUp, verifyAccount } from "../../Reducers/UserReducer";
import SnackBar from "../../Component/Snackbar/Snackbar";



export default ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [modalOTP, setModalOTP] = useState(true);
  const [validateName, setValidateName] = useState(false);
  const [validateNumberPhone, setValidateNumberPhone] = useState(false);
  const [validateConfirmPassword, setValidateConfirmPassword] = useState(false);
  const [textConfirmPassword, setTextConfirmPassword] = useState("Confirm password is invalid");
  const [validatePass, setValidatePass] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [snackBarVerify, setSnackBarVerify] = useState(false);
  const [textPhone, setTextPhone] = useState("Number phone is invalid");
  const [otp, setOtp] = useState();
  const [validateOTP, setValidateOTP] = useState(false);

  const handleSignUp = async () => {
    if (!validate()) {
      if (confirmPassword === password && confirmPassword && name && password && phone) {
        if (!validateName && !validateNumberPhone && !validateConfirmPassword && !validatePass) {
          const result = await signUp({ name: name, phone: phone, password: password });
          if (result) {
            if (result.msg === "Phone already exist") {
              setValidateNumberPhone(true);
              setTextPhone("Phone allready exist");
              setModalOTP(true);
            }
            if (result.msg === "Successfully") {
              setModalOTP(false);
              setValidateNumberPhone(false);
            }
          } else {
            setModalOTP(false)
          }
        }
        else {
          console.log("aaaaaaaaaaaa")
        }
      }
    }
  }

  const handleVerify = async () => {
    const result = await verifyAccount({ otp: otp });
    if (result) {
      setSnackBarVerify(true)
      setTimeout(() => {
        navigation.navigate("LoginScreen");
      }, 2000);
    } else {
      setValidateOTP(true);
      setTimeout(() => {
        setValidateOTP(false);
      }, 3000)
    }
  }

  const validatePhone = (phone) => {
    var re = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    return re.test(phone)
  }

  const valPassword = (password) => {
    var re = /^[0-9]{6}\b/g;
    return re.test(password)
  }
  const valConfirmPassword = (confirmPassword) => {
    var re = /^[0-9]{6}\b/g;
    return re.test(confirmPassword)
  }
  const validate = () => {
    if (name.length <= 0) {
      setValidateName(true)
    }
    else {
      setValidateName(false);
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
            Sign up new account!
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
                <Input value={name} onChangeText={e => { setName(e), setValidateName(false), validate() }} />
                {validateName && (
                  <Text color={"#FF0000"}> Name is invalid </Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Phone</FormControl.Label>
                <Input value={phone} onChangeText={e => { setPhone(e), setValidateNumberPhone(false), validate() }} />
                {validateNumberPhone && (
                  <Text color={"#FF0000"}>{textPhone}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Input value={password} secureTextEntry={true} onChangeText={e => { setPassword(e), setValidatePass(false), validate() }} />
                {validatePass && (
                  <Text color={"#FF0000"}>Password is invalid</Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Confirm password</FormControl.Label>
                <Input value={confirmPassword} secureTextEntry={true} onChangeText={e => { setConfirmPassword(e), setValidateConfirmPassword(false), validate() }} />
                {validateConfirmPassword && (
                  <Text color={"#FF0000"}>{textConfirmPassword}</Text>
                )}
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={handleSignUp} >
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
                {validateOTP && (
                  <Text color={"#FF0000"}>OTP is incorrect</Text>
                )}
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
