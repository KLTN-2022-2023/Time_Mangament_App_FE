import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar, Box, Center, HStack, NativeBaseProvider, Text, VStack, View } from "native-base";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import IconICon from "react-native-vector-icons/Ionicons";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { getUserById } from "../../Reducers/UserReducer";

const SettingComponent = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const HandleGetInfoUser = async () => {
        const token = await AsyncStorage.getItem("Token");
        if (token) {
            const decoded = jwt_decode(token);
            dispatch(getUserById({ userId: decoded._id }, token));
        }
    };
    useEffect(() => {
        HandleGetInfoUser();
    });

    const HandleLogOut = async () => {
        await AsyncStorage.removeItem("Token");
        navigation.navigate("LoginScreen");
    }
    const style = StyleSheet.create({
        padding: {
            paddingBottom: 20,
            paddingTop: 20
        },
        shadow: {
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            shadowColor: "#000000",
            borderColor: "#000000",
            shadowOpacity: 1.0,
            shadowRadius: 0,
            shadowOffset: {
                height: 3,
                width: 5,
            },
            elevation: 2,
        }
    })
    return (
        <NativeBaseProvider>
            <Center w="100%" paddingTop={5} >
                <Box safeArea p="2" py="2" w="100%" minW="350" width="100%" >
                    <HStack alignItems="center" justifyContent="flex-start" paddingBottom={6} width={"100%"}>
                        <IconICon
                            size={25}
                            name="arrow-back"
                            onPress={() => navigation.navigate("HomeTab", { screen: "Tasks" })}
                        />
                        <Text paddingLeft={8} fontSize={20} fontWeight={800}>Settings</Text>
                    </HStack>

                    <HStack width={"100%"}>
                        <View paddingLeft={50}>
                            <VStack paddingBottom={2}>
                                <Text fontWeight={800} fontSize={20}>{user.name}</Text>
                                <Text>{user.email}</Text>
                            </VStack>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <HStack paddingTop={5}>
                                <IconAntDesign name="profile" color={"#FF0000"} size={20} />
                                <Text paddingLeft={2} onPress={() => navigation.navigate("UserDetailScreen")} style={{ color: "red" }} paddingBottom={5} fontSize={15}>INFO PROFIE</Text>
                            </HStack>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <HStack w={"100%"} paddingTop={5}>
                                <IconMaterialIcons name="logout" color={"#0000FF"} size={20} />
                                <Text style={{ color: "#0000FF" }} paddingLeft={2} fontSize={15} onPress={HandleLogOut}>LOG OUT</Text>
                            </HStack>
                        </View>
                    </HStack>
                </Box>
            </Center>
        </NativeBaseProvider>
    )
}
export default SettingComponent;