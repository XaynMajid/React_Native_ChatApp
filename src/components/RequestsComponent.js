import React, { useContext } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc'
import { UserContext, UserType } from '../UserContext';
import { useNavigation } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');

const RequestsComponent = ({item,setFriendRequestsArr,FriendRequestsArr}) => {
    const navigation = useNavigation()
    const {userId,setUserId}=useContext(UserType) 
    const PressableHandler =async(FriendRequestSender)=>{
    console.log("hi");
try {
    const res = await fetch("http://localhost:8163/friend-request/accept",{
        method:"Post",
        headers:{
            "Content-Type":"Application/json"
        },
        body:JSON.stringify({
            senderId:FriendRequestSender,
            recipientId:userId
        })
                })
if(res.ok){
setFriendRequestsArr(FriendRequestsArr.filter((req)=> req._id !== FriendRequestSender ))
navigation.navigate("Chats")
}

} catch (error) {
    console.log("error while sending req",error);

}

    }
    return (
        <Pressable onPress={()=>PressableHandler()}>
        <View style={{...tw` flex-row items-center  justify-between`}}>
            <View style={{...tw` flex-row items-center mb-3 ml-2`}} >
            <View >
            <Image source={{uri:item.image}} style={{...tw`h-20 w-20`,borderRadius:50}} /> 
            </View>
            <View style={{...tw` `,width:width*0.55}}>
<Text style={{...tw`text-black text-xl p-3`}}><Text style={{...tw`bold`}}>{item?.name}</Text> Sents you Friend a Request  </Text>
            </View>
            </View>
            <View>
<TouchableOpacity style={{...tw`font-bold py-2 px-2 rounded-full `}} onPress={()=>PressableHandler(item._id)}>
    <Text   style={{...tw`text-white bg-slate-500 px-4 py-3 rounded-lg `}}>
        Accept
    </Text>
</TouchableOpacity>
            </View>
        </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({})

export default RequestsComponent;
