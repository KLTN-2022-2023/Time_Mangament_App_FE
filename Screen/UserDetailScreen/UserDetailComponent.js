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
import { UpdateProfile, getUserById } from "../../Reducers/UserReducer";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import IconICon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import SnackBar from "../../Component/Snackbar/Snackbar";

export default ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [age, setAge] = useState();
  const [image, setImage] = useState(null);
  const [snackbar, setSnackBar] = useState(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const HandleGetInfoUser = async () => {
    const token = await AsyncStorage.getItem("Token");
    if (token) {
      const decoded = jwt_decode(token);
      dispatch(getUserById({ userId: decoded._id }, token));
    }
  };

  const HandleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("Token");
    try {
      const decoded = jwt_decode(token);
      const userId = decoded._id;
      const response = await UpdateProfile({userId, email, name, address, age}, token);
      setSnackBar(true);
    } catch (err) {

    }
  }

  useEffect(() => {
      HandleGetInfoUser();
    }, []);

  const style = StyleSheet.create({
    title: {
      fontWeight: 800,
      fontSize: 18
    },
    heading: {
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop:20
    },
    buttonSave: {
      color: "#0000FF",
      fontSize: 20
    },
    text: {
      fontSize:18
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
    }
  })
  return (
      <NativeBaseProvider>     
         <Box safeArea p="2" py="2" w="100%" maxW="350" width={500}>
              <View>
                <HStack alignItems={"center"}>
                  <IconICon size={25}
                        name="arrow-back"
                        onPress={() => navigation.navigate("SettingScreen")}/>
                  
                  <Text fontWeight={800} fontSize={20} paddingLeft={5}>Profile</Text>
                </HStack>
                <HStack style={style.heading}>
                  <TouchableOpacity onPress={pickImage}>
                    <Avatar  bg="amber.500" source={{
                      uri: image
                    }} />
                  </TouchableOpacity>
                  <Text style={style.buttonSave} onPress={HandleUpdateProfile}>Save</Text>
                </HStack>
                <HStack alignItems="center" marginTop={5} style={style.shadow} height={10} >
                  <Text style={style.title}>Email: </Text>
                  <TextInput style={style.text}  value = {user.email} editable={false} onChangeText={(e) => setEmail(e)} />
                </HStack>
                <HStack alignItems="center" style={style.shadow} marginTop={5} height={10} >
                  <Text style={style.title}>Name: </Text>
                  <TextInput style={style.text} value = {user.name} onChangeText={(e) => setName(e)} />
                </HStack>
                <HStack alignItems="center" style={style.shadow} marginTop={5} height={10}>
                  <Text style={style.title}>Address: </Text>
                  <TextInput style={style.text} value = {user.address} onChangeText={(e) => setAddress(e)} />
                </HStack>
                <HStack alignItems="center" style={style.shadow} marginTop={5} height={10}>
                  <Text style={style.title}>Age: </Text>
                  <TextInput style={style.text} value={user.age} onChangeText={(e) => setAge(e)} />
                </HStack>
               
              </View>

              { snackbar ? <SnackBar  onPress={() => setSnackBar(false)} /> : null }
        </Box>
      </NativeBaseProvider>


  );
};
