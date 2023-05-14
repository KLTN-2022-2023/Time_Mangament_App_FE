import { Box, Center, Heading, Input, View, Text, Checkbox, HStack, Popover, NativeBaseProvider } from "native-base"
import { useState } from "react";
import { TextInput, StyleSheet, TouchableOpacity, PermissionsAndroid } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';


const TaskDetailComponent= ({ navigation }) => {
    const [singleFile, setSingleFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] =useState(false);
    const [open2, setOpen2] = useState(false);

    const [addDate, setAddDate] = useState();
    const [notify, setNotify] = useState();
    const [addDeadline, setAddDeadline] = useState();
    const [reuse, setReuse] = useState();
    const [description, setDescription] = useState();
    const [selected, setSelected] = useState(undefined);
    const styles = StyleSheet.create({
        header: {
            alignContent: "center",
            justifyContent: "flex-start"
        },
        text_header:{
            paddingLeft: 30,
            fontSize: 20,
            paddingBottom: 30,
        },
        button: {
           // color: `'#1256F3'`,
          //  width: 280
        },
        icon: {
            paddingBottom:10,
            paddingLeft: 10
        },
        view: {
            borderWidth: 0.5,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'row',
            color: '#11111',
            paddingTop: 10,
            marginTop: 10, 
            gap: 20,
            alignContent: "center"
        },
        textAreaContainer: {
            marginTop: 10,
            borderColor: 'grey',
            borderWidth: 1,
            borderRadius:20
          },
        textArea: {
            height: 150,
            justifyContent: "flex-start",
          },
          title: {
            justifyContent: "space-between",
            alignContent: "center"
          },
    });
    const checkPermissions = async () => {
        try {
          const result = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
    
          if (!result) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title:
                  'You need to give storage permission to download and save the file',
                message: 'App needs access to your camera ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('You can use the camera');
              return true;
            } else {
              Alert.alert('Error', I18n.t('PERMISSION_ACCESS_FILE'));
    
              console.log('Camera permission denied');
              return false;
            }
          } else {
            return true;
          }
        } catch (err) {
          console.warn(err);
          return false;
        }
      };
    
      async function selectFile() {
        try {
          const result = await checkPermissions();
    
          if (result) {
            const result = await DocumentPicker.getDocumentAsync({
              copyToCacheDirectory: false,
              type: 'image/*',
            });
    
            if (result.type === 'success') {
              // Printing the log realted to the file
              console.log('res : ' + JSON.stringify(result));
              // Setting the state to show single file attributes
              setSingleFile(result);
            }
          }
        } catch (err) {
          setSingleFile(null);
          console.warn(err);
          return false;
        }
      }
    return (
    <Center w="100%">
        <Box safeArea p="2" py="2" w="100%" maxW="350">
            <HStack style={styles.header}>
                <Icon onPress={() => navigation.navigate("TaskListScreen")} name="angle-left" size={20}/>
                <Text style={styles.text_header}>Test</Text>
            </HStack>
            <HStack style={styles.title}>
                <Checkbox value="one" my={2}>
                    <Heading> Tên công việc </Heading> 
                </Checkbox>
                <Icon size={30}  name="star-o"/>
            </HStack>
        
            <Input placeholder="Thêm bước"/>

            <View style={styles.view}>
                <Icon size={25} name="spinner" style={styles.icon}></Icon>
                <TouchableOpacity style={styles.button}>
                    <Text>Thêm vào Ngày của Tôi</Text>
                </TouchableOpacity>
            </View>

            <Popover trigger={triggerProps => {
            return (
                <View style={styles.view}  >
                <Icon size={25} name="bell" style={styles.icon} ></Icon>
                    <Text {...triggerProps}>
                    Nhắc tôi
                    </Text>
                </View>);
            }}>
                <Popover.Content w="56">
                <Popover.Body>
                        <HStack paddingBottom={5}>
                            <Icon name="clock-o" size={20}/>
                            <Text style={{paddingLeft:10}}>Cuối ngày</Text>
                        </HStack>
                        <HStack paddingBottom={5}>
                            <Icon name="clock-o" size={20}/>
                            <Text style={{paddingLeft:10}}>Ngày mai</Text>
                        </HStack>
                        <HStack paddingBottom={5}>
                            <Icon name="clock-o" size={20}/>
                            <Text style={{paddingLeft:10}}>Tuần tới</Text>
                        </HStack>
                </Popover.Body>
                </Popover.Content>
            </Popover>

            <Popover trigger={triggerProps => {
            return (
                <View style={styles.view}  >
                <Icon size={25} name="calendar-o" style={styles.icon} ></Icon>
                    <Text {...triggerProps}>
                    Thêm ngày đến hạn
                    </Text>
                </View>);
            }}>
                <Popover.Content w="56">
                <Popover.Body>
                        <HStack paddingBottom={5}>
                            <Icon name="calendar-o" size={20}/>
                            <Text style={{paddingLeft:10}}>Hôm nay</Text>
                        </HStack>
                        <HStack paddingBottom={5}>
                            <Icon name="calendar-o" size={20}/>
                            <Text style={{paddingLeft:10}}>Ngày mai</Text>
                        </HStack>
                        <HStack paddingBottom={5}>
                            <Icon name="calendar-o" size={20}/>
                            <Text style={{paddingLeft:10}}>Tuần tới</Text>
                        </HStack>
                </Popover.Body>
                </Popover.Content>
            </Popover>

            <Popover trigger={triggerProps => {
            return (
                <View style={styles.view}>
                <Icon size={25} name="retweet" style={styles.icon} ></Icon>
                    <Text {...triggerProps}>
                    Lặp lại
                    </Text>
                </View>);
            }}>
                <Popover.Content w="56">
                <Popover.Body>
                        <HStack paddingBottom={5}>
                            <Icon name="magic" size={20}/>
                            <Text style={{paddingLeft:10}}>Mỗi 1 ngày</Text>
                        </HStack>
                        <HStack paddingBottom={5}>
                            <Icon name="magic" size={20}/>
                            <Text style={{paddingLeft:10}}>Mỗi tuần</Text>
                        </HStack>
                        <HStack paddingBottom={5}>
                            <Icon name="magic" size={20}/>
                            <Text style={{paddingLeft:10}}>Mỗi tháng</Text>
                        </HStack>
                        <HStack paddingBottom={5}>
                            <Icon name="magic" size={20}/>
                            <Text style={{paddingLeft:10}}>Mỗi năm</Text>
                        </HStack>
                </Popover.Body>
                </Popover.Content>
            </Popover>

            <View style={styles.view}>
                <Icon size={25} name="paperclip" style={styles.icon}></Icon>
                <TouchableOpacity style={styles.button} onPress={selectFile}>
                    <Text>Thêm tệp</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.textAreaContainer} >
                <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="Thêm ghi chú"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                />
            </View>
        </Box>
    </Center>
    )
}
export default TaskDetailComponent;