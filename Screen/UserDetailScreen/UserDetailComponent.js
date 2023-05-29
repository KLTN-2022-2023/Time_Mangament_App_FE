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
  Avatar,
  View,
  Image,
  NativeBaseProvider,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  UpdateProfile,
  getInfoUser,
  getUserById,
  getUser,
} from "../../Reducers/UserReducer";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import IconICon from "react-native-vector-icons/Ionicons";
import IconFontisto from "react-native-vector-icons/Fontisto";
import * as ImagePicker from "expo-image-picker";
import SnackBar from "../../Component/Snackbar/Snackbar";

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [update, setUpdate] = useState(false);
  const [snackbar, setSnackBar] = useState(false);

  const HandleGetInfoUser = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      const result = await getInfoUser({ userId: decoded._id }, token);
      const data = result;
      setName(data.name);
      setPhone(data.phone);
    }
  };

  const HandleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("Token");
    try {
      const decoded = jwt_decode(token);
      const userId = decoded._id;
      const response = await UpdateProfile({ userId, name, phone }, token);
      console.log(response)
      setSnackBar(true);
    } catch (err) { }
  };

  useEffect(() => {
    HandleGetInfoUser();
  }, []);

  const style = StyleSheet.create({
    title: {
      fontWeight: 800,
      fontSize: 18,
    },
    heading: {
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 20,
    },
    buttonSave: {
      color: "#0000FF",
      fontSize: 20,
    },
    text: {
      fontSize: 18,
    },
    shadow: {
      paddingLeft: 5,
      shadowColor: "#000000",
      borderColor: "#000000",
      shadowOpacity: 1.0,
      shadowRadius: 0,
      shadowOffset: {
        height: 1,
        width: 3,
      },
      elevation: 1,
    },
  });
  return (
    <NativeBaseProvider>
      <Box safeArea p="2" py="2" w="100%" maxW="350" width={500}>
        <View>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <HStack alignItems={"center"} backgroundColor={"#FF00000"}>
              <IconICon
                size={25}
                color={"#000000"}
                name="arrow-back"
                onPress={() =>
                  navigation.navigate("HomeTab", {
                    screen: "Settings",
                    params: { name: name },
                  })
                }
              />
              <Text
                color={"#000000"}
                fontWeight={800}
                fontSize={20}
                paddingLeft={5}
              >
                Thông tin cá nhân
              </Text>
            </HStack>
            {update ? (
              <Text
                style={style.buttonSave}
                fontWeight={500}
                onPress={HandleUpdateProfile}
              >
                Cập nhật
              </Text>
            ) : null}
          </HStack>
          <View backgroundColor={"white"} marginTop={5} alignItems={"center"}>
            <Avatar
              size={"2xl"}
              bg="green.500"
              source={{
                uri: "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg",
              }}
            >
              AJ
            </Avatar>
            <View>
              <HStack alignItems="center" marginTop={5} height={10} >
                <IconFontisto name="male" size={20} color={"#000000"} />
                <TextInput
                  paddingLeft={20}
                  style={style.text}
                  value={name}
                  onChangeText={(e) => {
                    setName(e), setUpdate(true);
                  }}
                />
              </HStack>
              <HStack alignItems="center" marginTop={5} height={10}>
                <IconICon name="call-outline" size={20} color={"#000000"} />
                <TextInput
                  paddingLeft={20}
                  style={style.text}
                  value={phone}
                  editable={false}
                  onChangeText={(e) => setPhone(e)}
                />
              </HStack>
            </View>
          </View>
        </View>
      </Box>
      {snackbar ? (
        <SnackBar
          label={"Thay đổi thông tin thành công"}
          backgroundColor={{ backgroundColor: "green" }}
          onPress={() => setSnackBar(false)}
        />
      ) : null}
    </NativeBaseProvider>
  );
};
