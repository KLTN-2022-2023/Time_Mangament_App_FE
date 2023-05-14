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
import { HandleLogin, forgotPass, verifyForgotPass } from "../../Reducers/UserReducer";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Icon } from "react-native-vector-icons/AntDesign"

export default ({ navigation }) => {
    const [phone, setPhone] = useState();
    const [newPassword, setNewPassword] = useState();
    const [otp, setOtp] = useState("");
    const [pageOTP, setPageOTP] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const handleForgot = async () => {
        const response = await forgotPass({ phone: phone, newPass: newPassword });
        if (response) {
            setPageOTP(false);
        }
    }
    const handleVerifyForgot = async () => {
        const response = await verifyForgotPass({ otp: otp });
        if (response) {
            navigation.navigate("LoginScreen");
        }
    }

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
                    Forgot password!
                </Heading>
                <VStack space={3} mt="5">
                    {pageOTP ?
                        <View>
                            <FormControl>
                                <FormControl.Label>Phone</FormControl.Label>
                                <Input onChangeText={e => setPhone(e)} />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>New Password</FormControl.Label>
                                <Input onChangeText={e => setNewPassword(e)} />
                            </FormControl>
                            <Button mt="2" colorScheme="indigo" onPress={handleForgot}>
                                Send
                            </Button>
                        </View>

                        :
                        <View>
                            <FormControl>
                                <FormControl.Label>OTP</FormControl.Label>
                                <Input value={otp} onChangeText={I => setOtp(I)} />
                            </FormControl>
                            <Button mt="2" colorScheme="indigo" onPress={handleVerifyForgot}>Verify</Button>
                            <Link
                                paddingTop={5}
                                alignItems="center"
                                justifyContent="center"
                                _text={{
                                    color: "indigo.500",
                                    fontWeight: "medium",
                                    fontSize: "sm",
                                }}
                                onPress={() => setPageOTP(true)}
                            >
                                Go back
                            </Link>
                        </View>
                    }
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
