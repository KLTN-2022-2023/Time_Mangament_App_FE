import { Box, Button, Center, Heading, Input, TextArea, View, Text, Checkbox, VStack, HStack } from "native-base"
import { useEffect, useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
//import TaskDetail from "./TaskDetail.scss";
export default ({ navigation }) => {
    
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] =useState(false);
    const [open2, setOpen2] = useState(false);

    const [addDate, setAddDate] = useState();
    const [notify, setNotify] = useState();
    const [addDeadline, setAddDeadline] = useState();
    const [reuse, setReuse] = useState();
    const [description, setDescription] = useState();
    const styles = StyleSheet.create({
        button: {
            color: `'#1256F3'`,
            width: 280
        },
        icon: {
            fontSize: ''
        },
        view: {
            display: 'flex',
            flexDirection: 'row',
            color: '#11111',
            paddingTop: 10, 
            //paddingBottom: 10
        },
        textAreaContainer: {
            borderColor: 'grey',
            borderWidth: 1,
           // paddingTop: 10
          },
          textArea: {
            height: 150,
            justifyContent: "flex-start",
          }
    })
    return (
        <Center w="100%">
            <Box safeArea p="2" py="2" w="100%" maxW="350">
                <HStack>
                <Checkbox value="one" my={2}>
                    <Heading> Tên công việc </Heading> 
                </Checkbox>
                <Icon size={30} name="star"/>
                </HStack>
           
            <Input placeholder="Thêm bước"/>

            <View style={styles.view}>
                <Icon size={30} name="spinner"></Icon>
                <Button style={styles.button}>
                    Thêm vào Ngày của Tôi
                </Button>
            </View>
            <View style={styles.view} >
                <Icon size={30} name="bell"></Icon>
                <Button style={styles.button} onPress={() => setOpen(!open)}>
                    Nhắc tôi
                </Button>
            </View>
            {open ? <View>
                <TextInput>Cuối ngày</TextInput>
                <TextInput>Ngày mai</TextInput>
                <TextInput>Tuần tới</TextInput>
                <TextInput>Chọn ngày và giờ</TextInput>
            </View>
            : null}

            <View style={styles.view}>
                <Icon size={30} name="calendar"></Icon>
                <Button style={styles.button} onPress={() => setOpen1(!open1)}>
                    Thêm ngày đến hạn
                </Button>
            </View>
            {open1 ?<View>
                <TextInput>Mỗi 1 ngày</TextInput>
                <TextInput>Ngày trong tuần</TextInput>
                <TextInput>Mỗi 1 tuần</TextInput>
            </View> :null}

            <View style={styles.view}>
                <Icon size={30} name="spinner"></Icon>
                <Button style={styles.button}>
                    Lặp lại
                </Button>
            </View>
            {open2 ? <View>
                <TextInput>Mỗi ngày</TextInput>
                <TextInput>Ngày trong tuần</TextInput>
                <TextInput>Mỗi 1 tuần</TextInput>
                <TextInput>Mỗi tháng</TextInput>
            </View>:null}

            <View style={styles.view}>
                <Icon size={30} name="spinner"></Icon>
                <Input style={styles.button}>
                    Thêm tệp
                </Input>
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