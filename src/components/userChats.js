import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc'
import { UserType } from '../UserContext';

const UserChats = ({item}) => {
    const navigation = useNavigation()
    const {userId,setUserId}=useContext(UserType) 
    const [messagesArr, setMessagesArr] = useState([]);
    const [timeVal, setTimeVal] = useState("");
    const PressHandler = ()=>{
navigation.navigate("userChat",{recipientId:item._id})
    }
    const getTime = (val) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(val).toLocaleString("en-US", options);
      };

  useEffect(() => {
    getMessages();
//    setTime(getTime(valTime))

// setTimeVal()
// setTimeValgetTime(messagesArr[valTime]?.time));
},[val]);

const getMessages = async () => {
    try {
        const res = await fetch(
            `http://localhost:8163/messages/${userId}/${item._id}`
        );
        if (res.ok) {
            const data = await res.json();
            setMessagesArr(data);
            // setValTime(val)
            
        }
    } catch (error) {
        console.log("error while fetching messages", error);
    }
};
const getLastMessage = ()=>{

    const UserMessages = messagesArr.filter((message)   =>  message.messageType === "text")
    // console.log(UserMessages);
    const last = UserMessages.length
    console.log(last);
    return UserMessages[last-1]     
}
 const val = getLastMessage()
const data =getTime(val?.time)
console.log(val);
    return (
        <Pressable onPress={()=> PressHandler()}>
        <View style={{...tw`flex-row bg-white p-2 justify-between`}}>
     <View style={{...tw`flex-row `}}>       
<View>
<Image source={{uri:item.image}} style={{...tw`h-20 w-20`,borderRadius:50   }}    />
</View>
<View style={{...tw`ml-3 justify-center`}}>
            <Text style={{...tw`text-black font-bold text-xl mb-1`}}>{item.name}</Text>
            <Text style={{...tw`text-gray-400 `,fontSize:12}}>{val?.messageText}</Text>
</View>
</View>
<View style={{...tw`items-center justify-center`}}>
<Text style={{...tw`text-gray-500  mr-3`}}>{data}</Text>
</View>
        </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({})

export default UserChats;
