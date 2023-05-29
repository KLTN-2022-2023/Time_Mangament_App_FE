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
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [modalOTP, setModalOTP] = useState(true);
  const [validateName, setValidateName] = useState(false);
  const [validateNumberPhone, setValidateNumberPhone] = useState(false);
  const [validateConfirmPassword, setValidateConfirmPassword] = useState(false);
  const [textConfirmPassword, setTextConfirmPassword] = useState("Mật khẩu phải là 6 ký tự số");
  const [validatePass, setValidatePass] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [snackBarVerify, setSnackBarVerify] = useState(false);
  const [textPhone, setTextPhone] = useState("Số điện thoại phải là 10 ký tự số và bắt đầu là ký tự số 0");
  const [otp, setOtp] = useState();
  const [validateOTP, setValidateOTP] = useState(false);

  const handleSignUp = async () => {
    if (!validate()) {
      if (confirmPassword && name && password && phone) {
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
          }
        }
        else {
          console.log("Data is invalid")
        }
      }
    }
  }

  const handleVerify = async () => {
    const result = await verifyAccount({ otp: otp });
    console.log(result);
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
    if (!name) {
      setValidateName(true);
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
    if (!valConfirmPassword(confirmPassword) || confirmPassword !== password) {
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
            Đăng ký tài khoản mới!
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
            Đăng ký tài khoản!
          </Heading>
          {modalOTP ?
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label>Tên</FormControl.Label>
                <Input value={name} onChangeText={e => { setName(e), setValidateName(false) }} />
                {validateName && (
                  <Text color={"#FF0000"}> Tên không được để trống </Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Số điện thoại</FormControl.Label>
                <Input value={phone} onChangeText={e => { setPhone(e), setValidateNumberPhone(false) }} />
                {validateNumberPhone && (
                  <Text color={"#FF0000"}>{textPhone}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormControl.Label>Mật khẩu</FormControl.Label>
                <Input value={password} secureTextEntry={true} onChangeText={e => { setPassword(e), setValidatePass(false) }} />
                {validatePass && (
                  <Text color={"#FF0000"}>Mật khẩu là 6 ký tự số </Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
                <Input value={confirmPassword} secureTextEntry={true} onChangeText={e => { setConfirmPassword(e), setValidateConfirmPassword(false) }} />
                {validateConfirmPassword && (
                  <Text color={"#FF0000"}>{textConfirmPassword}</Text>
                )}
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={handleSignUp} >
                Đăng ký
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  Đã có sẵn tài khoản?{" "}
                </Text>
                <Link
                  _text={{
                    color: "indigo.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  Đăng nhập
                </Link>
              </HStack>
            </VStack>
            : <VStack>
              <FormControl>
                <FormControl.Label>OTP</FormControl.Label>
                <Input value={otp} onChangeText={e => setOtp(e)} />
                {validateOTP && (
                  <Text color={"#FF0000"}>Mã OTP không chính xác</Text>
                )}
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={handleVerify}>
                Xác nhận
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  Đã có sẵn tài khoản?{" "}
                </Text>
                <Link
                  _text={{
                    color: "indigo.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  Đăng nhập
                </Link>
              </HStack>
            </VStack>
          }
        </ScrollView>
      </Box>
      {snackBar ? <SnackBar backgroundColor={{ backgroundColor: "red" }} onPress={() => setSnackBar(false)} label={message} /> : null}
      {snackBarVerify ? <SnackBar backgroundColor={{ backgroundColor: "green" }} onPress={() => navigation.navigate("LoginScreen")} label={"Đăng ký tài khoản thành công"} /> : null}
    </Center>

  );
};
