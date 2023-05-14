import * as React from "react";
import { Center, NativeBaseProvider } from "native-base";
import ForgotPasswordComponent from "./ForgotPasswordComponent";

export default ({ navigation }) => {
    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <ForgotPasswordComponent navigation={navigation} />
            </Center>
        </NativeBaseProvider>
    );
};
