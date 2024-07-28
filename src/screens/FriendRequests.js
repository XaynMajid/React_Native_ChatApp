import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc'
import { UserContext, UserType } from '../UserContext';
import RequestsComponent from '../components/RequestsComponent';

const FriendRequests = () => {
    const {userId,setUserId}=useContext(UserType)
    const [FriendRequestsArr,setFriendRequestsArr]=useState([])
useEffect(() => {
 GetFriendRequests()
}, []);

const GetFriendRequests= async()=>{
    try {
        let response= await axios.get(`http://localhost:8163/friend-requests/${userId}`)
        const FriendRequests = response.data.map((firendRequests)=>({_id:firendRequests._id,name:firendRequests.name,email:firendRequests.email,image:firendRequests.image}))
        setFriendRequestsArr(FriendRequests)       
    } catch (error) {
        console.log("error while fetching friends",error);
    }

}

    return (
        <View>
        {
            FriendRequestsArr.length > 0 && <Text style={{...tw`text-black text-xl p-3`}}>Your Friend Requests</Text>
        }
        {
            FriendRequestsArr.map((item,index)=>(
            <RequestsComponent item={item} key={index} FriendRequestsArr={FriendRequestsArr} setFriendRequestsArr={setFriendRequestsArr} />
            ))
        }
        </View>
    );
}

const styles = StyleSheet.create({})

export default FriendRequests;
