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
import {
  HandleLogin,
  forgotNewPassword,
  forgotPass,
  verifyForgotPass,
} from "../../Reducers/UserReducer";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Icon } from "react-native-vector-icons/AntDesign";
import SnackBar from "../../Component/Snackbar/Snackbar";
import { async } from "q";

export default ({ navigation }) => {
  const [phone, setPhone] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [otp, setOtp] = useState("");
  const [pageOTP, setPageOTP] = useState(false);
  const [snackBar, setSnackBar] = useState(false);
  const [validateOTP, setValidateOTP] = useState(false);
  const [validatePhone, setValidatePhone] = useState(false);
  const [validatePassword, setValidatePassword] = useState(false);
  const [validateConfirmPassword, setConfirmValidatePassword] = useState(false);
  const [errorTextConfirmPass, setErrorTextConfirmPass] = useState(
    "Xác nhận mật khẩu là 6 kí tự số"
  );
  const [pagePass, setPagePass] = useState(false);
  const [pagePhone, setPagePhone] = useState(true);
  const handleForgot = async () => {
    setPagePhone(false);
    setPageOTP(true);
    // if (!validate()) {
    //     if (!validatePhone) {
    //         const response = await forgotPass({ phone: phone });
    //         if (response) {
    //             setPageOTP(true);
    //             setPagePhone(false);
    //         }

    //     } else {
    //         console.log("abc")
    //     }
    // }
  };
  const handleVerifyForgot = async () => {
    setPagePass(true);
    setPageOTP(false);
    const response = await verifyForgotPass({ otp: otp });
    if (response) {
      setPagePass(true);
    } else {
      setValidateOTP(true);
    }
  };
  const forgotnewPassword = async () => {
    if (!validatePass()) {
      if (confirmPassword !== newPassword) {
        setErrorTextConfirmPass("Xác nhận mật khẩu không giống mật khẩu");
      } else {
        if (!validateConfirmPassword && !validatePassword) {
          console.log(phone);
          console.log(newPassword);
          const result = await forgotNewPassword({ phone, newPassword });
          if (result) {
            setSnackBar(true);
            setTimeout(() => {
              setSnackBar(false);
              navigation.navigate("LoginScreen");
            }, 2000);
          }
        }
      }
    }
  };
  const valPhone = (phone) => {
    var re = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    return re.test(phone);
  };
  const valPassword = (password) => {
    var re = /^[0-9]{6}\b/g;
    return re.test(password);
  };
  const valConfirmPassword = (confirmpassword) => {
    var re = /^[0-9]{6}\b/g;
    return re.test(confirmpassword);
  };

  const validatePass = () => {
    if (!valPassword(newPassword)) {
      setValidatePassword(true);
    } else {
      setValidatePassword(false);
    }
    if (
      !valConfirmPassword(confirmPassword) ||
      confirmPassword !== newPassword
    ) {
      setConfirmValidatePassword(true);
    } else {
      setConfirmValidatePassword(false);
    }
  };

  const validate = () => {
    if (!valPhone(phone)) {
      setValidatePhone(true);
    } else {
      setValidatePhone(false);
    }
  };

  return (
    <Center w="100%">
      {/* <Spinner visible={isLoading}></Spinner> */}
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="md"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Bạn quên mật khẩu tài khoản!
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
          Quên mật khẩu!
        </Heading>
        <VStack space={3} mt="5">
          {pagePhone ? (
            <View>
              <FormControl>
                <FormControl.Label>Số điện thoại</FormControl.Label>
                <Input
                  onChangeText={(e) => {
                    setPhone(e), setValidatePhone(false);
                  }}
                />
                {validatePhone && (
                  <Text color={"#FF0000"}>
                    Số điện thoại gồm 10 kí tự số và bắt đầu là kí tự số 0
                  </Text>
                )}
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={handleForgot}>
                Xác nhận
              </Button>
            </View>
          ) : (
            <View></View>
          )}
          {pageOTP ? (
            <View>
              <FormControl>
                <FormControl.Label>Mã xác thực OTP</FormControl.Label>
                <Input value={otp} onChangeText={(I) => setOtp(I)} />
                {validateOTP && (
                  <Text color={"#FF0000"}>
                    {" "}
                    Mã xác thực OTP không chính xác
                  </Text>
                )}
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={handleVerifyForgot}>
                Xác nhận
              </Button>
            </View>
          ) : (
            <View></View>
          )}
          {pagePass ? (
            <View>
              <FormControl>
                <FormControl.Label>Mật khẩu mới</FormControl.Label>
                <Input
                  secureTextEntry={true}
                  onChangeText={(e) => {
                    setNewPassword(e), setValidatePassword(false);
                  }}
                />
                {validatePassword && (
                  <Text color={"#FF0000"}>Mật khẩu là 6 kí tự số</Text>
                )}
              </FormControl>
              <FormControl>
                <FormControl.Label>Xác nhận mật khẩu</FormControl.Label>
                <Input
                  secureTextEntry={true}
                  onChangeText={(e) => {
                    setConfirmPassword(e), setConfirmValidatePassword(false);
                  }}
                />
                {validateConfirmPassword && (
                  <Text color={"#FF0000"}>{errorTextConfirmPass}</Text>
                )}
              </FormControl>
              <Button mt="2" colorScheme="indigo" onPress={forgotnewPassword}>
                Xác nhận
              </Button>
            </View>
          ) : (
            <View></View>
          )}
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              Đã có tài khoản ?{" "}
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
      </Box>
      {snackBar ? (
        <SnackBar
          backgroundColor={{ backgroundColor: "green" }}
          onPress={() => navigation.navigate("LoginScreen")}
          label={"Quên mật khẩu thành công"}
        />
      ) : null}
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
